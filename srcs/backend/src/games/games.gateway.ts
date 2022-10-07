/**
 * Lifecycle hooks
 * @OnGatewayInit
 * afterInit() 매서드를 구현하도록 강제한다.
 * afterInit() 내에서 필요한 기능을 수행할 수 있다.
 * 라이브버리별 서버 인스턴스를 인수로 사용하고 필요시 나머지를 퍼뜨린다.
 *
 * @OnGatewayConnection
 * handleConnection() 메서드를 구현하도록 강제한다.
 * 클라이언트의 connection 이벤트 처리 가능
 * 라이브러리별 클라이언트 소켓 인스턴스를 인수로 사용한다.
 *
 * @OnGatewayDisconnect
 * handleDisconnect() 메서드를 구현하도록 강제한다.
 * 클라이언트의 disconnection 이벤트 처리 가능
 * 라이브러리별 클라이언트 소켓 인스턴스를 인수로 사용한다.
 *
 * 연결된 클라이언트에서 'events'를 발생시키면(client->server, 'events'요청)
 * 서버에서 해당 이벤트를 읽어서 요청에 대한 응답을 할 수 있다.
 * handleEvent 함수 파라미터값에 client::Socket을 이용하면 해당 이벤트를 발생시킨 클라이언트를 특정할 수 있다.
 * 클라이언트에서 emit('events', data)로 요청하면, 서버에서 응답으로 값(data)을 반환하면 클라이언트에서 받을 수 있다.
 *
 * 주의사항
 * 구분해야하는 변수로는
 * @WebSocketServer() server:Server의 server와 핸들링하는 함수의 파라미터에 있는 client:Socket의 socket이다.
 * server는 말그대로 웹소켓 서버를 실행하는 주체이고, client는 해당 서버에 연결된 각각의 클라이언트(소켓)이다.
 * Http 통신과 다르게 양방향 통신이기 때문에, 어디서 이벤트를 발생시켰고 어디로 이벤트 발생시킬지(응답을 보낼지) 헷갈리지 말자!
 *
 * @see https://docs.nestjs.com/websockets/gateways
 * @see https://dltmddus1998.github.io/TechBlog/nestWebSocket.html
 * @see https://velog.io/@kimgano12/NestJS-Socket.io-RN-Mysql%EB%A1%9C-%EC%B1%84%ED%8C%85-%EA%B5%AC%ED%98%84%ED%95%98%EA%B8%B0-1
 */

import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway,  WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameConnectedUser } from './class/game-connected-user.class';
import Room from './class/game-room.class';
import Queue from './class/game-queue.class';
import { Logger } from '@nestjs/common';
import { GamesService } from './games.service';
import { GameUser } from './class/game-user.class';
import { GameMode, GameState, UserStatus } from './enum/games.enum';
import { SET_INTERVAL_MILISECONDS } from './constant/games.constant';
import { UserService } from 'src/user/user.service';
import { Games } from './games.entity';

/**
 * websocket은 프로토콜 server.io는 라이브러리
 *
 * WebSocket은 그 이름에서 알 수 있듯이 소켓을 이용하여 자유롭게 데이터를 주고 받을 수 있다. 즉 기존의 요청-응답 관계 방식보다 더 쉽게 데이터를 교환할 수 있다
 *  Socket.io는 WebSocket를 API로 추상화한 것이다.
 * 클라이언트에서 서버에 Socket을 열어달라고 한 뒤 일련의 데이터를 보내면, 서버는 연결된 모든 클라이언트에 해당 데이터를 전달한다.
 * Nest에서 게이트웨이는 단순히 @WebSocketGateway() 데코레이터로 주석이 달린 클래스이다.
 *
 * @see https://d2.naver.com/helloworld/1336
 * @see https://dltmddus1998.github.io/TechBlog/nestWebSocket.html
 */
/**
 * POST : POST를 통해 해당 URI를 요청하면 리소스를 생성
 * GET : GET을 통해 해당 리소스를 조회하고 해당 document에 대한 자세한 정보를 가져온다.
 * PUT : PUT을 통해 해당 리소스를 수정
 * DELETE : DELETE를 통해 해당 리소스를 삭제
 */
@WebSocketGateway({
	cors: {
		origin: 'http://localhost:3000',
		methods: ['GET', 'POST'],
	},
	namespace: 'api/games',
})

export class GamesGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	private logger: Logger = new Logger('gameGateway');
	constructor(
		private readonly gamesService: GamesService,
		private readonly usersService: UserService,
		// @Inject(forwardRef(() => ChatGateway))
		// private readonly chatGateway: ChatGateWay,
	) {}

	@WebSocketServer()
	server: Server;

	/**
	 * @param
	 * gameconnectedUser;
	 */
	private gameconnetedUsers: GameConnectedUser = new GameConnectedUser();
	private currentGames: Array<Room> = new Array();
	private queue: Queue = new Queue();
	private rooms: Map<string, Room> = new Map();

	/** 각 동작에서 에러 및 필요한 메시지 반환 함수 */
	returnMessage(func: string, code: number, message: string, data?: Object[] | Object): Object {
		this.logger.log(`${func} [${code}]: ${message}, ${data}`);
		return { func, code, message, data };
	}

	/**
	 * @createNewRoom
	 * 큐가 찼다면 새 게임 생성
	 * @param players
	 */
	createNewRoom(players: Array<GameUser>): void {
		const roomId: string = `${players[0].nickname}&${players[1].nickname}`;
		const room: Room = new Room(roomId, players, { mode: players[0].mode } );

		this.server.to(players[0].socketId).emit('newRoom', room);
		this.server.to(players[1].socketId).emit('newRoom', room);
		this.rooms.set(roomId, room);
		this.currentGames.push(room);
		this.server.emit('updateCurrentGames', this.currentGames);
	}

	/**
	 * 소켓이 만들어질 때 실행 -> 서버가 실행되면 작동하는 함수
	 * @param server 서버 소켓
	 */
	afterInit(server: any) {
		this.logger.log(`afterInit: ${server.name} 초기화 및 시작`);
		/**
		 * 일정 시간 간격을 두고 함수를 실행
		 * delay: 실행 전 대기 시간으로, 단위는 밀리초(millisecond, 1000밀리초 = 1초)이며 기본값은 0
		 */
		setInterval(() => {
			if (this.queue.size() > 1) {
				const players: Array<GameUser> = this.queue.matchPlayers();
				if (players.length === 0) { return ; }
				this.createNewRoom(players);
				this.logger.log(`소켓 시작 후 방의 플레이어 배열의 길이는 ${players.length} 입니다`);
			}
		}, SET_INTERVAL_MILISECONDS);
	}

	/**
	 * 클라이언트가 소켓에 접속할 때 실행하는 함수
	 * @ConnectedSocket 연결된 소켓 인스턴스에 접근하기 위해 사용
	 * @param client 소켓에 접속한 클라이언트
	 */
	handleConnection(@ConnectedSocket() client: Socket) {
		this.logger.log(`handleConnection: 소켓과 연결했습니다. 접속한 유저의 socket id는 ${client.id} 입니다`);
	}

	/**
	 * 클라이언트가 다른 페이지로 벗어났을 때 실행하는 함수
	 * function앞에 async를 붙이면 해당 함수는 항상 프라미스를 반환한다.
	 * 프라미스가 아닌 값을 반환하더라도 이행 상태의 프라미스(resolved promise)로 값을 감싸 이행된 프라미스가 반환되도록 합니다.
	 * @param client 소켓에 접소한 클라이언트
	 */
	async handleDisconnect(@ConnectedSocket() client: Socket): Promise<void> {
		this.logger.log(`=========new handleDisconnect Log ==========`);
		const gameuser: GameUser = this.gameconnetedUsers.getUserBySocketId(client.id);
		this.logger.log(`handleDisconnect가 실행됩니다.`);
		if (!gameuser) {
			this.returnMessage('handleUserConnect', 400, '유저 데이터가 없습니다.');
			return ;
		}

		/** 게임 중인 경우 게임방 전체를 조회해야한다. */
		this.rooms.forEach((room: Room) => {
			/** 게임 방에 있다면 우선 유저부터 방에서 지운다 */
			// if (room.isAPlayer(gameuser)) {
			this.logger.log(`handleDisconnect: 현재 게임 상태는 ${room.gameState}입니다. 1.`);
			this.logger.log(`플레이어 1 : ${room.paddleOne.gameuser.nickname}, 플레이어 2: ${room.paddleTwo.gameuser.nickname}`)
			if (room.isAPlayer(gameuser)) {
				if (gameuser === room.paddleOne.gameuser &&
					(room.gameState !== GameState.PLAYER_ONE_WIN &&
					room.gameState !== GameState.PLAYER_TWO_WIN)
					&&
					room.gameState !== GameState.GAME_SAVED)
				{
					this.logger.log(`게임에 남아있는 유저는 패들 1 : ${gameuser.nickname}입니다.`);
					room.changeGameState(GameState.PLAYER_TWO_OUT);
					this.logger.log(`handleDisconnect: 현재 게임 상태는 ${room.gameState}입니다. 2.`);
					this.logger.log(`게임을 저장합니다.`);
					this.saveGame(room, false);
				}
				else if (gameuser === room.paddleTwo.gameuser &&(room.gameState !== GameState.PLAYER_ONE_WIN && room.gameState !== GameState.PLAYER_TWO_WIN) &&
				room.gameState !== GameState.GAME_SAVED)
				{
					this.logger.log(`게임에 남아있는 유저는 패들 2 : ${gameuser.nickname}입니다.`);
					room.changeGameState(GameState.PLAYER_ONE_OUT);
					this.logger.log(`handleDisconnect: 현재 게임 상태는 ${room.gameState}입니다.`);
					this.saveGame(room, false);
				}
				// room.removeUser(gameuser);
				// this.logger.log(`handleDisconnect: 삭제 시 남아있는 게임 유저는 ${gameuser.nickname}입니다.`);
				// if (room.players.length === 0 && room.gameState !== GameState.WAITING) {
				// 	this.logger.log(`handleDisconnect : 방에 유저가 없습니다.`);
				// 	const roomIndex: number = this.currentGames.findIndex((toRemove) => toRemove.roomId === room.roomId);
				// 	if (roomIndex !== -1) {
				// 		this.currentGames.splice(roomIndex, 1);
				// 	}
				// 	this.server.emit('updateCurrentGames', this.currentGames);
				// }

				/** 현재 게임중인 상태! */
				// if (room.gameState !== GameState.PLAYER_ONE_WIN &&
				// 	room.gameState !== GameState.PLAYER_TWO_WIN &&
				// 	room.gameState !== GameState.WAITING) {
				// 	/** 누군가 점수를 낸 경우, 위치를 초기화하고 게임을 정지시킨다 */
				// 	this.logger.log(`handleDisconnect: room의 플레이어를 확인합니다. 1: ${room.paddleOne.gameuser.nickname} and 2: ${room.paddleTwo.gameuser.nickname}`);
				// 	if (room.gameState === GameState.PLAYER_ONE_SCORED || room.gameState === GameState.PLAYER_TWO_SCORED) {

				// 		room.resetPostion();
				// 	}
				// 	room.pause();
				// }
				/** join한 room에서 떠난다  */
				client.leave(room.roomId);
				return ;
			}
		});
		await this.usersService.setNowPlaying(gameuser.id, false);
		this.queue.removeUser(gameuser);
		this.gameconnetedUsers.removeUser(gameuser);
		/** 채팅방에 게임이 어떻게 되었는지 게임에 대한 정보를 전달 */
		// await this.chatGateway.announceGame();
	}

	/**
	 * @SubscribeMessage
	 * 클라이언트에서 보낸 이벤트를 감지하고 해당 이벤트로 들어온 데이터를 서버에 연결된 모든 클라이언트에게 이벤트를 발생시키면서 데이터를 보내준다.
	 * 해당 이벤트를 받은 클라이언트는 출력만 해주면 된다.
	 *
	 * 유저가 접속하면 gameconnetedUsers에 유저를 등록해야 한다. 게임에 접속한 유저를
	 * 클라이언트에게 handleUserConnect를 전달
	 * @param client 소켓에 접속한 클라이언트
	 * @param gameuser 소켓이 보내는 유저 데이터
	 */
	@SubscribeMessage('handleUserConnect')
	async handleUserConnect(@ConnectedSocket() client: Socket, @MessageBody() gameuser: GameUser): Promise<GameUser[] | Object> {
		/** GameUser 연결 및 데이터 확인 */
		if (gameuser && !gameuser.id) {
			return this.returnMessage('handleUserConnect', 400, '유저 데이터가 없습니다.');
		}
		/** GameUser 생성*/
		let newGameUser: GameUser = this.gameconnetedUsers.getUserById(gameuser.id);
		/**
		 * newGameUser가 gameconnectedUser에 없으면 db에 있는 유저로 만든다. -> 친구로 설정한 사람과 연결을 할것인가? 전체유저로 해야하는가?
		 * withoutFriend : 친구 요청 중, 친구, 차단된 친구 상태가 아닌 유저의 데이터만을 의미! -> 전체 유저를 의미
		 * -> 유저 자체의 데이터를 가지고 와서 새로운 newGameUser를 만든다.
		 * 친구 id가 필요한지? nickname이 필요한지? -> mseo한테 전달
		 */
		if (!newGameUser) {
			this.logger.log(`게임에 연결된 유저 배열에 유저가 없을 때 실행됩니다.`);
			const dbUser = await this.usersService.getUserById(gameuser.id);
			newGameUser = new GameUser(dbUser.id, dbUser.nickname, dbUser.avatar, dbUser.wins, dbUser.losses, dbUser.ratio, client.id);
			// const dbUser = await this.usersService.getUserWithoutFriends(gameuser.id);
		}
		else {
			this.logger.log(`게임에 연결된 유저 배열에 유저가 있을 때 실행됩니다.`);
			newGameUser.setSocketId(client.id);
			newGameUser.setNickname(gameuser.nickname);
		}
		newGameUser.setUserStatus(UserStatus.IN_HUB);

		/**
		 * 플레이어가 게임에 있지 않은지 확인
		 * 새로 생성한 newGameUser가 게임방 안에 있는지 확인한다.
		 */
		this.rooms.forEach((room: Room) => {
			/** 생성한 유저가 게임 패들의 닉네임과 같은지 확인 -> 게임 유저인지 확인 */
			if (room.isAPlayer(newGameUser) &&
				room.gameState !== GameState.PLAYER_ONE_WIN &&
				room.gameState !== GameState.PLAYER_TWO_WIN) {
				this.logger.log(`게임에 연결된 유저가 플레이어인 경우 실행됩니다.`);
				newGameUser.setUserStatus(UserStatus.PLAYING);
				newGameUser.setRoomId(room.roomId);

				this.server.to(client.id).emit('newRoom', room);
				if (room.gameState === GameState.PAUSED) {
					room.resume();
				}
				return ;
			}
			// else if (room.isASpectator(newGameUser)) {
			// 	this.logger.log(`게임에 연결된 유저가 관전자인 경우 실행됩니다.`);
			// 	this.server.to(client.id).emit('newRoom', room);
			// }
		});
		/** 접속중인 유저에 추가 */
		const isConnected = this.gameconnetedUsers.getUserById(newGameUser.id);
		if (!isConnected) {
			this.logger.log(`게임 유저가 접속중이 아닐 때 실행됩니다.`);
			this.gameconnetedUsers.addUser(newGameUser);
		}

		/** 접속중인 유저 반환 */
		const gameusers = this.gameconnetedUsers.findAll();
		this.logger.log(`handleUserConnect: users: ${gameusers}`);
		// return this.returnMessage('handleUserConnect', 200, '성공', users);
	}

	/**
	 * 현재 열려있는 게임 확인하기
	 * @param client 소켓에 접속한 클라이언트
	 * @returns
	 */
	@SubscribeMessage('getCurrentGames')
	handleGetCurrentGames(@ConnectedSocket() client: Socket): Array<Room> {
		this.server.to(client.id).emit('updateCurrentGames', this.currentGames);
		return (this.currentGames);
	}

	/**
	 * GameQueue: 게임 모드(default, big)을 선택했을 때 유저를 Queue에 저장한다.
	 * 게임방을 생성하는 데 이때 Queue에 접속해 있는 유저 중 같은 모드로 접속한 사람과 방을 만든다.
	 */
	/**
	 * 마우스 버튼을 통해 게임에 접속한다는 것을 서버에 전달
	 * 큐에 접속 -> 게임 큐에 들어간다.
	 * 게임 방에 들어가는 것이 아니다!! 큐에 들어가는 것과 방에 접속하는 것은 다르다.
	 * @param client
	 * @param mode
	 * @returns
	 */
	@SubscribeMessage('joinQueue')
	handleJoinQueue(@ConnectedSocket() client: Socket, @MessageBody() mode: string): Object {
		/** 소켓에 접속한 유저의 client.id를 검색해서 게임에 접속한 유저 데이터를 가져온다 */
		const gameuser: GameUser = this.gameconnetedUsers.getUserBySocketId(client.id);

		this.logger.log(`joinQueue: 연결된 유저를 확인 합니다. 연결된 유저의 id는 ${gameuser.id}이고 닉네임은 ${gameuser.nickname}, 게임모드는 ${mode}입니다.`);

		if (!gameuser) {
			return this.returnMessage('handleUserConnect', 400, '유저 데이터가 없습니다.');
		}

		/** 게임모드는 HARD 또는 DEFAULT로 그 외는 에러 */
		if (mode !== 'DEFAULT' && mode !== 'HARD') {
			return this.returnMessage('joinQueue', 400, '게임 모드가 올바르지 않습니다.');
		} /** 이미 큐에 들어왔는지 확인 */
		else if (gameuser && this.queue.isInQueue(gameuser)) {
			return this.returnMessage('joinQueue', 400, '이미 큐에 존재합니다.');
		} /** 유저가 큐에 접속한 상태가 아니라면 큐에 넣는다 */
		else if (gameuser && !this.queue.isInQueue(gameuser)) {
			/** 유저에 상태를 큐에 들어있는 것(IN_QUEUE)으로 바꾼다. */
			this.gameconnetedUsers.changeUserStatus(client.id, UserStatus.IN_QUEUE);
			this.logger.log('joinQueue: 큐에 접속한 게임 모드를 확인합니다.')
			this.gameconnetedUsers.setGameMode(client.id, mode);
			this.queue.enqueue(gameuser);
			// this.logger.log(`joinQueue: 유저가 큐에 존재하는지 확인합니다. 유저를 큐에 넣고 클라이언트에 joinedQueue를 보냅니다.`);
			this.server.to(client.id).emit('joinedQueue');
			return this.returnMessage('joinQueue', 200, '큐에 정상적으로 들어왔습니다.');
		}
	}

	/**
	 * 큐에서 나옴 -> 게임 큐에서 나온다.
	 * 게임 방에서 나오는 게 아니다!! 큐에서 나오는 것과 방에서 나오는 것과 다르다.
	 * @param client
	 */
	@SubscribeMessage('leaveQueue')
	handleLeaveQueue(@ConnectedSocket() client: Socket) {
		// this.logger.log(`leaveQueue: 클라이언트에서 보낸 leaveQueue를 실행합니다. 연결된 클라이언트 socket id는 ${client.id}입니다.`);
		const gameuser: GameUser = this.gameconnetedUsers.getUserBySocketId(client.id);
		// this.logger.log(`leaveQueue: 연결된 유저를 확인합니다. 연결된 유저의 id는 ${gameuser.id}이고 닉네임은 ${gameuser.nickname}입니다.`);
		/** 제거할 유저가 없음 */
		if (!gameuser) {
			return this.returnMessage('leaveQueue', 400, '유저가 없습니다.');
		} /** 제거할 유저가 큐에 없음 */
		else if (!this.queue.isInQueue(gameuser)) {
			return this.returnMessage('leaveQueue', 400, '큐에 제거할 유저가 없습니다');
		} /** 제거할 유저가 큐에 있을 때 leavedQueue(큐에서 떠났다는 것을 클라이언트에 보내준다) */
		else {
			this.queue.removeUser(gameuser);
			this.server.to(client.id).emit('leavedQueue');
			return this.returnMessage('leaveQueue', 200, '큐에서 나왔습니다.');
		}
	}

	/**
	 * 큐에 있는 유저가 게임 방에 접속
	 * 큐에 대기 중인 유저와 비교해서 접속?!
	 */
	@SubscribeMessage('joinRoom')
	async handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() roomId: string) {
		// this.logger.log(`joinRoom: 클라이언트에서 보낸 joinRoom를 실행합니다. 연결된 클라이언트 socket id는 ${client.id}입니다.`);

		/** 게임 유저 확인 */
		const gameuser = this.gameconnetedUsers.getUserBySocketId(client.id);

		if (!gameuser) {
			return this.returnMessage('joinRoom', 400, '유저가 없습니다.');
		}
		/**
		 * 게임 방 확인
		 * 게임 방은 map으로 구성 -> roomId는 클라이언트에서 받아온 roomId
		 */
		const room:Room = this.rooms.get(roomId);
		if (!room) {
			return this.returnMessage('joinRoom', 400, '게임 방이 없습니다.');
		} else if(room.findOne(gameuser) !== -1) {
			return this.returnMessage('joinRoom', 400, '이미 방에 들어왔습니다.');
		}

		/** 방 접속 */
		client.join(roomId);
		/** 유저가 플레이어인 경우 */
		if (room.isAPlayer(gameuser)) {
			this.logger.log(`joinRoom: 유저가 플레이어인 경우 실행됩니다.`);
			if (room.gameState === GameState.PAUSED) {
				this.logger.log(`joinRoom: 방의 상태가 일시정지 중이면 실행됩니다.`);
				room.resume();
			}
			/**
			 * setNowPlaying : User의 상태를 now_Playing(isPlaying)
			 * setRoomId :  게임 방 번호를 User 정보에 저장한다.
			 */
			await this.usersService.setNowPlaying(gameuser.id, true);
			await this.usersService.setRoomId(gameuser.id, roomId);
			this.gameconnetedUsers.changeUserStatus(client.id, UserStatus.PLAYING);
			// await this.chatGateway.announceGame();

			room.addUser(gameuser);
		}
		/**
		 * 유저가 관전자인 경우
		 * 게임을 플레이하는 유저가 아닌 상태에서 게임 페이지에 접속 중인 상태라면 게임 관전자로 상태를 변경
		 */
		else if (gameuser.status === UserStatus.IN_HUB) {
			this.gameconnetedUsers.changeUserStatus(client.id, UserStatus.SPECTATING);
		}

		/**
		 * 클라이언트-서버간 문자열로 데이터를 주고 받기 때문에, 보낼 때는 JSON.stringify메서드로 json->문자열로 변환하여 보낸다.
		 * 클라이언트에서 받을 때는 JSON.parse를 통해 문자열->JSON으로 변환하여 이벤트와 내용을 처리합니다.
		 */
		// this.logger.log(`joinRoom: 클라이언트에게 joinedRoom을 보냅니다.`);
		this.server.to(client.id).emit('joinedRoom');
		// this.logger.log(`joinRoom: 클라이언트에게 updateRoom을 보냅니다.`);
		this.server.to(client.id).emit('updateRoom', JSON.stringify(room.serialize()));
		// this.logger.log(`joinRoom: 유저가 방에 들어왔습니다.`);
		return this.returnMessage('joinRoom', 200, '방에 들어왔습니다.');
	}

	/**
	 * 게임방을 떠날 때 실행
	 * @param client
	 * @param roomId
	 * @returns
	 */
	@SubscribeMessage('leaveRoom')
	async handleLeaveRoom(@ConnectedSocket() client: Socket, @MessageBody() roomId: string) {
		this.logger.log(`==========new Leave Log==========`);
		const memoryUser: GameUser = this.gameconnetedUsers.getUserBySocketId(client.id);
		/** 유저가 없을 때 예외처리 */
		this.logger.log(`leaveRoom: 첫번째 확인 남아있는 게임 유저는 ${memoryUser.nickname}입니다.`);
		if (!memoryUser) {
			return this.returnMessage('leaveRoom', 400, '유저가 없습니다.');
		}

		const room: Room = this.rooms.get(roomId);
		/** 방이 없을 때 예외처리 */
		if (!room) {
			this.server.to(client.id).emit('leavedRoom');
			return this.returnMessage('leaveRoom', 400, '방이 없습니다.', roomId);
		}

		this.logger.log(`leaveRoom: 두번째확인 남아있는 게임 유저는 ${memoryUser.nickname}입니다.`);
		await this.usersService.setNowPlaying(memoryUser.id, false);
		await this.usersService.setRoomId(memoryUser.id, '');
		room.removeUser(memoryUser);
		this.logger.log(`leaveRoom: 세번째확인 남아있는 게임 유저는 ${memoryUser.nickname}입니다.`);
		// await this.chatGateway.announceGame();
		/** 방에 플레이어 없을 때 -> 방에 아무도 없을 때 */
		if (room.players.length === 0) {
			this.logger.log('leaveRoom: 더 이상 유저가 남아있지 않습니다. 게임을 저장하세요.');
			this.logger.log(`leaveRoom: 현재 게임 상태는 ${room.gameState}입니다. 0`);
			/** 방에 유저는 없지만 게임은 종료된 상태 */
			if ((room.gameState === GameState.PLAYER_ONE_WIN || room.gameState === GameState.PLAYER_TWO_WIN))
			{
				this.logger.log(`leaveRoom: 현재 게임 상태는 ${room.gameState}입니다. 1`);
				this.logger.log('leaveRoom: saveGame 정상적인 게임종료를 실행합니다.');
				this.saveGame(room, true);
			}
			// else if ((room.gameState === GameState.PLAYER_ONE_OUT || room.gameState === GameState.PLAYER_TWO_OUT))
			// {
			// 	this.logger.log(`leaveRoom: 현재 게임 상태는 ${room.gameState}입니다. 2`);
			// 	this.logger.log('leaveRoom: saveGame 비정상적인 게임종료를 실행합니다.');
			// 	this.saveGame(room, false);
			// }
			/** 방 삭제!! -> rooms map에서 delete */
			/** 삭제해야 할 방 인덱스를 찾고 현재 게임 목록에서 삭제 */
			this.logger.log('leaveRoom: 게임 저장 후 방을 삭제합니다.');
			this.rooms.delete(room.roomId);
			const roomIndex: number = this.currentGames.findIndex((toRemove) => toRemove.roomId === room.roomId);
			if (roomIndex !== -1) {
				this.currentGames.splice(roomIndex, 1);
			}
			this.logger.log(`leaveRoom: 남아있는 방을 확인합니다.`);
			console.log(this.currentGames);
			this.server.emit('updateCurrentGames', this.currentGames);
		}

		/** 게임 종료되지 않았는데 클라이언트가 화면에서 벗어나면 일시정지 */
		// if (room.isAPlayer(memoryUser) &&
		// 	room.gameState !== GameState.PLAYER_ONE_WIN &&
		// 	room.gameState !== GameState.PLAYER_TWO_WIN) {
		// 	room.pause();
		// }

		/**
		 * 위의 예외를 제외하고 클라이언트가 방을 떠남
		 * 유저를 게임 방에서 내보내고 게임(채팅)페이지에 접속한 상태로 만든다.
		 */
		client.leave(room.roomId);
		this.gameconnetedUsers.changeUserStatus(client.id, UserStatus.IN_HUB);
		this.server.to(client.id).emit('leavedRoom');
		this.logger.log(`handleGetCurrentGames: currentGames: after: ${this.currentGames}`);
	}

	/** 게임결과를 저장 */
	async saveGame(room: Room, bool: boolean) {
		let winner_id: number, loser_id: number, win_score: number, lose_score: number;

		this.logger.log(`=========new SaveGame Log==========`);
		this.logger.log(`${room.paddleOne.gameuser.nickname} 과 ${room.paddleTwo.gameuser.nickname}의 게임이 저장 됩니다.`);
		this.logger.log(`${room.paddleOne.goal} : ${room.paddleTwo.goal}입니다.`);
		this.logger.log(`saveGame: 현재 게임 상태는 ${room.gameState}입니다. 1.`);
		/** Player1 승리 */
		if (room.gameState === GameState.PLAYER_ONE_WIN || room.gameState === GameState.PLAYER_TWO_OUT) {
			this.logger.log(`saveGame: 현재 게임 상태는 ${room.gameState}입니다. 2.`);
			if (bool)
			{
				this.logger.log(`SaveGame: 정상적으로 종료된 경우 플레이어 1가 승리했습니다.`);
				winner_id = room.paddleOne.gameuser.id;
				loser_id = room.paddleTwo.gameuser.id;
				win_score = room.paddleOne.goal;
				lose_score = room.paddleTwo.goal;
			}
			else
			{
				this.logger.log(`SaveGame: 비정상적으로 종료된 경우 플레이어 1가 승리했습니다.`);
				winner_id = room.paddleOne.gameuser.id;
				loser_id = room.paddleTwo.gameuser.id;
				win_score = 1;
				lose_score = -1;
				room.gameState = GameState.GAME_SAVED;
			}
		} /** Player2 승리 */
		else if (room.gameState === GameState.PLAYER_TWO_WIN || room.gameState === GameState.PLAYER_ONE_OUT) {
			this.logger.log(`saveGame: 현재 게임 상태는 ${room.gameState}입니다. 3.`);
			if (bool)
			{
				this.logger.log(`SaveGame: 정상적으로 종료된 경우 플레이어 2가 승리했습니다.`);
				winner_id = room.paddleTwo.gameuser.id;
				loser_id = room.paddleOne.gameuser.id;
				win_score = room.paddleTwo.goal;
				lose_score = room.paddleOne.goal;
			}
			else
			{
				// room.gameState = GameState.PLAYER_ONE_OUT;
				this.logger.log(`SaveGame: 비정상적으로 종료된 경우 플레이어 2가 승리했습니다.`);
				winner_id = room.paddleTwo.gameuser.id;
				loser_id = room.paddleOne.gameuser.id;
				win_score = 1;
				lose_score = -1;
				room.gameState = GameState.GAME_SAVED;
			}
		}
		this.logger.log(`winner_id: ${winner_id}, loser_id: ${loser_id}, win_score: ${win_score}, lose_score: ${lose_score}, mode: ${room.mode}`);
		/**
		 * winner_id(room.paddleOne.gameuser.id)가 전체 유저에서 winner_id를 이용해서 찾은 id와 같은지 확인 필요!
		 * -> 전체 유저에서 winner(loser)_id를 이용해 id를 비교해서 id를 저장한 것이 아니라 객체를 찾아서 반환한 것!!!
		 *
		 * GamesEntity로 하면 안되는 이유가 있더라...
		 * -> player[]: User로 선언이 되어있어서 플레이어 배열 안에 Games이 아닌 User를 넣어줘야한다.
		 */
		const winner = await this.usersService.getUserById(winner_id);
		const loser = await this.usersService.getUserById(loser_id);
		await this.usersService.updateStatus(winner, true);
		await this.usersService.updateStatus(loser, false);
		this.logger.log(`saveGame: 유저서비스에 잘 저장했습니다.`);

		this.logger.log(`winner: ${winner.nickname}, loser: ${loser.nickname}, winner_id: ${winner_id}, loser_id: ${loser_id}, win_score: ${win_score}, lose_score: ${lose_score}, mode: ${room.mode}`);

		const game = this.gamesService.create({
			players: [winner, loser],
			winner_id: winner_id,
			loser_id: loser_id,
			win_score: win_score,
			lose_score: lose_score,
			mode: room.mode,
		});
		this.logger.log(`saveGame: 게임 서비스에 잘 저장했습니다.`);

		/**
		 * 게임이 끝난 방은 삭제
		 * roomIndex: 지워야하는 방의 id와 map에 있는 방의 id와 비교해서 index를 가져온다.
		 */
		// this.logger.log(`saveGame: 지워야할 인덱스를 찾습니다. room의 roomId는 ${room.roomId} 입니다.`);
		// const roomIndex : number = this.currentGames.findIndex((toRemove) => toRemove.roomId === room.roomId);
		// if (roomIndex !== -1) {
		// 	this.logger.log(`saveGame: 지워야할 인덱스를 찾았습니다. ${roomIndex}`);
		// 	this.currentGames.splice(roomIndex, 1);
		// }
		// else
		// 	this.logger.log(`saveGame: 지워야할 인덱스를 못 찾았습니다.. ${roomIndex}`);

		this.server.emit('updateCurrentGames', this.currentGames);
		return this.returnMessage('saveGame', 200, '게임 저장 성공');
	}

	/** 초로 변환 */
	secondToTimeStamp(millsecond: number): number {
		return millsecond * 1000;
	}

	/**
	 * 게임이 시작되면 Room 인스턴스 정보를 계속 요청
	 * * Client/GameScreen에서 gameLoop()안에서 동작
	 *
	 * 1. 게임 시작
	 * 2. 게임 중
	 * 3. 유저가 점수를 획득했을 떄
	 * 4. 재시작 됐을 때
	 * 5. 일시정지
	 * @param roomId
	 */
	@SubscribeMessage('requestUpdate')
	async handleRequestUpdate(@MessageBody() roomId: string) {
		/** 방의 정보를 가져와서  */
		const room: Room = this.rooms.get(roomId);
		if (!room) {
			return this.returnMessage('requestUpdate', 400, '방이 없습니다.');
		}
		/** 현재 시간 저장 */
		const currentTimestamp: number = Date.now();
		/**
		 * 친구 초대 후 대기 중이라면 -> 친구가 아니라 유저 초대가 아닌가?
		 * 유저가 2명이 됐을 때 게임 시작
		 */
		if (room.gameState === GameState.WAITING) {
			if (room.players.length === 2) {
				room.gameState = GameState.STARTING;
				room.start();
			}
		}
		/**
		 * 게임이 사작 상태이고 현재 시간과 게임방이 만들어진 시간이 3.5초 이상인 경우 게임 실행
		 */
		if (room.gameState === GameState.STARTING && currentTimestamp - room.timestampStart >= this.secondToTimeStamp(3)) {
			room.start();
		}
		else if (room.gameState === GameState.PLAYING) {
			room.update(currentTimestamp);
		}
		/**
		 * 점수가 난 상황
		 * 공과 패들 위치 초기화.
		 * 게임 상태를 다시 게임 중으로 변경.
		 * 마지막 업데이트 시간 변경.
		 */
		else if ((room.gameState === GameState.PLAYER_ONE_SCORED ||
			room.gameState === GameState.PLAYER_TWO_SCORED) &&
			currentTimestamp - room.goalTimestamp >= this.secondToTimeStamp(1)) {
			room.resetPostion();
			room.changeGameState(GameState.PLAYING);
			room.lastUpdate = Date.now();
		}
		/**
		 * 재시작 됐을 때
		 */
		else if (room.gameState === GameState.RESUMED &&
			currentTimestamp - room.pauseTime[room.pauseTime.length - 1].resume >= this.secondToTimeStamp(3))
		{
			room.lastUpdate = Date.now();
			room.changeGameState(GameState.PLAYING);
		} /** 게임 종료 시 저장 */
		else if (room.gameState === GameState.RESUMED &&
			currentTimestamp - room.pauseTime[room.pauseTime.length - 1].resume >= this.secondToTimeStamp(42))
		{
			room.players[0].id == room.paddleOne.gameuser.id
			room.pauseForfait();
			room.pauseTime[room.pauseTime.length - 1].resume = Date.now();
		}
		else if (room.gameState === GameState.PLAYER_ONE_WIN || room.gameState === GameState.PLAYER_TWO_WIN) {
			if (room.gameState === GameState.PLAYER_ONE_WIN)
				room.changeGameState(GameState.PLAYER_ONE_WIN);
			else
				room.changeGameState(GameState.PLAYER_TWO_WIN);
			this.logger.log('requestRoom: 게임이 종료되었습니다.');
		}
		/** 방의 정보를 클라이언트에 전달 */
		this.server.to(room.roomId).emit('updateRoom', JSON.stringify(room.serialize()));
	}

	/** Game Key */
	/**
	 * Key를 누룰 때 동작
	 * @param client
	 * @param data
	 */
	@SubscribeMessage('keyDown')
	async handleKeyDown(@ConnectedSocket() client: Socket, @MessageBody() data: { roomId: string; key: string; id: number;}) {
		const room: Room = this.rooms.get(data.roomId);
		/** paddle one 조작 */
		if (room && room.paddleOne.gameuser.id === data.id) {
			if (data.key === 'ArrowUp') {
				room.paddleOne.up = true;
				room.paddleOne.down = false;
			}
			else if (data.key === 'ArrowDown') {
				room.paddleOne.up = false;
				room.paddleOne.down = true;
			}
			else if (data.key === 'q') {
				this.logger.log(`keyDown 시 key값은 ${data.key}입니다.`);
				if (room.gameState === GameState.PLAYING)
					room.pause();
				else if (room.gameState === GameState.PAUSED)
					room.resume();
			}
		} /** paddle two 조작 */
		else if (room && room.paddleTwo.gameuser.id === data.id) {
			if (data.key === 'ArrowUp') {
				room.paddleTwo.up = true;
				room.paddleTwo.down = false;
			}
			else if (data.key === 'ArrowDown') {
				room.paddleTwo.up = false;
				room.paddleTwo.down = true;
			}
			else if (data.key === 'q') {
				this.logger.log(`keyDown 시 key값은 ${data.key}입니다.`);
				if (room.gameState === GameState.PLAYING)
					room.pause();
				else if (room.gameState === GameState.PAUSED)
					room.resume();
			}
		}
	}

	/**
	 * Key를 뗄 때 동작
	 * @param client
	 * @param data
	 */
	@SubscribeMessage('keyUp')
	async handleKeyUP(@ConnectedSocket() client: Socket, @MessageBody() data: { roomId: string; key: string; id: number;}) {
		const room: Room = this.rooms.get(data.roomId);

		if (room && room.paddleOne.gameuser.id === data.id) {
			if (data.key === 'ArrowUp') {
				room.paddleOne.up = false;
				room.paddleOne.down = false;
			}
			else if (data.key === 'ArrowDown') {
				room.paddleOne.up = false;
				room.paddleOne.down = false;
			}
		} else if (room && room.paddleTwo.gameuser.id === data.id) {
			if (data.key === 'ArrowUp') {
				room.paddleTwo.up = false;
				room.paddleTwo.down = false;
			}
			else if (data.key === 'ArrowDown') {
				room.paddleTwo.up = false;
				room.paddleTwo.down = false;
			}
		}
	}

	/**
	 * 게임 관전 관련 함수 => 분석 및 수정 필요!!!!
	 * 채팅방에서 방 생성 및 관전 초대
	 * Game Gateway With Chat
	 */
	/**
	 * * 게임을 관전하는 방
	 * * Front GameRoom에서 spectateRoom를 서버에 전달
	 */
// 	@SubscribeMessage('spectateRoom')
// 	handleSpectateRoom(@ConnectedSocket() client: Socket, @MessageBody() roomId: string) {
// 		/** 관전할 방이 없음 */
// 		const room: Room = this.rooms.get(roomId);
// 		if (!room) {
// 			return this.returnMessage('spectateRoom', 400, '방이 없습니다.');
// 		}

// 		/** 관전 방에 게임 유저가 없음 */
// 		const gameuser = this.gameconnetedUsers.getUserBySocketId(client.id);
// 		if (!gameuser) {
// 			return this.returnMessage('spectateRoom', 400, '현재 게임 유저가 없습니다.');
// 		}
// 		// else if (gameuser.status === UserStatus.PLAYING) {
// 		// 	throw new Error('게임 중에는 관전할 수 없습니다.');
// 		// }

// 		/**
// 		 * 현재 게임 중이면 관전 불가?????
// 		 */
// 		// const memoryUser = this.gameconnetedUsers.getUserBySocketId(client.id);
// 		// if (memoryUser.status === UserStatus.PLAYING) {
// 		// 	throw new Error('게임 중에는 관전할 수 없습니다.');
// 		// }

// 		/** user가 관전자가 아니라면 관전자로 추가 */
// 		if (!room.isASpectator(gameuser)) {
// 			room.addSpectator(gameuser);
// 		}
// 		this.server.to(client.id).emit('newRoom', room);
// 		return this.returnMessage('spectateRoom', 200, '방 정보 전송 성공');
// 	}

// 	/**
// 	 * ! 게임 관전 유저 생성
// 	 * 게임 메모리에 유저가 존재하는지 확인하고 없으면 생성
// 	 * @param id
// 	 * @param username
// 	 */
// 	async createSpectateUser(id: number, username?: string) {
// 		let newUser: GameUser = this.gameconnetedUsers.getUserById(id);
// 		if (!newUser) {
// 			this.gameconnetedUsers.addUser(newUser);
// 			const dbUser = await this.usersService.getUserById(id);
// 			newUser = new GameUser(dbUser.id, dbUser.nickname, dbUser.avatar, dbUser.wins, dbUser.losses, dbUser.ratio);
// 			// const dbUser = await this.usersService.getUserWithoutFriends(id);
// 			// newUser = new User(id, dbUser.nickname, dbUser.photo, dbUser.wins, dbUser.losses, dbUser.ratio);
// 		}
// 		return newUser;
// 	}

// 	/**
// 	 * 방에 관전자를 추가
// 	 * @param id
// 	 * @param roomId
// 	 * @returns
// 	 */
// 	async pushSpectatorToRoom(id: number, roomId: string) {
// 		/** 관전할 방이 없음 */
// 		const room: Room = this.rooms.get(roomId);
// 		if (!room) {
// 			return this.returnMessage('spectateRoom', 400, '방이 없습니다.');
// 		}
// 		/** createSpectateUser를 통해서 소켓에 접속한 유저 배열에 해당 id 유저가 있는지 확인하고
// 		 * 있다면 그 유저를 반환
// 		 * 없다면 db에서 찾아서 유저 정보를 가져와서 반환
// 		 */
// 		const gameuser = await this.createSpectateUser(id);

// 		/** 전체 게임 방에서 찾은 유저가 게임 플레이어인지 확인 */
// 		this.rooms.forEach((room: Room) => {
// 			if (room.isAPlayer(gameuser))
// 				return ;
// 		});

// 		/** 게임 플레이어가 아니라면 관전자로 추가 */
// 		if (!room.isAPlayer(gameuser)) {
// 			room.addSpectator(gameuser);
// 		}
// 		return this.returnMessage('spectateRoom', 200, '방 정보 전송 성공');
// 	}

// 	/**
// 	 * ! 게임 초대
// 	 */
// 	setInviteRoomToReady(roomId: string) {
// 		const room = this.rooms.get(roomId);
// 		if (!room) {
// 			throw new Error('Game is over');
// 		}
// 		room.changeGameState(GameState.STARTING);
// 		return room;
// 	}

// 	/**
// 	 * 게임 메모리에 유저가 존재하는지 확인하고 없으면 생성
// 	 * @param id
// 	 * @param username
// 	 */
// 	async createInvitedUser(id: number, username: string) {
// 		let newUser: GameUser = this.gameconnetedUsers.getUserById(id);
// 		if (!newUser) {
// 			// const dbUser = await this.usersService.getUserWithoutFriends(id);
// 			// newUser = new User(id, dbUser.nickname, dbUser.photo, dbUser.wins, dbUser.losses, dbUser.ratio);
// 			const dbUser = await this.usersService.getUserById(id);
// 			newUser = new GameUser(dbUser.id, dbUser.nickname, dbUser.avatar);
// 			this.gameconnetedUsers.addUser(newUser);
// 		}
// 		return newUser;
// 	}

// 	/** 방이 이미 존재 */
// 	roomAlreadyExists(senderId: number, receiverId: number): boolean {
// 		/**
// 		 * sender: 게임 초대 보낸 사람
// 		 * reciver: 게임 초대 받는 사람
// 		 */
// 		const sender = this.gameconnetedUsers.getUserById(senderId);
// 		const receiver = this.gameconnetedUsers.getUserById(receiverId);

// 		/** 유저가 없다면 */
// 		if (!sender || !receiver) {
// 			return true;
// 		}

// 		/** 초대를 보낸사람과 안보낸 사람이 게임 방에 접속해 있는지 확인 */
// 		this.rooms.forEach((room: Room) => {
// 			if (room.isAPlayer(sender)) {
// 				throw Error('게임 방에 접속해 있습니다.');
// 			}
// 			if (room.isAPlayer(receiver)) {
// 				throw Error('게임 방에 접속해 있습니다');
// 			}
// 		});
// 	}

// 	/** 초대해서 방 생성 */
// 	async createInviteRoom(sender: GameUser, receiverId: number) {
// 		/** 유저관리 */
// 		// const receiverData = await this.usersService.getUserWithoutFriends(receiverId);
// 		const receiverData = await this.usersService.getUserById(receiverId);
// 		const firstPlayer: GameUser = await this.createInvitedUser(sender.id, sender.nickname);
// 		const secondPlayer: GameUser = await this.createInvitedUser(receiverData.id, receiverData.nickname);

// 		/** 게임 초대 */
// 		if (this.roomAlreadyExists(sender.id, receiverId)) {
// 			throw new Error('이미 게임이 존재합니다.');
// 		}
// 		if (secondPlayer && secondPlayer.status === UserStatus.SPECTATING) {
// 			throw new Error('상대방이 관전 중입니다.');
// 		}
// 		if (firstPlayer && firstPlayer.status === UserStatus.SPECTATING) {
// 			throw new Error('관전 중에는 초대할 수 없습니다. LeaveRoom을 눌러주세요');
// 		}

// 		/** 게임 방 생성 */
// 		const roomId: string = `${firstPlayer.nickname}&${secondPlayer.nickname}`;
// 		let room: Room = new Room(roomId, [firstPlayer, secondPlayer]);
// 		room.gameState = GameState.WAITING;
// 		this.rooms.set(roomId, room);
// 		this.currentGames.push(room);

// 		/** 게임방 생성 후 클라이언트에 알리기 */
// 		this.server.emit('updateCurrentGames', this.currentGames);
// 		return roomId;
// 	}
}

/**
 * GameGateway 주석 추가 및 로그 확인
 */
