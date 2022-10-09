import { IsString } from "class-validator";

/**
 * 유저 table과 같은 형식의 dto, User 객체 뽑아내는데 사용함
 */
export class UserDefaultDto {
	id: number;

	intra_id: string;

	nickname: string;

	avatar: string;

	is_online: boolean;

	now_playing: boolean;

	email: string;

	tfaCode: string;

	tfaAuthorized: boolean;

	wins: number;

	losses: number;

	ratio: string;

	socket_id: string;

	is_first: boolean;
}
