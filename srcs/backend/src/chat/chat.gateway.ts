import { Logger } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import e from "express";
import { Namespace, Socket } from "socket.io";

interface MessagePayload {
	roomId: string;
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
		@MessageBody() { roomId, message, name }: MessagePayload
	) {
		this.logger.log(`${name}: 닉네임`);
		socket.broadcast.to(roomId).emit('message', { name, message });
		return { name, message };
	}

	@SubscribeMessage('room-list')
	handleRoomList() {
		return createdRooms;
	}


	@SubscribeMessage('create-room')
	handleCreateRoom(
		@ConnectedSocket() socket: Socket,
		@MessageBody() roomId: string,
	) {
		const exists = createdRooms.find((createdRoom) => createdRoom === roomId);
		if (exists) {
			return { success: false, payload: `${roomId} 방이 이미 존재합니다.` };
		}

		socket.join(roomId); // 기존에 없던 room으로 join하면 room이 생성됨
		createdRooms.push(roomId); // 유저가 생성한 room 목록에 추가
		this.nsp.emit('create-room', roomId); // 대기실 방 생성

		return { success: true, payload: roomId };
	}

	@SubscribeMessage('join-room')
	handleJoinRoom(
		@ConnectedSocket() socket: Socket,
		@MessageBody() roomId: string,
	) {
		socket.join(roomId); // join room
		socket.broadcast.to(roomId).emit('message', { message: `${socket.id}가 들어왔습니다.` });

		return { success: true };
	}

	@SubscribeMessage('leave-room')
	handleLeaveRoom(
		@ConnectedSocket() socket: Socket,
		@MessageBody() roomId: string,
	) {
		socket.leave(roomId); // leave room
		socket.broadcast.to(roomId).emit('message', { message: `${socket.id}가 나갔습니다.` });

		return { success: true };
	}

}