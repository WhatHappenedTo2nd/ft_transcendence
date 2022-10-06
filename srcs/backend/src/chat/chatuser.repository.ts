import { BadRequestException, InternalServerErrorException } from "@nestjs/common";
import { CustomRepository } from "src/typeorm-ex/typeorm-ex.decorator";
import { User } from "src/user/user.entity";
import { Equal, Repository } from "typeorm";
import { Chat } from "./chat.entity";
import { ChatUser } from "./chatuser.entity";

@CustomRepository(ChatUser)
export class ChatUserRepository extends Repository<ChatUser> {
	
	async addUser(room: Chat, user: User): Promise<void> {
		const check = await this.findRow(room, user);
		if (check !== null) {
			throw new BadRequestException();
		}
		const enter: ChatUser = this.create({
			user_id: user,
			chat_id: room,
			is_muted: false,
		});
		try {
			await this.insert(enter);
		} catch (error) {
			throw new InternalServerErrorException();
		}
	}

	async deleteUser(room: Chat, user: User): Promise<void> {
		try {
			await this.delete({
				user_id: {id: Equal(user.id)},
				chat_id: {id: Equal(room.id)},
			});
		} catch (error) {
			throw new InternalServerErrorException();
		}
	}

	async findRow(room: Chat, user: User): Promise<ChatUser> {
		const result = await this.findOne({
			relations: {
				user_id: true,
				chat_id: true,
			},
			where: {
				user_id: {id: Equal(user.id)},
				chat_id: {id: Equal(room.id)},				
			},
		})
		return result;
	}

	async findNextHost(room: Chat): Promise<User> {
		const newHost = await this.findOne({
			relations: {
				user_id: true,
				chat_id: true,
			},
			where: {
				chat_id: {id: Equal(room.id)}
			},
		});
		return newHost.user_id;
	}
}
