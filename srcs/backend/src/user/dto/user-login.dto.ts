import { IsString } from "class-validator";

/**
 * 유저가 처음 로그인할 때 필요한 데이터 객체 dto
 */
export class UserLoginDto {
	@IsString()
	intra_id: string;

	@IsString()
	avatar: string;
}
