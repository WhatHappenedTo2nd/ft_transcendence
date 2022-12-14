import { Injectable, Logger } from '@nestjs/common';
import { ChatRepository } from './chat.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatUserRepository } from './chatuser.repository';
import { Equal } from 'typeorm';
import { ChatUserDefaultDto, Role } from './dto/chatuser-default.dto';
import { ChatDto } from './dto/chat.dto';
import { ChatListDto } from './dto/chat.list.dto';
import { UserRepository } from 'src/user/user.repository';
import { User } from 'src/user/user.entity';
import { Chat } from './chat.entity';
import { FriendRepository } from 'src/friend/friend.repository';
import { ChatUser } from './chatuser.entity';

@Injectable()
export class ChatService {
	private logger = new Logger('ChatService');

	constructor(
		@InjectRepository(ChatRepository)
		private chatRepository: ChatRepository,
		private chatUserRepository: ChatUserRepository,
		private userRepository: UserRepository,
		private friendRepository: FriendRepository,
	) {}

	async getChatList(): Promise<ChatListDto[]> {
		const chatroom = await this.chatRepository.find({});
		const roomList: ChatListDto[] = [];
		chatroom.forEach((e) => {
			const user = new ChatDto();
			user.id = e.id;
			user.title = e.title;
			user.password = e.password;
			user.is_private = e.is_private;
			roomList.push(user);
		})
		return roomList;
	}

	async getRoomUserList(path: string): Promise<ChatUserDefaultDto[]> {
		const id: number = Number(path);
		const room = await this.chatRepository.findOneById(id);
		const roomuser = await this.chatUserRepository.find({
			relations: {
				user_id: true,
				chat_id: true,
			},
			where: {
				chat_id: {id: Equal(room.id)},
			}
		});
		const roomUserList: ChatUserDefaultDto[] = [];
		roomuser.forEach((e) => {
			const user = new ChatUserDefaultDto(e);
			user.id = e.user_id.id;
			user.nickname = e.user_id.nickname;
			user.avatar = e.user_id.avatar;
			user.is_muted = e.is_muted;
			user.now_playing = e.user_id.now_playing;
			if (room.host.id === e.user_id.id) {
				user.role = Role.HOST;
			} else if (e.is_admin) {
				user.role = Role.ADMIN;
			} else {
				user.role = Role.MEMBER;
			}
			roomUserList.push(user);
		});
		return roomUserList;
	}

	async kickUser(roomname: string, targetname: string): Promise<void> {
		const target: User = await this.userRepository.findByNickname(targetname);
		const room: Chat = await this.chatRepository.findOneByRoomname(roomname);

		await this.chatUserRepository.kickUser(room, target);
	}

	async muteUser(roomId: string, targetname: string): Promise<void> {
		const target: User = await this.userRepository.findByNickname(targetname);
		const room: Chat = await this.chatRepository.findOneById(Number(roomId));

		await this.chatUserRepository.muteUser(room, target);
	}

	async unMuteUser(roomId: string, targetname: string): Promise<void> {
		const target: User = await this.userRepository.findByNickname(targetname);
		const room: Chat = await this.chatRepository.findOneById(Number(roomId));

		await this.chatUserRepository.unMuteUser(room, target);
	}

	async moveHostUser(roomId: string, targetname: string): Promise<void> {
		const target: User = await this.userRepository.findByNickname(targetname);
		const room: Chat = await this.chatRepository.findOneById(Number(roomId));

		await this.chatRepository.succedingHost(room, target);
	}

	async addAdminUser(roomId: string, targetname: string): Promise<void> {
		const target: User = await this.userRepository.findByNickname(targetname);
		const room: Chat = await this.chatRepository.findOneById(Number(roomId));

		await this.chatUserRepository.addAdmin(room, target);
	}

	async removeAdminUser(roomId: string, targetname: string): Promise<void> {
		const target: User = await this.userRepository.findByNickname(targetname);
		const room: Chat = await this.chatRepository.findOneById(Number(roomId));

		await this.chatUserRepository.removeAdmin(room, target);
	}

	/**
	 * ????????? ????????? ??? ????????? ?????? ????????? ??? ?????? ??????
	 * @param user ???
	 * @param room ?????? ????????? ?????????
	 * @returns ??? ????????? ?????? ??????
	 */
	async findWhoBlockedMe(user: User, room: Chat): Promise<User[]> {
		// ChatUser?????? ?????? ?????? ?????? ?????? ????????? ?????????
		const chatUsers = await this.chatUserRepository.getAllChatUsers(room);
		// ??? ????????? ????????? ????????? ??????
		const blockerList: User[] = [];
		// forEach??? async await??? ??? ???.
		for (let e of chatUsers) {
			// Friend ??????????????? user_id??? ???????????? ?????? ?????? ??????, another_id??? ?????? row ??????.
			const row = await this.friendRepository.findRow(e.user_id, user);
			// ?????? row??? ?????? ???, block??? true?????? e.user_id??? ?????? ????????? ???.
			if (row && row.block === true) {
				// ??? ????????? ?????? ????????? blockerList??? ??????.
				const blocker = await this.userRepository.findById(row.user_id.id);
				blockerList.push(blocker);
			}
		}
		return blockerList;
	}

	async getWhereAreYou(targetname: string): Promise<Chat> {
		const target: User = await this.userRepository.findByNickname(targetname);
		const targetroom: ChatUser = await this.chatUserRepository.findRowJustUser(target);
		if (targetroom)
			return targetroom.chat_id;
		else {
			return null;
		}
	}

	async getWhereAreYouByIntraId(intra_id: string): Promise<Chat> {
		const target: User = await this.userRepository.findByIntraId(intra_id);
		const targetroom: ChatUser = await this.chatUserRepository.findRowJustUser(target);
		if (targetroom)
			return targetroom.chat_id;
		else {
			return null;
		}
	}

	async isBlockedMe(blockerList: User[], user: User): Promise<boolean> {
		for (let e of blockerList) {
			if (e.id === user.id) {
				return true;
			}
		}
		return false;
	}
}
