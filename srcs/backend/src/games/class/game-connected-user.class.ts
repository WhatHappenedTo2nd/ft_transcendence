import { DEFAULT_MAX_USER } from "../constant/games.constant";
import { UserStatus } from "../enum/games.enum";
import { GameUser } from "./game-user.class";

/** 소켓에 접속한 유저 전체이며 Array로 메모리에 저장 */
export class GameConnectedUser {
	/** 게임에 접속한 유저를 잡는 배열 */
	gameusers: Array<GameUser> = new Array();

	/**
	 * @func constructor
	 * @param maxUser
	 */
	constructor(private maxUser: number = DEFAULT_MAX_USER) {}

	/**
	 * @func addUser
	 * @param gameuser
	 */
	addUser(gameuser: GameUser) {
		if (this.maxUser !== this.gameusers.length)
			this.gameusers.push(gameuser);
	}

	/**
	 * @func findAll
	 * @returns
	 */
	findAll(): GameUser[] {
		return this.gameusers;
	}

	removeUser(gameuser: GameUser) {
		let index: number = this.gameusers.findIndex((element) => element.socketId === gameuser.socketId);
		if (index !== -1) {
			this.gameusers.splice(index, 1);
		}
	}

	getUserBySocketId(socketId: string): GameUser | undefined {
		let index: number = this.gameusers.findIndex((element) => element.socketId === socketId);
		if (index === -1) {
			return undefined;
		}
		return this.gameusers[index];
	}

	getUserById(id: number): GameUser | undefined {
		let index: number = this.gameusers.findIndex((element) => element.id === id);
		if (index === -1) {
			return undefined;
		}
		return this.gameusers[index];
	}

	changeUserStatus(socketId: string, status: UserStatus) {
		let gameuser: GameUser = this.getUserBySocketId(socketId);
		gameuser.setUserStatus(status);
	}

	setGameMode(socketId: string, mode: string) {
		let gameuser: GameUser = this.getUserBySocketId(socketId);
		gameuser.setMode(mode);
	}
}
