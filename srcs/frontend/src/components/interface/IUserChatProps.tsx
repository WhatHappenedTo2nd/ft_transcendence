export enum Role {
	HOST = 'HOST',
	MEMBER = 'MEMBER',
	ADMIN = 'ADMIN',
}

export default interface IUserChatProps {
	id: number;
	intra_id: string;
	nickname: string;
	avatar: string;
	is_online: boolean;
	now_playing: boolean;
	email: string;
	tfaCode:string;
	tfaAuthorized: boolean;
	wins: number;
	losses: number;
	ratio: string;
	is_muted: boolean;
	role: Role;
};
