import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { User } from './user.entity'
import { UserDefaultDto } from './dto/user-default.dto';

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

	async infoUser(user: User, nickname?: string): Promise<UserDefaultDto> {
		if (nickname) {
			user = await (await this.userRepository.findByNickname(nickname));
		}
		return this.userRepository.infoUser(user);
	}

}
