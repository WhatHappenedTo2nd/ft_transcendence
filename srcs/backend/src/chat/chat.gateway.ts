import { Logger } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Namespace, Socket } from "socket.io";

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
		this.nsp.adapter.on('create-room', (room) => {
			this.logger.log(`"Room:${room}"이 생성되었습니다.`);
		});

		this.nsp.adapter.on('join-room', (room, id) => {
			this.logger.log(`"Socket:${id}"이 "Room:${room}"에 참여하였습니다.`);
		});

		this.nsp.adapter.on('leave-room', (room, id) => {
			this.logger.log(`"Socket:${id}"이 "Room:${room}"에서 나갔습니다.`);
		});

		this.nsp.adapter.on('delete-room', (roomName) => {
			this.logger.log(`"Room:${roomName}"이 삭제되었습니다.`);
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
	handleMessage(@ConnectedSocket() socket: Socket, @MessageBody() message: string) {
		socket.broadcast.emit('message', { username: socket.id, message });
		return { username: socket.id, message };
	}
}
