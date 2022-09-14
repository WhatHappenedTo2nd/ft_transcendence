//유저 전체 리스트
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { User} from './user.entity'

@Injectable()
export class UserService {
	private logger = new Logger('UserService');

	constructor(
		@InjectRepository(UserRepository)
		private userRepository: UserRepository,
	) {}

	async getUserList(): Promise<User[]> {
		const users = await this.userRepository.find({});
		return users;
	}

	async getUserById(id: number): Promise<User> {
		const user = await this.userRepository.findOne({where: {id}});
		if (!user) {
			throw new NotFoundException(`해당 유저를 찾을 수 없습니다`)
		}
		return user;
	}

	// async updateUserNickname(id: number, nickname: string): Promise<User> {
	// 	const user = await this.getUserById(id);
	// 	if (!user) {
	// 		throw new BadRequestException(`해당 유저를 찾을 수 없습니다.`)
	// 	}
	// 	if (!nickname) {
	// 		throw new BadRequestException(`변경된 내용이 없습니다.`)
	// 	}
	// 	// if (nickname)

	// 	// user.nickname = 
	// }
}
