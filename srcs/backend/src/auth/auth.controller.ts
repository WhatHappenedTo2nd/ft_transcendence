import { Controller, Get, Redirect, Req, Res } from '@nestjs/common';
import { UserLoginDto } from 'src/user/dto/user-login.dto';
import { UserRepository } from 'src/user/user.repository';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import * as config from 'config';

const authConfig = config.get('auth');

/**
 * auth 경로 그룹
 * 42API로 유저 인증 혹은 2단계 인증 관련한 작업 처리
 */
@Controller('auth')
export class AuthController {
	constructor(
		private userRepository: UserRepository,
		private jwtService: JwtService
	) {}

	@Get('42')
	async ftCallback(@Req() req, @Res() res: Response): Promise<void> {
		const { intra_id, nickname, avatar } = req.user;
		const user = await this.userRepository.findOne({ where: { intra_id } });

		if (!user) {
			const userLoginDto: UserLoginDto = { intra_id, nickname, avatar };
			await this.userRepository.createUser(userLoginDto);
		}
		const payload = { intra_id }
		const accessToken = await this.jwtService.sign(payload);
		// accessToken을 프론트로 넘겨줘야 함(유저가 로컬 스토리지에 가지고 있게)
	}
}
