import { ChatUser } from "../chatuser.entity";

export enum Role {
	HOST = 'HOST',
	MEMBER = 'MEMBER',
	ADMIN = 'ADMIN',
}

export class ChatUserDefaultDto {
	constructor(chatUser: ChatUser) {
		this.user_id = chatUser.user_id.id;
	}
	id: number;
	
	nickname: string;

	avatar: string;

	is_muted: boolean;
	
	user_id: number;

	role: Role;
}
