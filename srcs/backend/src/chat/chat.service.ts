import { Injectable, Logger } from '@nestjs/common';
import { Chat } from 'src/chat/chat.entity';
import { ChatRepository } from './chat.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatDto } from './dto/chat.dto';

@Injectable()
export class ChatService {
	private logger = new Logger('ChatService');

	constructor(
		@InjectRepository(ChatRepository)
		private chatRepository: ChatRepository,
	) {}

	async getChatList(): Promise<Chat[]> {
		const chatroom = await this.chatRepository.find({});
		return chatroom;
	}
}
