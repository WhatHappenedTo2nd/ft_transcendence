import IUserProps from "./IUserProps";

/**
 * Game 화면크기(해상도)
 * 1920 * 1080
 */
export const canvasWidth = 1920;
export const canvasHeight = 1080;

/**
 * Game 시작 전/후 게임플레이 중 상태를 나타낸다.
 */
export enum GameState {
	WAITING,
	STARTING,
	PLAYING,
	PAUSED,
	RESUMED,
	PLAYER_ONE_SCORED,
	PLAYER_TWO_SCORED,
	PLAYER_ONE_WIN,
	PLAYER_TWO_WIN,
}

export interface IKey {
	roomId: string;
	key: string;
	id : number;
}

/**
 * Game에 참여하는 User의 인터페이스
 */
export interface IUser {
	id: number;
	nickname: string;
	avatar: string;
	wins: number;
	losses: number;
	ratio: number;
}

/**
 * Game시작 후 나타나는 패들의 정보를 담기위한 인터페이스
 * 왼쪽/오른쪽 두 개의 패들이 생성되며, 이는 두 명의 유저(플레이어)를 의미한다.
 */
export interface IPlayer {
	gameuser: IUser;
	x: number;
	y: number;
	color: string;
	width: number;
	height: number;
	goal: number;
}

/**
 * Game에서 사용되는 ball
 */
export interface IBall {
	x: number;
	y: number;
	r: number;
	color: string;
}

/**
 * Game Room 전체의 인터페이스
 *
 * roomId: 게임방의 번호
 * GameState: 게임의 현재 상태(시작/퍼즈/게임중 등)
 * padlleOne(Two): 핑퐁게임에서 사용되는 패들(막대기)
 * ball: 핑퐁게임의 공
 * timestampStart: 시작하는 시간 표시(5 4 3 2 1과 같이)
 * goalTimeStamp: 골이 들어갔을 때 표시
 * pauseTime: 퍼즈 시간
 * winner: 승자
 * loser: 패자
 * mode : 게임 모드
 * timer : 타이머
 * gameDuration: 게임 지속시간
 */
export interface IRoom {
	roomId: string;
	gameState: GameState;
	paddleOne: IPlayer;
	paddleTwo: IPlayer;
	ball: IBall;
	timestampStart: number;
	goalTimestamp: number;
	pauseTime: { pause: number; resume: number }[];
	winner: string;
	loser: string;
	mode: string;
	timer: number;
	gameDuration: number;
}

/**
 * !인터페이스에서 인터페이스를 가져온다???
 */
export interface IMatch
{
	id: number;
	winner: IUserProps;
	loser: IUserProps;
	win_score: number;
	lose_score: number;
}

/**
 * IPlayer의 user를 gameuser로 변경
 * 백엔드의 변수명과 동일해야한다!!! -> 변수 명 변경 후 데이터 넘어가는 거 확인!
 *
 * 2022/09/28
 * IMatch interface 추가 -> 승자/패자/승리점수/패배점수
 * gamesController에서 넘겨준 데이터를 저장할 인터페이스
 */
