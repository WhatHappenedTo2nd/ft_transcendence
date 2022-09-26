export enum Status {
	PLAYING = 'PLAYING',
	ONLINE = 'ONLINE',
	OFFLINE = 'OFFLINE',
}

export default interface IFriendProps {
	id: number;
	nickname: string;
	avatar: string;
	isblock: boolean;
	status: Status;
};