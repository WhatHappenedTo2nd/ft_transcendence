import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { UserLoginDto } from 'src/user/dto/user-login.dto';
import { UserRepository } from 'src/user/user.repository';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

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
	@UseGuards(AuthGuard('42'))
	async ftCallback(@Req() req, @Res() res: Response): Promise<void> {
		// request로 user의 intra_id와 avatar 받아옴
		const { intra_id, avatar } = req.user;
		// 디비에서 intra_id로 해당 유저가 있는지 찾음
		const user = await this.userRepository.findOne({ where: { intra_id } });
		// 유저가 디비에 없으면 생성함
		if (!user) {
			// dto로 데이터 체크
			const userLoginDto: UserLoginDto = { intra_id, avatar };
			// 데이터를 createUser 함수로 보내서 디비에 저장하게 함
			await this.userRepository.createUser(userLoginDto);
		}
		// 토큰에 넣어줄 정보. intra_id만 넣어줌
		const payload = { intra_id };
		// 토큰 생성
		const accessToken = await this.jwtService.sign(payload);
		// accessToken을 프론트로 넘겨줘야 함(유저가 로컬 스토리지에 가지고 있게)
		res.cookie('token', accessToken);
		res.status(302).redirect('http://localhost:3001/choice');
	}

}
