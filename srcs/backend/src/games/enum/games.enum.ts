/**
 * 유저 상태
 *
 * IN_HUB     게임 페이지 접속
 * IN_QUEUE   큐 접속
 * OFFLINE    오프라인
 * ONLINE     사이트 접속
 * PLAYING    게임 중
 * SPECTATING 관전 중
 */
export enum UserStatus {
	IN_HUB,
	IN_QUEUE,
	OFFLINE,
	ONLINE,
	PLAYING,
	SPECTATING,
}
/**
 * 게임 상태
 *
 * WAITING
 * STARTING
 * PLAYING
 * PAUSED
 * RESUMED
 * PLAYER_ONE_SCORED
 * PLAYER_TWO_SCORED
 * PLAYER_ONE_WIN
 * PLAYER_TWO_WIN
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
	PLAYER_ONE_OUT,
	PLAYER_TWO_OUT,
	GAME_SAVED_ONE_WIN,
	GAME_SAVED_TWO_WIN,
	GAME_SAVED_ONE_OUT,
	GAME_SAVED_TWO_OUT,
}
/**
 * 게임 모드
 *
 * DEFAULT
 */
export enum GameMode {
	DEFAULT,
	HARD,
}

/**
 * User Achievement
 */
// export enum AchievementList {
// 	SIGN_UP,
// 	FRIENDS_FIRST_MAKE,
// 	GAME_FIRST_WIN,
// }

/**
 * Game에서 사용할 enum
 */
