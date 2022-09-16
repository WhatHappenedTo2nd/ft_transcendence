import { Controller, Get, Param, UseGuards, Logger, Post, Req, Patch, Res, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from './user.entity';
import { UserService } from './user.service';
import { Cookies } from 'react-cookie';

export function getCookie(key: string): string {
	const cookies = new Cookies();
	console.log(cookies);

	return cookies.get(key);
}

@Controller('user')
// @UseGuards(AuthGuard)
export class UserController {
	private logger = new Logger('UserController');
	constructor(private userService: UserService) {}

	@Get('me')
	async getLoginUserData(@Req() req, @Body() body): Promise<any> {
		const intra = getCookie('intra_id');
		console.log(intra);
		// const intra_id = req.user.intra_id;
		// console.log(intra_id);
		// const user = await this.userService.getUserById(id);

		// const res = {
		// 	id: user.id,
		// 	intra_id: user.intra_id,
		// 	email: user.email,
		// 	nickname: user.nickname,
		// 	is_online: user.is_online,
		// 	now_playing: user.now_playing,
		// };
		// return res;
	}

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
