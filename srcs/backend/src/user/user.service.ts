import { join } from 'path';
import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { User } from './user.entity'
import { ConflictException } from '@nestjs/common';
import { UserDefaultDto } from './dto/user-default.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { Multer } from 'multer';
import { randomString } from '../profile/tfaCodeMaker';

@Injectable()
export class UserService {
	private logger = new Logger('UserService');

	constructor(
		@InjectRepository(UserRepository)
		private userRepository: UserRepository,
		private mailerService: MailerService,
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

	/* 
	* 유저가 입력한 이메일로 2차인증 코드 발송
	* @param id
	* @param email
	*/
	async sendEmail(id: number, email: string): Promise<User> {
		const user = await this.getUserById(id);
		if (!user)
			throw new BadRequestException('존재하지 않는 유저입니다.');

			user.email = email;
			const randomNumber: string = randomString(4, '#');
			user.tfaCode = randomNumber;

			this.mailerService
				.sendMail({
					to: user.email,
					from: 'whathappenedto2nd@gmail.com',
					subject: '[2기무슨일이고] 2차 인증 코드입니다.',
					html: `당신의 코드는 <b>${randomNumber}</b> 입니다.`,
				})
				.then(async (e) => {
					await this.userRepository.save(user)
				})
				.catch((e) => {
					throw new InternalServerErrorException(`Internal Server error in sending tfa code email`);
				});
		return user;
	}

	/* 
	* 유저가 입력한 2차인증 코드 확인
	* 맞으면 tfaAuthorized 테이블이 true로 변함
	* @param id
	* @param tfaCode
	*/
	async checkTFACode(id: number, tfaCode: string): Promise<User> {
		const user = await this.getUserById(id);
		console.log(tfaCode);
		console.log(user.tfaCode);
		if (tfaCode != user.tfaCode)
			throw new ConflictException('인증 코드를 다시 확인해주세요.')
		if (tfaCode == user.tfaCode)
			user.tfaAuthorized = true;
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
