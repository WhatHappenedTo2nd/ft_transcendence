import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { UserLoginDto } from 'src/user/dto/user-login.dto';
import { UserRepository } from 'src/user/user.repository';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';

/**
 * auth 경로 그룹
 * 42API로 유저 인증 혹은 2단계 인증 관련한 작업 처리
 */
@Controller('auth')
export class AuthController {
	constructor(
		@InjectRepository(UserRepository)
		private userRepository: UserRepository,
		private jwtService: JwtService
	) {}

	/**
	 * 42API로 유저 인증하고 access token까지 생성해서 로그인 처리
	 * DB의 USER 테이블에 해당 intra_id의 유저가 없다면 새로 추가함
	 */
	@Get('42')
	@UseGuards(AuthGuard('42'))
	async ftCallback(@Req() req, @Res() res: Response): Promise<void> {
		// console.log(req.user);
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
		// accessToken을 cookie에 저장함
		res.cookie('token', accessToken);
		// 후에 프론트 choice 페이지로 redirect
		res.status(302).redirect('http://localhost:3000');
	}

}
