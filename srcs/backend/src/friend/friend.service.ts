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
	}

	async removeFriend(user: User, nickname: string): Promise<void> {
		if (user.nickname === nickname) {
			throw new BadRequestException(
				'자기 자신을 친구리스트에서 삭제할 수 없습니다.',
			);
		}
		const requester = await this.userService.getUserByNickname(nickname);
		await this.friendRepository.removeFriend(user, requester);
	}

	async blockUser(user: User, targetName: string): Promise<void> {
		if (user.nickname === targetName) {
			throw new BadRequestException(
				'자신을 차단할 수 없습니다.'
			);
		}
		const blocked = await this.userService.getUserByNickname(targetName);
		await this.friendRepository.blockUser(user, blocked);
	}

	async unblockUser(user: User, targetName: string): Promise<void> {
		const unblocked = await this.userService.getUserByNickname(targetName);
		await this.friendRepository.unBlockUser(user, unblocked);
	}

	async getFriendId(user: User): Promise<number[]> {
		const friend = await this.getFriendList(user);
		const ret: number[] = [];

		friend.map((f) => {
			ret.push(f.id);
		})
		return ret;
	}
}
