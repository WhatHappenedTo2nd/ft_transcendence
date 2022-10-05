import { Injectable, Logger } from '@nestjs/common';
import { Chat } from 'src/chat/chat.entity';
import { ChatRepository } from './chat.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatUserRepository } from './chatuser.repository';
import { Equal } from 'typeorm';
import { UserDefaultDto } from 'src/user/dto/user-default.dto';

@Injectable()
export class ChatService {
	private logger = new Logger('ChatService');

	constructor(
		@InjectRepository(ChatRepository)
		private chatRepository: ChatRepository,
		private chatUserRepository: ChatUserRepository,
	) {}

	async getChatList(): Promise<Chat[]> {
		const chatroom = await this.chatRepository.find({});
		return chatroom;
	}

	async getRoomUserList(path: string): Promise<UserDefaultDto[]> {
		const room = await this.chatRepository.findOne({where: {
			title: path
		}});
		const roomuser = await this.chatUserRepository.find({
			relations: {
				user_id: true,
				chat_id: true,
			},
			where: {
				chat_id: {id: Equal(room.id)},
			}
		});
		const roomUserList: UserDefaultDto[] = [];
		roomuser.forEach((e) => {
			const user = new UserDefaultDto;
			user.id = e.user_id.id;
			user.nickname = e.user_id.nickname;
			user.avatar = e.user_id.avatar;
			roomUserList.push(user);
		});
		return roomUserList;
	}
}
