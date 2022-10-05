import { Logger } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Namespace, Socket } from "socket.io";
import { GetUser } from "src/user/get.user.decorator";
import { User } from "src/user/user.entity";
import { ChatRepository } from "./chat.repository";
import { Chat } from "./chat.entity";
import { ChatUser } from "./chatuser.entity";
import { ChatUserRepository } from "./chatuser.repository";

interface MessagePayload {
	roomName: string;
	message: string;
	name: string;
}

let createdRooms: string[] = [];

@WebSocketGateway({
	namespace: 'api/chat',
	cors: {
		origin: ['http://localhost:3000'],
	},
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() nsp: Namespace;
	constructor ( 
		private chatRepository: ChatRepository,
		private chatUserRepository: ChatUserRepository,
	) {}

	private logger = new Logger('ChatGateWay');

	// 초기화 이후에 실행
	afterInit() {
		this.nsp.adapter.on('delete-room', (room) => {
			const deletedRoom = createdRooms.find(
				(createdRoom) => createdRoom === room,
			);
			if (!deletedRoom) return;
		
		
			this.nsp.emit('delete-room', deletedRoom);
			createdRooms = createdRooms.filter(
				(createdRoom) => createdRoom !== deletedRoom,
			); // 유저가 생성한 room 목록 중에 삭제되는 room 있으면 제거
		});

		this.logger.log('웹소켓 서버 초기화');
	}

	// 소켓이 연결되면 실행
	handleConnection(@ConnectedSocket() socket: Socket) {
		this.logger.log(`${socket.id} 소켓 연결`);
	}

	// 소켓 연결이 끊기면 실행
	handleDisconnect(@ConnectedSocket() socket: Socket) {
		this.logger.log(`${socket.id} 소켓 연결 해제`);
	}

	@SubscribeMessage('message')
	handleMessage(
		@ConnectedSocket() socket: Socket,
		@MessageBody() { roomName, message, name }: MessagePayload
	) {
		const socket_id = socket.id;
		socket.broadcast.to(roomName).emit('message', { name, message });
		return { name, message, socket_id };
	}

	@SubscribeMessage('room-list')
	handleRoomList() {
		return this.chatRepository.find({});
	}


	@SubscribeMessage('create-room')
	handleCreateRoom(
		@ConnectedSocket() socket: Socket,
		@GetUser() user: User,
		@MessageBody() roomName: string, password?: string,
		) {
			const exists = this.chatRepository.findOne({where: {title: roomName}});
			if (exists) {
				return { success: false, payload: `${roomName} 방이 이미 존재합니다.` };
			}
			
		socket.join(roomName); // 기존에 없던 room으로 join하면 room이 생성됨
		const room = this.chatRepository.create({title: roomName});
		if (password) {
			room.password = password;
			room.is_private = true;
		}
		this.chatRepository.save(room);
		const chatuser = this.chatUserRepository.create({chat_id: room, user_id: user, is_muted: false});
		this.chatUserRepository.save(chatuser);
		this.nsp.emit('create-room', roomName); // 대기실 방 생성

		return { success: true, payload: roomName };
	}

	@SubscribeMessage('join-room')
	handleJoinRoom(
		@ConnectedSocket() socket: Socket,
		@MessageBody() roomName : string,
		@GetUser() user: User,
	) {
		socket.join(roomName); // join room
		// const room: Chat = this.chatRepository.findOneByRoomname(roomName);
		const chatuser: ChatUser = this.chatUserRepository.create({
			// chat_id: room,
			user_id: user,
			is_muted: false,
		});
		this.chatUserRepository.save(chatuser);
		return { success: true };
	}

	@SubscribeMessage('leave-room')
	handleLeaveRoom(
		@ConnectedSocket() socket: Socket,
		@MessageBody() roomName: string,
	) {
		socket.leave(roomName); // leave room
		return { success: true };
	}

}