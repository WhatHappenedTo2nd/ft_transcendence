import { UseGuards, Controller, Get, Logger, Param } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { ChatDto } from './dto/chat.dto';
import { ChatService } from './chat.service';
import { ApiTags } from '@nestjs/swagger';
import { UserDefaultDto } from 'src/user/dto/user-default.dto';

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

	@Get(':path')
	async getRoomUserList(@Param('path') path: string): Promise<UserDefaultDto[]> {
		const roomuser = await this.chatService.getRoomUserList(path);
		return roomuser;
	}
}
