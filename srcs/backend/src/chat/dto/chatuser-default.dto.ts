import { ChatUser } from "../chatuser.entity";

export class ChatUserDefaultDto {
	constructor(chatUser: ChatUser) {
		this.user_id = chatUser.user_id.id;
	}
	id: number;
	
	nickname: string;

	avatar: string;

	is_muted: boolean;
	
	user_id: number;

	is_host: boolean;
}
