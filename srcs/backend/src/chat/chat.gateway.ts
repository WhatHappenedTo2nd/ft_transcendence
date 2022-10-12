import { InternalServerErrorException, Logger } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Namespace, Socket } from "socket.io";
import { ChatRepository } from "./chat.repository";
import { Chat } from "./chat.entity";
import { ChatUser } from "./chatuser.entity";
import { ChatUserRepository } from "./chatuser.repository";
import { Equal } from "typeorm";
import { UserRepository } from "src/user/user.repository";
import { ChatService } from "./chat.service";
import { FriendRepository } from "src/friend/friend.repository";
import * as bcrypt from 'bcryptjs';
import Room from "src/games/class/game-room.class";
interface MessagePayload {
	userIntraId: string;
	roomId: number;
	roomName: string;
	password: string;
	message: string;
	name: string;
}

@WebSocketGateway({
	namespace: 'api/chat',
	cors: {
		origin: ['http://localhost:3000'],
	},
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() nsp: Namespace;
	constructor (
		private chatRepository: ChatRepository,
		private chatUserRepository: ChatUserRepository,
		private userRepository: UserRepository,
		private chatService: ChatService,
		private friendRepository: FriendRepository,
	) {}

	private logger = new Logger('ChatGateWay');

	// 소켓이 연결되면 실행
	handleConnection(@ConnectedSocket() socket: Socket) {
		this.logger.log(`${socket.id} 소켓 연결`);
	}

	// 소켓 연결이 끊기면 실행
	handleDisconnect(@ConnectedSocket() socket: Socket) {
		this.logger.log(`${socket.id} 소켓 연결 해제`);
	}

	@SubscribeMessage('save-socket')
	async saveSocketData(
		@ConnectedSocket() socket: Socket,
		@MessageBody() { userIntraId }: MessagePayload
	) {
		this.logger.log(`현재 socket id: ${socket.id}`);
		await this.userRepository.saveSocketId(socket.id, userIntraId);
	}

	@SubscribeMessage('message')
	async handleMessage(
		@ConnectedSocket() socket: Socket,
		@MessageBody() { roomId, message, name, userIntraId }: MessagePayload
	) {
		const socket_id = socket.id;
		const user = await this.userRepository.findByIntraId(userIntraId);
		const mutedUser = await this.chatUserRepository.isMutedUser(user);
		if (mutedUser && mutedUser.is_muted === true) {
			this.logger.log(`${mutedUser.user_id.intra_id}는 뮤트됨`);
		} else {
			// socket.broadcast.to(roomName).except().emit('message', { name, message });
			const room = await this.chatRepository.findOneById(roomId);
			// 채팅방에 속한 모든 유저 목록을 가져옴
			const chatUsers = await this.chatUserRepository.getAllChatUsers(room);
			// 채팅방에 속한 유저들 중 나를 차단한 사람 목록을 가져옴
			const whoBlockedMe = await this.chatService.findWhoBlockedMe(user, room);

			if (whoBlockedMe.length === 0) {
				this.logger.log('block한 사람이 없어');
				socket.broadcast.to(String(roomId)).emit('message', { name, message });
			} else {
				// 채팅방에 있는 모든 사람들 중에
				for (let e of chatUsers) {
					// 날 블락한 사람들 목록 중에
					for (let i of whoBlockedMe) {
						// Friend 테이블에서 user_id가 날 블락한 사람이고, another_id가 나인 row 찾음.
						const row = await this.friendRepository.findRow(i, user);
						// 만약 찾으면 거기서 block이 true이면 i가 날 차단한 것
						if (row && row.block === true) {
							this.logger.log(`${row.user_id.intra_id}가 나 블락함`);
						} else {
							this.logger.log(`${e.user_id.intra_id}는 나 블락 안 함`);
							// 날 차단하지 않은 유저의 소켓에먄 메세지 전송.
							socket.to(e.user_id.socket_id).emit('message', { name, message });
						}
					}
				}
			}
		}
		return { name, message, socket_id };
	}

	@SubscribeMessage('room-list')
	handleRoomList() {
		return this.chatRepository.find({});
	}


	@SubscribeMessage('create-room')
	async handleCreateRoom(
		@ConnectedSocket() socket: Socket,
		@MessageBody() {roomName, password, userIntraId}: MessagePayload
		) {
			const user = await this.userRepository.findByIntraId(userIntraId);
			const exists = await this.chatRepository.findOneByRoomname(roomName);
			if (exists) {
				return { success: false, payload: `${roomName} : 이미 선점된 방입니다.` };
			}
			const room = this.chatRepository.create({title: roomName, host: user});
			if (password) {
				var bcrypt = require('bcryptjs');
				var salt = bcrypt.genSaltSync(10);
				var hash = bcrypt.hashSync(password, salt);
				room.password = hash;
				room.is_private = true;
			}
			await this.chatRepository.insert(room);
			await this.chatUserRepository.addUser(room, user);

			socket.join(String(room.id)); // 기존에 없던 room으로 join하면 room이 생성됨

			return { success: true, payload: room.id };
		}

	@SubscribeMessage('join-room')
	async handleJoinRoom(
		@ConnectedSocket() socket: Socket,
		@MessageBody() { roomName, password, userIntraId }: MessagePayload
	) {
		this.logger.log(`join-room을 실행합니다.`);
		this.logger.log(`roomName: ${roomName}, password: ${password}, userIntraId: ${userIntraId}`);
		const user = await this.userRepository.findByIntraId(userIntraId);
		if (user)
		{
			this.logger.log(`chat joinRoom user는 ${user.nickname}입니다`);
		}
		const room: Chat = await this.chatRepository.findOneByRoomname(roomName);
		if (password) {
			if (!bcrypt.compareSync(password, room.password))
			return { success: false };
		}
		const find: ChatUser = await this.chatUserRepository.findRow(room, user);
		if (find) {
			return { success: true, payload: room.id };
		}
		socket.join(String(room.id)); // join room
		const chatuser: ChatUser = this.chatUserRepository.create({
			chat_id: room,
			user_id: user,
			is_muted: false,
		});
		try {
			this.chatUserRepository.save(chatuser);
		} catch(error) {
			throw new InternalServerErrorException();
		}
		return { success: true, payload: room.id };
	}

	@SubscribeMessage('leave-room')
	async handleLeaveRoom(
		@ConnectedSocket() socket: Socket,
		@MessageBody() { roomId, userIntraId }: MessagePayload
	) {
		socket.leave(String(roomId)); // leave room
		const user = await this.userRepository.findByIntraId(userIntraId);
		if (user)
		{
			this.logger.log(`chat leaveRoom user는 ${user.nickname}입니다`);
		}
		const room: Chat = await this.chatRepository.findOneById(roomId);
		await this.chatUserRepository.deleteUser(room, user);
		const check = await this.chatUserRepository.find({
			where: {
				chat_id: {id: Equal(room.id)},
			}
		});
		if (!check.length) {
			await this.chatRepository.deleteRoom(room.title);
		} else {
			const newHost = await this.chatUserRepository.findNextHost(room);
			await this.chatRepository.succedingHost(room, newHost);
		}
		return { success: true };
	}

	@SubscribeMessage('edit-room')
	async handleEditRoom(
		@ConnectedSocket() socket: Socket,
		@MessageBody() {password, userIntraId}: MessagePayload
		) {
			// roomname -> 새로 바꿀 방 이름
			// password -> 새로 바꿀 방의 패스워드
			const user = await this.userRepository.findByIntraId(userIntraId);
			const targetRoom = await this.chatService.getWhereAreYou(user.nickname);
			if (!password) {
				targetRoom.password = null;
				targetRoom.is_private = false;
			} else {
				var bcrypt = require('bcryptjs');
				var salt = bcrypt.genSaltSync(10);
				var hash = bcrypt.hashSync(password, salt);
				targetRoom.password = hash;
				targetRoom.is_private = true;
			}
			await this.chatRepository.save(targetRoom);
			return { success: true }
		}

	@SubscribeMessage('kick-room')
	async handleKickRoom(
		@ConnectedSocket() socket: Socket,
		@MessageBody() {roomName, userIntraId}: MessagePayload
		) {
			// roomname -> 새로 바꿀 방 이름
			// userIntraId -> 여기서는 targetName입니다 :)
			const user = await this.userRepository.findByNickname(userIntraId);
			await this.chatService.kickUser(roomName, userIntraId);
			this.nsp.to(user.socket_id).emit('kick-room');
			this.nsp.in(user.socket_id).socketsLeave(roomName);
			return { success: true }
	}

	@SubscribeMessage("invite-room")
	async handleInviteRoom(
		@ConnectedSocket() socket: Socket,
		@MessageBody() { name, userIntraId }: MessagePayload
		) {
			// name -> targetname
			// userIntraId -> 본인!
			const targetuser = await this.userRepository.findByNickname(name);
			const me = await this.userRepository.findByIntraId(userIntraId);
			const prevroom = await this.chatService.getWhereAreYou(me.nickname);
			await this.chatUserRepository.deleteUser(prevroom, targetuser);
			await this.chatUserRepository.deleteUser(prevroom, me);
			socket.leave(String(prevroom.id));
			this.nsp.in(targetuser.socket_id).socketsLeave(String(prevroom.id));
			var bcrypt = require('bcryptjs');
			var salt = bcrypt.genSaltSync(10);
			var hash = bcrypt.hashSync(name, salt);
			const newroom = this.chatRepository.create({title: name, host: me, password: hash, is_private: true});
			await this.chatRepository.insert(newroom);
			await this.chatUserRepository.addUser(newroom, targetuser);
			await this.chatUserRepository.addUser(newroom, me);
			socket.join(String(newroom.id));
			this.nsp.in(targetuser.socket_id).socketsJoin(String(newroom.id));
			socket.emit('invite-room-end', {payload: newroom.id});
			this.nsp.to(targetuser.socket_id).emit('invite-room-end', {payload: newroom.id});
			return { success: true, payload: newroom.id }
	}
}
