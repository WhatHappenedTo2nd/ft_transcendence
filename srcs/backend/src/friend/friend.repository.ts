import { BadRequestException, ConflictException, InternalServerErrorException } from "@nestjs/common";
import { Equal, Repository } from "typeorm";
import { FriendStatus } from "./friendStatus";
import { CustomRepository } from "../typeorm-ex/typeorm-ex.decorator";
import { User } from "../user/user.entity";
import { Friend } from "./friend.entity";
import { FriendDto } from "./dto/friend.dto";

/**
 * 친구 & 차단(block) 관련 데이터를 저장하기 위한 Repository 클래스
 */
@CustomRepository(Friend)
export class FriendRepository extends Repository<Friend> {
	// requester가 reciver에게 친구요청
	async createFriend(requester: User, reciver: User): Promise<void> {
		const check = await this.findRow(reciver, requester);
		if (check !== null) {
			// reciver가 requester를 차단했을 경우
			if (check.block === true) {
				throw new BadRequestException(['친구 요청이 실패하였습니다.']);
			}
			// reciver가 이미 requester에게 친구 신청을 보낸 경우
			if (check.status === FriendStatus.WAITING) { 
				throw new ConflictException(['상대방이 이미 친구 요청을 보냈습니다.'])
			}
		}
		const result = await this.findRow(requester, reciver);
		if (result !== null) {
			// requerster가 reciver를 차단했을 경우
			if (result.block === true) {
				throw new BadRequestException(['차단한 유저에게는 친구요청을 할 수 없습니다.'])
			}
			// requester와 reciver가 이미 친구인 경우
			if (result.status === FriendStatus.FRIEND) {
				throw new BadRequestException(['이미 친구입니다.'])
			}
			// requester가 reciver에게 이미 친구 신청을 보낸 경우 
			else if (result.status === FriendStatus.WAITING) {
				throw new ConflictException(['이미 친구 요청을 보냈습니다.'])
			}
		}
		const friend: Friend = this.create({
			user_id: requester,
			another_id: reciver,
			status: FriendStatus.WAITING,
		});
		try {
			await this.save(friend);
		} catch (error) {
			throw new InternalServerErrorException();
		}
	}

	// 친구 요청을 수락할 때
	async acceptFriend(requester: User, reciver: User): Promise<void> {
		const update = await this.findRow(requester, reciver);
		const create = await this.findRow(reciver, requester);

		if (update.status !== FriendStatus.WAITING) {
			throw new BadRequestException(['요청이 오지 않았습니다.'])
		}
		if (create !== null && create.block === true) {
			throw new BadRequestException(['차단한 유저의 친구 요청을 수락하셨습니다.'])
		}
		update.status = FriendStatus.FRIEND;
		try {
			await this.save(update);
		} catch (error) {
			throw new InternalServerErrorException();
		}
		const friend: Friend = this.create({
			user_id: reciver,
			another_id: requester,
			status: FriendStatus.FRIEND,
		});
		try {
			await this.save(friend);
		} catch (error) {
			throw new InternalServerErrorException();
		}
	}

	// 친구 요청을 거부할 때
	async rejectFriend(requerster: User, reciver: User): Promise<void> {
		const reject = await this.delete({
			user_id: {id : Equal(requerster.id)},
			another_id: {id : Equal(reciver.id)},
			status: FriendStatus.WAITING,
		});
		if (reject.affected === 0) {
			throw new BadRequestException(['유효한 요청이 아닙니다.'])
		}
	}

	//requester가 reciver를 차단할 때 사용
	async blockUser(requerster: User, reciver: User): Promise<void> {
		const result = await this.findRow(requerster, reciver);

		// 이미 관계성이 있는 경우 (이미 차단 or 친구) 
		if (result !== null) {
			if (result.block === true) {
				throw new BadRequestException(['이미 차단한 유저입니다.']);
			}
			// false 였던 block값을 true로 바꿔준다.
			result.block = true;
			try {
				this.save(result);
			} catch (error) {
				throw new InternalServerErrorException();
			}
		}
		// 관계성이 아예 없는 경우 -> DB에 새로 만들어야 함
		else {
			const block = this.create({
				user_id: requerster,
				another_id: reciver,
				block: true,
			});
			try {
				await this.save(block);
			} catch (error) {
				throw new InternalServerErrorException();
			}
		}
	}

	async unBlockUser(requerster: User, reciver: User): Promise<void> {
		const result = await this.findRow(requerster, reciver);

		if (result !== null) {
			if (result.block === false) {
				throw new BadRequestException(['차단하지 않은 유저입니다.']);
			} else if ( // 친구이거나 친구신청을 하는 중에 차단했거나 해서 데이터가 남아있어야하는 경우
				result.status === FriendStatus.FRIEND ||
				result.status === FriendStatus.WAITING
			){
				result.block = false;
				try {
					this.save(result);
				} catch (error) {
					throw new InternalServerErrorException();
				}
			} else {
				// 친구이지도 않아서 리스트에 남기지 않아도 될 경우
				try {
					await this.delete({
						user_id: {id: Equal(requerster.id)},
						another_id: {id: Equal(reciver.id)},
						status: FriendStatus.NONE,
						block: true,
					});
				} catch (error) {
					throw new InternalServerErrorException();
				}
			}
		} else {
			throw new BadRequestException(['차단하지 않은 유저입니다.']);
		}
	}

	async findRow(requester: User, reciver: User): Promise<Friend> {
		const result = await this.findOne({
			relations: {
				user_id: true,
				another_id: true,
			},
			where: {
				user_id: {id: Equal(requester.id)},
				another_id: {id: Equal(reciver.id)},				
			},
		})
		return result;
	}

	async FriendList(user: User): Promise<FriendDto[]> {
		const result = await this.find({
			relations: {
				user_id: true,
				another_id: true,
			},
			where: {
				user_id: {id: Equal(user.id)},
				status: FriendStatus.FRIEND,
			},
		});
		const friendList: FriendDto[] = [];
		result.forEach((e) => {
			if (e.user_id.id === user.id) {
				friendList.push({
					id: e.another_id.id,
					nickname: e.another_id.nickname,
					avatar: e.another_id.avatar,
					isblock: e.block,
				});
			}
		});
		return friendList;
	}

	async BlockList(user: User): Promise<FriendDto[]> {
		const block = await this.find({
			relations: {
				user_id: true,
				another_id: true,
			},
			where: {
				user_id: {id: Equal(user.id)},
				block: true,
			},
		});
		const blockList: FriendDto[] = [];
		block.forEach((e) => {
			if (e.user_id.id === user.id) {
				blockList.push({
					id: e.another_id.id,
					nickname: e.another_id.nickname,
					avatar: e.another_id.avatar,
					isblock: e.block,
				});
			}
		});
		return blockList;
	}
}
