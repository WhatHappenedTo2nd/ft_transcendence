import { InternalServerErrorException } from "@nestjs/common";
import { CustomRepository } from "src/typeorm-ex/typeorm-ex.decorator";
import { User } from "src/user/user.entity";
import { Repository } from "typeorm";
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
			now_playing: chat.now_playing,
			host_id: chat.host.id,
		};
		return result;
	}

	async findOneByRoomname(title: string): Promise<Chat> {
		const room: Chat = await this.findOne({
			relations: {
				host: true,
			},
			where: {
				title
			}
		});
		if (!room) {
			return null;
		}
		return room;
	}

	async findOneById(id: number): Promise<Chat> {
		const room: Chat = await this.findOne({
			relations: {
				host: true,
			},
			where: {
				id
			}
		});
		if (!room) {
			return null;
		}
		return room;
	}

	async deleteRoom(title: string): Promise<void> {
		try {
			await this.delete({
				title: title
			});
		} catch (error) {
			throw new InternalServerErrorException();
		}
	}

	async succedingHost(chat: Chat, user: User): Promise<void> {
		chat.host = user;
		await this.save(chat);
	}
}
