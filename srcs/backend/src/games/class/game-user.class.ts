import { GameMode, UserStatus } from "../enum/games.enum";

/**
 * @class 소켓에 접속한 유저 클래스
 */
export class GameUser {
	id: number;
	nickname: string;
	avatar?: string;
	status?: UserStatus;
	mode?: GameMode;
	socketId?: string;
	roomId?: string;
	wins?: number;
	losses?: number;
	ratio?: string;
	roomNo?: number;

	constructor( id: number, nickname: string, avatar: string,  wins?: number, losses?: number, ratio?:string, socketId?: string) {
		this.id = id;
		this.nickname = nickname;
		this.avatar = avatar;
		this.socketId = socketId;
		this.wins = wins;
		this.losses = losses;
		this.ratio = ratio;
	}

	/**
	 * @Setter
	 */
	setNickname(nickname: string) {
		this.nickname = nickname;
	}

	setSocketId(socketId: string) {
		this.socketId = socketId;
	}

	setRoomId(roomId: string | undefined) {
		this.roomId = roomId;
	}

	setUserStatus(status: UserStatus) {
		this.status = status;
	}

	setRoomNo(roomNo:number | undefined){
		this.roomNo = roomNo;
	}

	setMode(mode: string) {
		if (mode === 'HARD') {
			this.mode = GameMode.HARD;
		} else {
			this.mode = GameMode.DEFAULT;
		}
	}
}

/**
 * GameUser class
 */
