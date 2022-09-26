import { multerOptions } from '../profile/multerOption';
import { Controller, Get, Param, UseGuards, Logger, Req, Body, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserDefaultDto } from './dto/user-default.dto';
import { GetUser } from './get.user.decorator';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@ApiTags('user')
@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
	private logger = new Logger('UserController');
	constructor(private userService: UserService) {}


	/* 
	*  로그인한 모든 유저의 정보를 리턴
	*/
	@Get()
	async getUserList(): Promise<User[]> {
		const users = await this.userService.getUserList();
		return users;
	}

	/* 
	*  유저 본인의 정보를 리턴
	*/
	@Get('/me')
	async getMe(@GetUser() user: User): Promise<UserDefaultDto> {
		return this.userService.infoUser(user);
	}

	/* 
	*  유저와 친구인 유저를 제외한 온라인 유저 정보를 리턴
	*/
	@Get('/online')
	async getUserwithoutFriend(@GetUser() user: User): Promise<User[]> {
		const users = await this.userService.getUserwithoutFriend(user);
		return users;
	}

	/* 
	*  프로필 사진 저장, 닉네임 저장
	*  multer를 이용해 multipart/form-data 로 넘어온 파일 관리
	*  사진 한 장이므로 uploadedfile() 사용
	*/
	@Post('/me')
	@UseInterceptors(FileInterceptor('file', multerOptions))
	async updateUserProfile(@Req() req, @UploadedFile() file) {
		
		const nickname = req.body.nickname;

		const user = await this.getMe(req.user);
		return this.userService.updateUserProfile(user.id, file, nickname);
	}
}
