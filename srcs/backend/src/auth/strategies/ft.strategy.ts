import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy, VerifyCallback } from "passport-42";
import * as config from 'config';

const authConfig = config.get('auth');

/**
 * 42API
 * 
 */
@Injectable()
export class FtStrategy extends PassportStrategy(Strategy, '42') {
	constructor() {
		super({
			clientID: authConfig.uid,
			clientSecret: authConfig.secret,
			callbackURL: authConfig.callbackURL
		});
	}

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
