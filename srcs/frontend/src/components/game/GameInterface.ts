/**
 * Game 화면크기(해상도)
 * 1920 * 1080
 */
export const canvasWidth = 1920;
export const canvasHeigth = 1080;

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
	width: number;
	height: number;
	goal: number;
	color: string;
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
 * mode
 * timer
 * gameDuration
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
 * IPlayer의 user를 gameuser로 변경
 * 백엔드의 변수명과 동일해야한다!!! -> 변수 명 변경 후 데이터 넘어가는 거 확인!
 */
