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
import { GetUser } from "src/user/get.user.decorator";
import { User } from "src/user/user.entity";
import { UserIdDto } from "src/user/dto/user-id.dto";
import { FriendRepository } from "src/friend/friend.repository";

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
		private friendRepository: FriendRepository
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
		@MessageBody() { roomName, message, name, userIntraId }: MessagePayload
	) {
		const socket_id = socket.id;
		const user = await this.userRepository.findByIntraId(userIntraId);
		const mutedUser = await this.chatUserRepository.isMutedUser(user);
		if (mutedUser && mutedUser.is_muted === true) {
			this.logger.log(`${mutedUser.user_id.intra_id}는 뮤트됨`);
		} else {
			// socket.broadcast.to(roomName).except().emit('message', { name, message });
			const room = await this.chatRepository.findOneByRoomname(roomName);
			// 채팅방에 속한 모든 유저 목록을 가져옴
			const chatUsers = await this.chatUserRepository.getAllChatUsers(room);
			// 채팅방에 속한 유저들 중 나를 차단한 사람 목록을 가져옴
			const whoBlockedMe = await this.chatService.findWhoBlockedMe(user, room);

			if (whoBlockedMe.length === 0) {
				this.logger.log('block한 사람이 없어');
				socket.broadcast.to(roomName).emit('message', { name, message });
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

	/**
	 * Game-related
	 */
	// @SubscribeMessage('userGameStatus')
	// async handleUserGameStatus(@ConnectedSocket() client: Socket, @MessageBody() { isPlaying }: { isPlaying: boolean }) {
	// 	const user = this.chatUsers.getUser(client.id);

	// 	if (user) {
	// 		if (isPlaying) {
	// 		user.setUserStatus(UserStatus.PLAYING);
	// 		} else {
	// 		user.setUserStatus(UserStatus.ONLINE);
	// 		}
	// 		this.server.emit('updateUserStatus', {
	// 		userId: user.id,
	// 		status: UserStatus[user.status],
	// 		});
	// 	}
	// }

	// @SubscribeMessage('spectateRoom')
	// async handlespectateRoom(@ConnectedSocket() client: Socket, @MessageBody() roomId: string) {
	// 	const memoryUser = this.chatUsers.getUser(client.id);
	// 	if ((await this.pongGateway.pushSpectatorToRoom(memoryUser.id, roomId)) === false) {
	// 	 this.server.to(client.id).emit('listeningSpectateRoom', {
	// 	   func: 'listeningChannelInfo',
	// 	   code: 400,
	// 	   message: `게임중에는 관전이 불가능합니다.`,
	// 	 });
	// 	} else {
	// 	 this.server.to(client.id).emit('listeningSpectateRoom', {
	// 	   func: 'listeningChannelInfo',
	// 	   code: 200,
	// 	   message: `관전 성공`,
	// 	 });
	// 	}
	// 	return this.returnMessage('spectateRoom', 200, '게임 관전 성공했습니다.');
	// }
	//  /**
	//   * 게임 초대 후 수락할 때 초대한 사람이 못기다리고 나가버리면... 오류
	//   * @param client
	//   * @param param1
	//   */
	//  @SubscribeMessage('acceptPongInvite')
	//  async handleAcceptPongInvite(
	//    @ConnectedSocket() client: Socket,
	//    @MessageBody() { roomId, messageId }: { roomId: string; messageId: number },
	//  ) {
	//    try {
	// 	 /** 게임 확인 */
	// 	 const room = this.pongGateway.setInviteRoomToReady(roomId);

	// 	 /** 수락 후 */
	// 	 await this.messageService.setType(messageId, 'text');

	// 	 return this.returnMessage('acceptPongInvite', 200, '게임 초대를 수락했습니다.');
	//    } catch (e) {
	// 	 this.server.to(client.id).emit('chatError', e.message);
	//    }
	//  }



	//  @SubscribeMessage('sendPongInvite')
	//  async handleSendPongInvite(@ConnectedSocket() client: Socket, @MessageBody() { anotherId }: { anotherId: number }) {
	//    try {
	// 	 const memorySender = this.chatUsers.getUser(client.id);
	// 	 const memoryReceiver = this.chatUsers.getUserById(anotherId);

	// 	 /** 게임 방이 존재하는지 확인 */
	// 	 /** 상대방이 게임중이면 chatError */
	// 	 this.pongGateway.roomAlreadyExists(memorySender.id, anotherId);

	// 	 /** 초대방 만들기 */
	// 	 const roomId = await this.pongGateway.createInviteRoom(
	// 	   { id: memorySender.id, nickname: memorySender.nickname } as User,
	// 	   anotherId,
	// 	 );
	// 	 this.logger.log(`sendPongInvite: createInviteRoom: ${roomId}`);

	// 	 /** DM 보내기 */
	// 	 const dm: any = await this.handleCreateDm(client, { anotherId });
	// 	 await this.handleDmSubmit(client, {
	// 	   DMId: dm.data,
	// 	   authorId: memorySender.id,
	// 	   message: '게임에 초대했습니다.',
	// 	   type: 'invite',
	// 	   roomId: roomId,
	// 	 });

	// 	 return this.returnMessage('sendPongInvite', 200, '게임 초대를 보냈습니다.');
	//    } catch (e) {
	// 	 console.log(e);
	// 	 this.server.to(client.id).emit('chatError', e.message);
	//    }
	//  }
}
