import { Controller, Get, Param, UseGuards, Logger, Req, Body, Post } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserDefaultDto } from './dto/user-default.dto';
import { GetUser } from './get.user.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('user')
@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
	private logger = new Logger('UserController');
	constructor(private userService: UserService) {}

	@Get()
	async getUserList(): Promise<User[]> {
		const users = await this.userService.getUserList();
		return users;
	}

	@Get('/me')
	async getMe(@GetUser() user: User): Promise<UserDefaultDto> {
		return this.userService.infoUser(user);
	}

	@Post('/me')
	async updateUserData(@Req() req: any): Promise<Object> {
		
		const nickname = req.body.nickname;

		const user = await this.getMe(req.user);
		return this.userService.updateUserNickname(user.id, nickname);
	}
}
