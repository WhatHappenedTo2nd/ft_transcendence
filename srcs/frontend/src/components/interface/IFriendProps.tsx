export enum Status {
	PLAYING = 'PLAYING',
	ONLINE = 'ONLINE',
	OFFLINE = 'OFFLINE',
}

export default interface FriendProps {
	id: number;
	nickname: string;
	avatar: string;
	isblock: boolean;
	status: Status;
};