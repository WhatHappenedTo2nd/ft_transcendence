import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { Repository } from "typeorm";
import { UserLoginDto } from "./dto/user-login.dto";
import { CustomRepository } from "../typeorm-ex/typeorm-ex.decorator";
import { User } from "./user.entity";

/**
 * 유저 관련 데이터를 저장 및 관리하기 위한 Repository 클래스
 */
@CustomRepository(User)
export class UserRepository extends Repository<User> {
	/**
	 * 유저가 처음 로그인 할 때 유저 데이터 저장
	 * @param userLoginDto 로그인에 필요한 데이터 객체
	 */
	async createUser(userLoginDto: UserLoginDto): Promise<void> {
		const { intra_id, avatar } = userLoginDto;
		const user = this.create({ intra_id, nickname: intra_id, avatar });
		
		try {
			await this.save(user);
		} catch (error) {
			if (error.code == '23505') {
				throw new ConflictException('Existing nickname');
			} else {
				throw new InternalServerErrorException();
			}
		}
	}
}
