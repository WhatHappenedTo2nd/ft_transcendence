import { CustomRepository } from "src/typeorm-ex/typeorm-ex.decorator";
import { BadRequestException, ConflictException, InternalServerErrorException } from "@nestjs/common";
import { Equal, Repository } from "typeorm";
import { User } from "../user/user.entity";
import { Chat } from "./chat.entity";
import { ChatDto } from "./dto/chat.dto";

@CustomRepository(Chat)
export class ChatRepository extends Repository<Chat> {
	async ChatList(chat: Chat): Promise<ChatDto> {
		const result: ChatDto = {
			id: chat.id,
			title: chat.title,
			password: chat.password,
			is_private: chat.is_private,
			now_playing: chat.now_playing
		};
		return result;
	}
}
