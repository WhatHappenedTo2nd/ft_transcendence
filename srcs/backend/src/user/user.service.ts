//유저 전체 서비스

import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { User} from './user.entity'
import { ConflictException } from '@nestjs/common';

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

	//파라미터로 전달받은 Id와 일치하는 유저 리턴
	async getUserById(id: number): Promise<User> {
		const user = await this.userRepository.findOne({where: {id}});
		if (!user) {
			throw new NotFoundException(`해당 유저를 찾을 수 없습니다`)
		}
		return user;
	}

	//유저 닉네임 변경
	async updateUserNickname(id: number, nickname: string | undefined): Promise<User> {
		const user = await this.getUserById(id);
		const rule = /^[0-9a-zA-Z]+$/;
		if (!user) {
			throw new BadRequestException(`해당 유저를 찾을 수 없습니다.`)
		}
		if (!nickname) {
			console.log(user.nickname);
			console.log(nickname);
			throw new BadRequestException(`변경된 내용이 없습니다.`)
		}
		if (nickname) {
			const isDuplicateNick = await this.userRepository.findOne({where: {nickname}});
			if (isDuplicateNick) {
				throw new ConflictException('이미 선택된 닉네임입니다.');
			} else if (!nickname.match(rule)) {
				throw new ConflictException('닉네임은 숫자와 영어 대소문자만 입력 가능합니다.');
			} else if (nickname.length > 20) {
				throw new ConflictException('닉네임은 20자 이내로 작성하세요.');
			}
			user.nickname = nickname;
			console.log(nickname);
		}
		await this.userRepository.save(user);
		return user;
	}
}
