import { UseGuards, Controller, Get, Logger, Param, Patch } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { ChatService } from './chat.service';
import { ApiTags } from '@nestjs/swagger';
import { ChatUserDefaultDto } from './dto/chatuser-default.dto';
import { ChatListDto } from './dto/chat.list.dto';
import { Chat } from './chat.entity';

@ApiTags('chat')
@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
	private logger = new Logger('ChatController');
	constructor ( private chatService: ChatService ) {}

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

	@Get('/find/:target')
	async getWhereAreYou(@Param('target') target: string): Promise<Chat> {
		const room = await this.chatService.getWhereAreYou(target);
		return room;
	}

	@Patch('/mute/:roomname/:targetname')
	async muteUser(@Param('roomname') roomname: string, @Param('targetname') targetname: string): Promise<void> {
		await this.chatService.muteUser(roomname ,targetname);
	}

	@Patch('/unmute/:roomname/:targetname')
	async unMuteUser(@Param('roomname') roomname: string, @Param('targetname') targetname: string): Promise<void> {
		await this.chatService.unMuteUser(roomname ,targetname);
	}

	@Patch('/host/:roomname/:targetname')
	async moveHostUser(@Param('roomname') roomname: string, @Param('targetname') targetname: string): Promise<void> {
		await this.chatService.moveHostUser(roomname ,targetname);
	}

}
