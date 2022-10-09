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

	async findRowJustUser(user: User): Promise<ChatUser> {
		const result = await this.findOne({
			relations: {
				user_id: true,
				chat_id: true,
			},
			where: {
				user_id: {id: Equal(user.id)},			
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

	async isMutedUser(user: User): Promise<ChatUser> {
		const mutedUser = this.findOne({
			relations: {
				chat_id: true,
				user_id: true,
			},
			where: {
				user_id: {id: Equal(user.id)},
				is_muted: true,
			},
		});
		return mutedUser;
	}

	async findTargetUser(room: Chat, targetUser: User): Promise<ChatUser> {
		const result = this.findOne({
			relations: {
				chat_id: true,
				user_id: true,
			},
			where: {
				chat_id: {id: Equal(room.id)},
				user_id: {id: Equal(targetUser.id)},
			}
		});
		return result;
	}

	async muteUser(room: Chat, targetUser: User): Promise<void> {
		const muteUser = await this.findTargetUser(room, targetUser);
		if (muteUser !== null) {
			if (muteUser.is_muted === true) {
				throw new BadRequestException(['음소거 하지 않은 유저입니다.']);
			} else {
				muteUser.is_muted = true;
				try {
					this.save(muteUser);
				} catch (error) {
					throw new InternalServerErrorException();
				}
			}
		} else {
			throw new BadRequestException(['음소거 하지 않은 유저입니다.']);
		}
	}

	async unMuteUser(room: Chat, targetUser: User): Promise<void> {
		const unMuteUser = await this.findTargetUser(room, targetUser);
		if (unMuteUser !== null) {
			if (unMuteUser.is_muted === false) {
				throw new BadRequestException(['이미 음소거 된 유저입니다.']);
			} else {
				unMuteUser.is_muted = false;
				try {
					this.save(unMuteUser);
				} catch (error) {
					throw new InternalServerErrorException();
				}
			}
		} else {
			throw new BadRequestException(['이미 음소거 된 유저입니다.']);
		}
	}

	async getAllChatUsers(room: Chat): Promise<ChatUser[]> {
		const chatUsers = await this.find({
			relations: {
				chat_id: true,
				user_id: true,
			},
			where: {
				chat_id: {id: Equal(room.id)},
			},
		});
		return chatUsers;
	}
}
