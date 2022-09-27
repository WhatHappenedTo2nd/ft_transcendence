import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendDto } from 'src/friend/dto/friend.dto';
import { FriendRepository } from './friend.repository';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class FriendService {
	constructor(
		@InjectRepository(FriendRepository)
		private friendRepository: FriendRepository,
		private userService: UserService,
	) {}

	async getFriendList(user: User): Promise<FriendDto[]> {
		return await this.friendRepository.FriendList(user);
	}

	async getBlockList(user: User): Promise<FriendDto[]> {
		return await this.friendRepository.BlockList(user);
	}

	async createFriend(user: User, nickname: string): Promise<void> {
		if (user.nickname === nickname) {
			throw new BadRequestException(
				'자기 자신에게 친구 요청을 보낼 수 없습니다.',
			);
		}
		const requester = await this.userService.getUserByNickname(nickname);
		await this.friendRepository.createFriend(user, requester);
		// 상대한테 알려주는 서비스가 필요하다!!!
	}
}
