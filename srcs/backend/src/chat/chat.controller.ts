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

	@Get('/find/intra/:target')
	async getWhereAreYouByIntraId(@Param('target') target: string): Promise<Chat> {
		const room = await this.chatService.getWhereAreYouByIntraId(target);
		return room;
	}

	@Patch('/mute/:roomid/:targetname')
	async muteUser(@Param('roomid') roomid: string, @Param('targetname') targetname: string): Promise<void> {
		await this.chatService.muteUser(roomid ,targetname);
	}

	@Patch('/unmute/:roomid/:targetname')
	async unMuteUser(@Param('roomid') roomid: string, @Param('targetname') targetname: string): Promise<void> {
		await this.chatService.unMuteUser(roomid ,targetname);
	}

	@Patch('/host/:roomid/:targetname')
	async moveHostUser(@Param('roomid') roomid: string, @Param('targetname') targetname: string): Promise<void> {
		await this.chatService.moveHostUser(roomid, targetname);
	}

	@Patch('/addadmin/:roomid/:targetname')
	async addAdminUser(@Param('roomid') roomid: string, @Param('targetname') targetname: string): Promise<void> {
		await this.chatService.addAdminUser(roomid, targetname);
	}

	@Patch('/removeadmin/:roomid/:targetname')
	async removeAdminUser(@Param('roomid') roomid: string, @Param('targetname') targetname: string): Promise<void> {
		await this.chatService.removeAdminUser(roomid, targetname);
	}

}
