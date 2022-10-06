import { Injectable, Logger } from '@nestjs/common';
import { ChatRepository } from './chat.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatUserRepository } from './chatuser.repository';
import { Equal } from 'typeorm';
import { ChatUserDefaultDto } from './dto/chatuser-default.dto';
import { ChatDto } from './dto/chat.dto';
import { ChatListDto } from './dto/chat.list.dto';

@Injectable()
export class ChatService {
	private logger = new Logger('ChatService');

	constructor(
		@InjectRepository(ChatRepository)
		private chatRepository: ChatRepository,
		private chatUserRepository: ChatUserRepository,
	) {}

	async getChatList(): Promise<ChatListDto[]> {
		const chatroom = await this.chatRepository.find({});
		const roomList: ChatListDto[] = [];
		chatroom.forEach((e) => {
			const user = new ChatDto();
			user.id = e.id;
			user.title = e.title;
			user.password = e.password;
			user.is_private = e.is_private;
			roomList.push(user);
		})
		return roomList;
	}

	async getRoomUserList(path: string): Promise<ChatUserDefaultDto[]> {
		const room = await this.chatRepository.findOneByRoomname(path);
		const roomuser = await this.chatUserRepository.find({
			relations: {
				user_id: true,
				chat_id: true,
			},
			where: {
				chat_id: {id: Equal(room.id)},
			}
		});
		const roomUserList: ChatUserDefaultDto[] = [];
		roomuser.forEach((e) => {
			const user = new ChatUserDefaultDto(e);
			user.id = e.user_id.id;
			user.nickname = e.user_id.nickname;
			user.avatar = e.user_id.avatar;
			user.is_muted = e.is_muted;
			if (room.host.id === e.user_id.id) {
				user.is_host = true;
			} else {
				user.is_host = false;
			}
			roomUserList.push(user);
		});
		return roomUserList;
	}
}
