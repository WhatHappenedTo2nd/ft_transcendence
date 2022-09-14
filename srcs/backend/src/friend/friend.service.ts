import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendDto } from 'src/friend/dto/friend.dto';
import { FriendRepository } from './friend.repository';
import { User } from 'src/user/user.entity';

@Injectable()
export class FriendService {
	constructor(
		@InjectRepository(FriendRepository)
		private friendRepository: FriendRepository,
	) {}

	async getFriendList(user: string): Promise<FriendDto[]> {
		return await this.friendRepository.FriendList(user);
	}

	async getBlockList(user: User): Promise<FriendDto[]> {
		return await this.friendRepository.BlockList(user);
	}
}
