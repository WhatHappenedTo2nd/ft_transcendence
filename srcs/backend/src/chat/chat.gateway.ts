import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Namespace, Socket } from "socket.io";
import { ChatRepository } from "./chat.repository";
import { Chat } from "./chat.entity";
import { ChatUser } from "./chatuser.entity";
import { ChatUserRepository } from "./chatuser.repository";
import { Equal } from "typeorm";
import { UserRepository } from "src/user/user.repository";
import { ChatService } from "./chat.service";

interface MessagePayload {
	userIntraId: string;
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
	) {}

	private logger = new Logger('ChatGateWay');

	// 초기화 이후에 실행
	// afterInit() {
	// 	this.nsp.adapter.on('delete-room', (room) => {
	// 		const deletedRoom = createdRooms.find(
	// 			(createdRoom) => createdRoom === room,
	// 		);
	// 		if (!deletedRoom) return;


	// 		this.nsp.emit('delete-room', deletedRoom);
	// 		createdRooms = createdRooms.filter(
	// 			(createdRoom) => createdRoom !== deletedRoom,
	// 		); // 유저가 생성한 room 목록 중에 삭제되는 room 있으면 제거
	// 	});

	// 	this.logger.log('웹소켓 서버 초기화');
	// }

	// 소켓이 연결되면 실행
	handleConnection(@ConnectedSocket() socket: Socket) {
		this.logger.log(`${socket.id} 소켓 연결`);
	}

	// 소켓 연결이 끊기면 실행
	handleDisconnect(@ConnectedSocket() socket: Socket) {
		this.logger.log(`${socket.id} 소켓 연결 해제`);
	}

	@SubscribeMessage('message')
	async handleMessage(
		@ConnectedSocket() socket: Socket,
		@MessageBody() { roomName, message, name, userIntraId }: MessagePayload
	) {
		const socket_id = socket.id;
		const user = await this.userRepository.findByIntraId(userIntraId);
		const mutedUser = await this.chatUserRepository.isMutedUser(user);
		if (mutedUser && mutedUser.is_muted === true) {
			;
		} else {
			// socket.broadcast.to(roomName).except().emit('message', { name, message });
			const room = await this.chatRepository.findOneByRoomname(roomName);
			const chatUsers = await this.chatUserRepository.getAllChatUsers(room);
			const whoBlockedMe = await this.chatService.findWhoBlockedMe(user, room);
			chatUsers.forEach((e) => {
				whoBlockedMe.forEach((elem) => {
					if (e.user_id === elem) {
						;
					} else {
						// socket.to(elem.socket_id).emit('message', { name, message });
					}
				})
			})
			// socket.broadcast.to(roomName).emit('message', { name, message });
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
				room.password = password;
				room.is_private = true;
			}
			await this.chatRepository.insert(room);
			await this.chatUserRepository.addUser(room, user);
			socket.join(roomName); // 기존에 없던 room으로 join하면 room이 생성됨
			this.nsp.emit('create-room', roomName); // 대기실 방 생성

			return { success: true, payload: roomName };
		}

	@SubscribeMessage('join-room')
	async handleJoinRoom(
		@ConnectedSocket() socket: Socket,
		@MessageBody() { roomName, password, userIntraId }: MessagePayload
	) {
		const user = await this.userRepository.findByIntraId(userIntraId);
		if (user)
		{
			this.logger.log(`chat joinRoom user는 ${user.nickname}입니다`);
		}
		socket.join(roomName); // join room
		const room: Chat = await this.chatRepository.findOneByRoomname(roomName);
		if (password && (password !== room.password)) {
			return { success: false };
		}
		const find: ChatUser = await this.chatUserRepository.findRow(room, user);
		if (find) {
			return { success: true };
		}
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
		return { success: true };
	}

	@SubscribeMessage('leave-room')
	async handleLeaveRoom(
		@ConnectedSocket() socket: Socket,
		@MessageBody() {roomName, userIntraId}: MessagePayload
	) {
		socket.leave(roomName); // leave room
		const user = await this.userRepository.findByIntraId(userIntraId);
		if (user)
		{
			this.logger.log(`chat leaveRoom user는 ${user.nickname}입니다`);
		}
		const room: Chat = await this.chatRepository.findOneByRoomname(roomName);
		await this.chatUserRepository.deleteUser(room, user);
		const check = await this.chatUserRepository.find({
			where: {
				chat_id: {id: Equal(room.id)},
			}
		});
		if (!check.length) {
			await this.chatRepository.deleteRoom(roomName);
		} else {
			const newHost = await this.chatUserRepository.findNextHost(room);
			await this.chatRepository.succedingHost(room, newHost);
		}
		return { success: true };
	}

	@SubscribeMessage('edit-room')
	async handleEditRoom(
		@ConnectedSocket() socket: Socket,
		@MessageBody() {roomName, password, userIntraId}: MessagePayload
		) {
			// roomname -> 새로 바꿀 방 이름
			// password -> 새로 바꿀 방의 패스워드
			// 
			const user = await this.userRepository.findByIntraId(userIntraId);
			const targetRoom = await this.chatService.getWhereAreYou(user.nickname);
			const overlapRoom = await this.chatRepository.findOneByRoomname(roomName);
			if (overlapRoom) {
				return { success: false, payload: `${roomName} : 이미 선점된 방입니다.` };
			}
			targetRoom.title = roomName;
			if (password) {
				targetRoom.password = password;
				targetRoom.is_private = true;
			}
			await this.chatRepository.save(targetRoom);

			return { success: true, payload: roomName };
		}
}
