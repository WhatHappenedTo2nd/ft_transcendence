import { join } from 'path';
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { User } from './user.entity'
import { ConflictException } from '@nestjs/common';
import { UserDefaultDto } from './dto/user-default.dto';
import { Multer } from 'multer';

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

	async getUserwithoutFriend(): Promise<User[]> {
		const users = await this.userRepository.find({});
		
		return users;
	}

	//파라미터로 전달받은 Id와 일치하는 유저 리턴
	async getUserById(id: number): Promise<User> {
		const user = await this.userRepository.findOne({where: {id}});
		if (!user) {
			throw new NotFoundException(`해당 유저를 찾을 수 없습니다`)
		}
		if (!id)
			return ;
		return user;
	}

	/* 
	* 유저 닉네임, 아바타 변경
	* @param id
	* @param file
	*/
	async updateUserProfile(id: number, file: Express.Multer.File, nickname: string | undefined): Promise<User> {

		const user = await this.getUserById(id);
		const rule = /^[0-9a-zA-Z]+$/;
		if (!user) {
			throw new BadRequestException(`해당 유저를 찾을 수 없습니다.`)
		}
		if (!nickname && !file) {
			throw new BadRequestException(`변경된 내용이 없습니다.`)
		}
		if (file) {
			const server = 'http://localhost:9633';
			const photoUrl = server + join('/', file.path);
			user.avatar = photoUrl;
			await this.userRepository.save(user);
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
		}
		await this.userRepository.save(user);
		return user;
	}

	async infoUser(user: User, nickname?: string): Promise<UserDefaultDto> {
		if (nickname) {
			user = await (await this.userRepository.findByNickname(nickname));
		}
		return this.userRepository.infoUser(user);
	}

}
