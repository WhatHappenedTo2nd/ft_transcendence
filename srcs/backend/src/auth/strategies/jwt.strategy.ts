import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserRepository } from "src/user/user.repository";
import { User } from "src/user/user.entity";
import * as config from 'config';

const jwtConfig = config.get('jwt');

/**
 * 토큰 생성을 위한 JWT
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private userRepository: UserRepository
	) {
		super({
			secretOrKey: jwtConfig.secret,
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
		})
	}

	async validate(payload) {
		const { intra_id } = payload;
		const user: User = await this.userRepository.findOne({ where: { intra_id } });

		if (!user) {
			throw new UnauthorizedException();
		}
		return user;
	}
}