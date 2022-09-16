import { Body, Controller, Get, Req } from '@nestjs/common';
import { UserLoginDto } from 'src/user/dto/user-login.dto';
import { GetUser } from 'src/user/get.user.decorator';
import { User } from 'src/user/user.entity';
import { FriendDto } from './dto/friend.dto';
import { FriendService } from './friend.service';

@Controller('friend')
export class FriendController {
	constructor (private friendService: FriendService) {}
	
	@Get()
	async getFriendList(@Req() req, @Body() userDto:UserLoginDto): Promise<FriendDto[]> {
		// const { id, nickname, avatar } = req.user;
		const intraid = userDto.intra_id;
		return await this.friendService.getFriendList(intraid);
	}	
}
