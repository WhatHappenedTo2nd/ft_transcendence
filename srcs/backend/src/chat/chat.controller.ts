import { UseGuards, Body, Controller, Get, Logger } from '@nestjs/common';
import { GetUser } from 'src/user/get.user.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { User } from 'src/user/user.entity';
import { ChatDto } from './dto/chat.dto';
import { ChatService } from './chat.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('chat')
@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
	private logger = new Logger('ChatController');
	constructor (private chatService: ChatService) {}

	@Get()
	async getChatList(): Promise<ChatDto[]> {
		const chatroom = await this.chatService.getChatList();
		return chatroom;
	}
}
