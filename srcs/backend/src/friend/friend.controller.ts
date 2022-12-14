import { UseGuards, Controller, Get, Logger, Post, Param, Patch } from '@nestjs/common';
import { GetUser } from 'src/user/get.user.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { User } from 'src/user/user.entity';
import { FriendDto } from './dto/friend.dto';
import { FriendService } from './friend.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('friend')
@Controller('friend')
@UseGuards(JwtAuthGuard)
export class FriendController {
	private logger = new Logger('FriendController');
	constructor (private friendService: FriendService) {}
	
	@Get('/friendlist')
	async getFriendList(@GetUser() user: User): Promise<FriendDto[]> {
		return await this.friendService.getFriendList(user);
	}

	@Get('/blocklist')
	async getBlockList(@GetUser() user: User): Promise<FriendDto[]> {
		return await this.friendService.getBlockList(user);
	}

	@Post('/request/:nickname')
	createFriend(
		@Param('nickname') nickname: string,
		@GetUser() user: User,
	): Promise<void> {
		return this.friendService.createFriend(user, nickname);
	}

	@Patch('/remove/:nickname')
	removeFriend(
		@Param('nickname') nickname: string,
		@GetUser() user: User,
	): Promise<void> {
		return this.friendService.removeFriend(user, nickname);
	}

	@Patch('/block/:nickname')
	blockUser(
		@Param('nickname') nickname: string,
		@GetUser() user: User,
	): Promise<void> {
		return this.friendService.blockUser(user, nickname);
	}

	@Patch('/unblock/:nickname')
	unblockUser(
		@Param('nickname') nickname: string,
		@GetUser() user: User,
	): Promise<void> {
		return this.friendService.unblockUser(user, nickname);
	}
}
