import { multerOptions } from '../profile/multerOption';
import { Controller, Get, Param, Patch, UseGuards, Logger, Req, Body, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserDefaultDto } from './dto/user-default.dto';
import { GetUser } from './get.user.decorator';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { FriendService } from 'src/friend/friend.service';

@ApiTags('user')
@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
	private logger = new Logger('UserController');
	constructor(
		private userService: UserService,
		private friendService: FriendService) {}

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

	@Get('/online')
	async getOnlineUser(@GetUser() user: User): Promise<User[]> {
		const users = await this.userService.getUserList();
		const friend = await this.friendService.getFriendId(user);

		const newuser: User[] = [];
		users.forEach((u) => {
			if (!friend.includes(u.id)) {
				const newbi = new User;
				newbi.id = u.id;
				newbi.intra_id = u.intra_id;
				newbi.nickname = u.nickname;
				newbi.avatar = u.avatar;
				newbi.is_online = u.is_online;
				newbi.now_playing = u.now_playing;
				newbi.email = u.email;
				newbi.tfaCode = u.tfaCode;
				newbi.tfaAuthorized = u.tfaAuthorized;
				newbi.wins = u.wins;
				newbi.losses = u.losses;
				newbi.ratio = u.ratio;
				newuser.push(newbi);
			}
		})
		return newuser;
	}

	@Get('/profile/:nickname')
	async getOtherByNickname(@Param('nickname') nickname: string): Promise<User> {
		return this.userService.getUserByNickname(nickname);
	}

	@Get('/profile/:intra_id')
	async getOtherByIntraId(@Param('intra_id') intra_id: string): Promise<User> {
		return this.userService.getUserByIntraId(intra_id);
	}

	/*
	*  파라미터로 받은 닉네임과 일치하는 유저 정보 리턴
	*/
	@Post('/me/tfa')
	async tfaCheck(@Req() req) {
		const email = req.body.email;
		const user = await this.getMe(req.user);
		return this.userService.sendEmail(user.id, email);
	}

	@Patch('/me/cancleTFA')
	async cancleTFA(@Req() req) {
		const email = req.body.email;
		const tfaCode = req.body.tfaCode;
		const tfaAuthorized = req.body.tfaAuthorized;
		const user = await this.getMe(req.user);
		return this.userService.cancleTFA(user.id, email, tfaCode, tfaAuthorized);
	}

	/*
	** 유저가 올바른 코드를 입력했는지 확인
	*/
	@Post('/me/tfa:code')
	async checkTFACode(@Req() req) {
		const tfaCode = req.body.tfaCode;
		const user = await this.getMe(req.user);
		return this.userService.checkTFACode(user.id, tfaCode);
	}

	@Post('/me/signup')
	async signup(@Req() req) {
		const isFirst = req.body.is_first;
		const user = await this.getMe(req.user);
		return this.userService.signup(user.id, isFirst);
	}
}
