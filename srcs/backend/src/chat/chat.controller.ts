import { UseGuards, Controller, Get, Logger, Param } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { ChatDto } from './dto/chat.dto';
import { ChatService } from './chat.service';
import { ApiTags } from '@nestjs/swagger';
import { ChatUserDefaultDto } from './dto/chatuser-default.dto';
import { ChatListDto } from './dto/chat.list.dto';

@ApiTags('chat')
@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
	private logger = new Logger('ChatController');
	constructor (private chatService: ChatService) {}

	@Get()
	async getChatList(): Promise<ChatListDto[]> {
		const chatroom = await this.chatService.getChatList();
		return chatroom;
	}

	@Get(':path')
	async getRoomUserList(@Param('path') path: string): Promise<ChatUserDefaultDto[]> {
		const roomuser = await this.chatService.getRoomUserList(path);
		return roomuser;
	}
}
