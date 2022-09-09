import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy, VerifyCallback } from "passport-42";
import * as config from 'config';

const authConfig = config.get('auth');

/**
 * 42API 사용을 위함
 */
@Injectable()
export class FtStrategy extends PassportStrategy(Strategy, '42') {
	// super() 안의 값들은 42API 요청할 때 필요한 정보
	constructor() {
		super({
			clientID: authConfig.uid,
			clientSecret: authConfig.secret,
			callbackURL: authConfig.callbackURL
		});
	}

	// 여기서 return한 값들이 request의 user에 저장됨.
	async validate(
		accessToken: string,
		refreshToken: string,
		profile: Profile,
		cb: VerifyCallback,
	  ): Promise<VerifyCallback> {
		return cb(null, {
			intra_id: profile.username,
			nickname: profile.username,
			avatar: profile.photos[0].value,
			accessToken,
			refreshToken,
		});
	}
}
