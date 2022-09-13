import { User } from 'src/user/user.entity';
import { UserRepository } from 'src/user/user.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(UserRepository)
		private userRepository: UserRepository,
	){}

	//유저 전체 리스트
	async getUserList(): Promise<User[]> {
		const users = await this.userRepository.find({});
		return users;
	}

	async getUserById(id: number): Promise<User> {
		const user = await this.userRepository.findOne(id);
		if (!user) {
			throw new NotFoundException(`Can't find User id ${id}`)
		}
		return user;
	}
}
