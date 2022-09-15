import { Controller, Get, Param, UseGuards, Logger, Post, Req, Patch } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
// @UseGuards(AuthGuard())
export class UserController {
	private logger = new Logger('UserController');
	constructor(private userService: UserService) {}

	@Get()
	async getUserList(): Promise<User[]> {
		const users = await this.userService.getUserList();
		return users;
	}

	@Get('/:id')
	getUserById(@Param('id') id:number) {
		return this.userService.getUserById(id);
	}
	// @Get()
	// async getFriendList(): Promise<Friend[]> {
	// 	const friends = await this.userService.getFriendList();
	// 	return friends;
	// }

	@Patch('/:id/editProfile')
	UpdateUserNickname(id: number, nickname:string|undefined): Promise<User> {
		console.log(nickname);
		return this.userService.updateUserNickname(id, nickname);
	}
	// async UpdateUserNickname(@Req() req:any): Promise<Object> {
	// 	const nickname = req.body.nickname;

	// 	const user = await this.getUserById(req);
	// 	return this.userService.updateUserNickname(user.id, nickname);
	// }
}
