import { Ball } from "./game-ball.class";
import { Paddle } from "./game-paddle.class";
import { GameUser } from "./game-user.class";
import { GameMode, GameState } from "../enum/games.enum";
import { CANVAS_WIDTH, MAX_GOAL } from "../constant/games.constant";
import { Logger } from "@nestjs/common";
export interface IRoom {
	roomId: string;
	gameState: GameState;
	players: GameUser[];
	paddleOne: Paddle;
	paddleTwo: Paddle;
	ball: Ball;
	timestampStart: number;
	lastUpdate: number;
	goalTimestamp: number;
	pauseTime: {
		pause: number;
		resume: number;
	}[];
	maxGoal: number;
	timer: number;
	gameDuration: number;
}

/**
 * 소켓에 데이터를 보내기 위해서 사용
 */
export type SerializeRoom = {
	roomId: string;
	gameState: GameState;
	paddleOne: {
		gameuser: {
			id: number;
			nickname: string;
		};
		x: number;
		y: number;
		width: number;
		height: number;
		color: string;
		goal: number;
	};
	paddleTwo: {
		gameuser: {
			id: number;
			nickname: string;
		};
		x: number;
		y: number;
		width: number;
		height: number;
		color: string;
		goal: number;
	};
	ball: {
		x: number;
		y: number;
		r: number;
		color: string;
	}
	timestampStart: number;
	goalTimestamp: number;
	pauseTime: {
		pause: number;
		resume: number;
	}[];
	mode: number;
	timer: number;
	gameDuration: number;
}

export default class Room implements IRoom {
	private logger: Logger = new Logger('Room');
	roomId: string;
	gameState: GameState;
	players: GameUser[];
	spectators: GameUser[]; //관중
	paddleOne: Paddle;
	paddleTwo: Paddle;
	ball: Ball;
	timestampStart: number;
	lastUpdate: number;
	goalTimestamp: number;
	pauseTime: {
		pause: number;
		resume: number;
	}[];
	maxGoal: number;
	isGameEnd: boolean;
	mode: GameMode;
	timer: number;
	gameDuration: number;

	constructor(roomId: string, gameusers: GameUser[], customisation: { mode?: GameMode } = { mode: GameMode.DEFAULT }) {
		this.roomId = roomId;
		this.gameState = GameState.STARTING;
		this.players = [];
		this.spectators = [];
		this.paddleOne = new Paddle(gameusers[0], 10, customisation.mode);
		this.paddleTwo = new Paddle(gameusers[1], CANVAS_WIDTH - 40, customisation.mode);
		this.ball = new Ball(customisation.mode);
		this.timestampStart = Date.now();
		this.lastUpdate = Date.now();
		this.goalTimestamp = Date.now();
		this.pauseTime = [];
		this.mode = customisation.mode;
		this.maxGoal = MAX_GOAL;
		this.isGameEnd = false;
		this.timer = 0;
		this.gameDuration = 60000 * 5; //1min * number of minutes
	}

	/** 방에 접속한 사람이 게임유저인지 확인 */
	isAPlayer(gameuser: GameUser): boolean {
		return (
			this.paddleOne.gameuser.nickname === gameuser.nickname ||
			this.paddleTwo.gameuser.nickname === gameuser.nickname
		);
	}

	/**
	 * 방에 접속한 사람이 관전자인지 확인
	 * @param gameusers
	 * @returns
	 */
	isASpectator(gameusers: GameUser): boolean {
		/**
		 * @func findIndex: 주어진 판별 함수를 만족하는 배열의 첫 번째 요소에 대한 인덱스를 반환합니다. 만족하는 요소가 없으면 -1을 반환합니다.
		 * @see https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex
		 * 배열의 요소에서 value 속성 값이 gameusers.id인 배열의 요소를 반환
		 */
		/**
		 * 관전자 배열에 유저가 있는지 확인
		 * 배열 안에 관전자로 있다면 true, 없다면 false
		 */
		const index = this.spectators.findIndex((value) => {
			return value.id === gameusers.id;
		});
		if (index === -1) {
			return false;
		}
		return true;
	}

	findOne(gameuser: GameUser): number {
		return this.players.findIndex((element) => element.id === gameuser.id);
	}

	addUser(gameuser: GameUser) {
		this.players.push(gameuser);
	}

	getUser(): GameUser[] {
		return this.players;
	}

	removeUser(gameuser: GameUser) {
		const userIndex: number = this.players.findIndex((value) => value.nickname === gameuser.nickname);
		if (userIndex !== -1) {
			this.players.splice(userIndex, 1);
		}
	}

	addSpectator(gameuser: GameUser) {
		this.spectators.push(gameuser);
	}

	removeSpectator(gameuser: GameUser) {
		const userIndex: number = this.spectators.findIndex((value) => value.nickname === gameuser.nickname);
		if (userIndex !== -1) {
			this.spectators.splice(userIndex, 1);
		}
	}

	/**
	 *
	 * @param newGameState
	 * GameState
	 *
	 */
	changeGameState(newGameState: GameState): void {
		this.gameState = newGameState;
	}

	start(): void {
		this.timestampStart = Date.now();
		this.lastUpdate = Date.now();
		this.changeGameState(GameState.PLAYING);
	}

	pause(): void {
		this.changeGameState(GameState.PAUSED);
		this.pauseTime.push({ pause: Date.now(), resume: Date.now() });
	}

	resume(): void {
		this.changeGameState(GameState. RESUMED);
		this.pauseTime.push({ pause: Date.now(), resume: Date.now() });
	}

	/**
	 * Goal이 들어갔을 때 패들과 공의 위치를 초기화
	 */
	resetPostion(): void {
		this.paddleOne.reset();
		this.paddleTwo.reset();
		this.ball.reset(this.mode);
	}

	/**
	 * 골이 들어갔을 때(점수가 났을 때) 실행
	 */
	scoreGoal() {
		/**
		 * 골이 들어갔을 때
		 */
		if (this.ball.goal === true) {
			this.goalTimestamp = this.lastUpdate;
		/**
		 * 최대 점수에 도달 -> PLAYER_WIN
		 * 그렇지 않으면 -> PLAYER_SCORE
		 */
			if ((this.mode === GameMode.DEFAULT || this.mode === GameMode.HARD) &&
				(this.paddleOne.goal === this.maxGoal || this.paddleTwo.goal === this.maxGoal))
			{
				if(this.paddleOne.goal === this.maxGoal) {
					this.changeGameState(GameState.PLAYER_ONE_WIN);
				}
				else if (this.paddleTwo.goal === this.maxGoal) {
					this.changeGameState(GameState.PLAYER_TWO_WIN);
				}
				this.isGameEnd = true;
			} else {
				if (this.ball.x < CANVAS_WIDTH / 2) {
					this.changeGameState(GameState.PLAYER_TWO_SCORED);
				}
				else {
					this.changeGameState(GameState.PLAYER_ONE_SCORED);
				}
				this.ball.goal = false;
			}
		}
	}

	update(currentTimestamp: number): void {
		let secondPassed: number = (currentTimestamp - this.lastUpdate) / 1000;
		this.lastUpdate = currentTimestamp;

		this.paddleOne.update(secondPassed);
		this.paddleTwo.update(secondPassed);
		this.ball.updete(secondPassed, this.paddleOne, this.paddleTwo);
		this.scoreGoal();
	}

	pauseForfait() {
		if (this.players[0].id === this.paddleOne.gameuser.id) {
			this.changeGameState(GameState.PLAYER_ONE_WIN);
		} else {
			this.changeGameState(GameState.PLAYER_TWO_WIN);
		}
	}

	serialize(): SerializeRoom {
		const newSerializeRoom: SerializeRoom = {
			roomId: this.roomId,
			gameState: this.gameState,
			paddleOne: {
				gameuser: {
					id: this.paddleOne.gameuser.id,
					nickname: this.paddleOne.gameuser.nickname,
				},
				width: this.paddleOne.width,
				height: this.paddleOne.height,
				x: this.paddleOne.x,
				y: this.paddleOne.y,
				color: this.paddleOne.color,
				goal: this.paddleOne.goal,
			},
			paddleTwo: {
				gameuser: {
					id: this.paddleTwo.gameuser.id,
					nickname: this.paddleTwo.gameuser.nickname,
				},
				width: this.paddleTwo.width,
				height: this.paddleTwo.height,
				x: this.paddleTwo.x,
				y: this.paddleTwo.y,
				color: this.paddleTwo.color,
				goal: this.paddleTwo.goal,
			},
			ball: {
				x: this.ball.x,
				y: this.ball.y,
				r: this.ball.r,
				color: this.ball.color,
			},
			timestampStart: this.timestampStart,
			goalTimestamp: this.goalTimestamp,
			pauseTime: this.pauseTime,
			mode: this.mode,
			timer: this.timer,
			gameDuration: this.gameDuration,
		};
		return newSerializeRoom;
	}
}

/**
 * GameRoom class
 */
