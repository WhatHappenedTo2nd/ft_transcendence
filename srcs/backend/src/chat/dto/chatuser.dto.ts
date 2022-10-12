import { ChatUser } from "../chatuser.entity";

export class ChatUserDto {
	constructor(chatUser: ChatUser) {
		this.user_id = chatUser.user_id.id;
	}
	id: number;
	
	user_id: number;

	is_muted: boolean;
}
