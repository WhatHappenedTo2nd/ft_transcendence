import { BadRequestException, InternalServerErrorException } from "@nestjs/common";
import { Equal, In, Repository } from "typeorm";
import { CustomRepository } from "../typeorm-ex/typeorm-ex.decorator";
import { User } from "../user/user.entity";
import { Friend } from "./friend.entity";
import { FriendDto, Status } from "./dto/friend.dto";

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
		}
		const result = await this.findRow(requester, reciver);
		if (result !== null) {
			// requerster가 reciver를 차단했을 경우
			if (result.block === true) {
				throw new BadRequestException(['차단한 유저에게는 친구요청을 할 수 없습니다.'])
			}
			// requester와 reciver가 이미 친구인 경우
			if (result.status === true) {
				throw new BadRequestException(['이미 친구입니다.'])
			}
		}
		const friend: Friend = this.create({
			user_id: requester,
			another_id: reciver,
			status: true,
		});
		try {
			await this.save(friend);
		} catch (error) {
			throw new InternalServerErrorException();
		}
	}

	async removeFriend(requerster: User, reciver: User): Promise<void> {
		const result = await this.findRow(requerster, reciver);

		if (result.block) {
			result.status = false;
			try {
				this.save(result);
			} catch (error) {
				throw new InternalServerErrorException();
			}
		} else {
			try {
				await this.delete({
					user_id: {id: Equal(requerster.id)},
					another_id: {id: Equal(reciver.id)},
					status: true,
					block: false,
				});
			} catch (error) {
				throw new InternalServerErrorException();
			}
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
			} else if ( // 친구라서 테이블에 데이터가 남아있어야하는 경우
				result.status === true
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
						status: false,
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
				status: true,
			},
		});
		const friendList: FriendDto[] = [];
		result.forEach((e) => {
			if (e.user_id.id === user.id) {
				const friend = new FriendDto;
				friend.id = e.another_id.id;
				friend.nickname = e.another_id.nickname;
				friend.avatar = e.another_id.avatar;
				friend.isblock = e.block;
				if (e.another_id.now_playing)
					friend.status = Status.PLAYING;
				else if (e.another_id.is_online)
					friend.status = Status.ONLINE;
				else
					friend.status = Status.OFFLINE;
				friendList.push(friend);
			}});
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
				const block = new FriendDto;
				block.id = e.another_id.id;
				block.nickname = e.another_id.nickname;
				block.avatar = e.another_id.avatar;
				block.isblock = e.block;
				if (e.another_id.now_playing)
					block.status = Status.PLAYING;
				else if (e.another_id.is_online)
					block.status = Status.ONLINE;
				else
					block.status = Status.OFFLINE;
				blockList.push(block);
			}
		});
		return blockList;
	}
}
