import { IsNumber } from "class-validator";

/**
 * 유저의 아이디 정보만 가지고 있으면 됨.
 */
export class UserIdDto {
	@IsNumber()
	id: number;
}