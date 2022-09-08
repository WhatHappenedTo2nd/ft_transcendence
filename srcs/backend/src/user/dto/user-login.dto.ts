import { IsString, Matches, MaxLength, MinLength } from "class-validator";

/**
 * 유저가 로그인할 때 필요한 데이터 객체 dto
 */
export class UserLoginDto {
	@IsString()
	intra_id: string;

	// @IsString()
	// @MinLength(4)
	// @MaxLength(20)
	// @Matches(/^[a-zA-Z0-9]*$/, {
	// 	message: 'password only accepts english and number'
	// })
	// nickname: string;

	@IsString()
	avatar: string;
}
