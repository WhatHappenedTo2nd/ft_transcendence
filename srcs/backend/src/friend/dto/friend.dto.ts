export enum Status {
	PLAYING = 'PLAYING',
	ONLINE = 'ONLINE',
	OFFLINE = 'OFFLINE',
}

export class FriendDto {
	id: number;
	
	nickname: string;
	
	avatar: string;
	
	isblock: boolean;

	status: Status;
}
