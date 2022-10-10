import { Injectable, Logger } from '@nestjs/common';
import { ChatRepository } from './chat.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatUserRepository } from './chatuser.repository';
import { Equal } from 'typeorm';
import { ChatUserDefaultDto } from './dto/chatuser-default.dto';
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
			if (room.host.id === e.user_id.id) {
				user.is_host = true;
			} else {
				user.is_host = false;
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

	/**
	 * 채팅방 내에서 날 블락한 사람 찾아서 그 목록 반환
	 * @param user 나
	 * @param room 내가 들어간 채팅방
	 * @returns 날 블락한 사람 목록
	 */
	async findWhoBlockedMe(user: User, room: Chat): Promise<User[]> {
		// ChatUser에서 특정 방에 있는 모든 유저를 가져옴
		const chatUsers = await this.chatUserRepository.getAllChatUsers(room);
		// 날 블락한 사람들 목록을 담음
		const blockerList: User[] = [];
		// forEach는 async await이 안 됨.
		for (let e of chatUsers) {
			// Friend 테이블에서 user_id가 채팅방에 있는 어떤 유저, another_id가 나인 row 찾음.
			const row = await this.friendRepository.findRow(e.user_id, user);
			// 그런 row가 있을 때, block이 true이면 e.user_id가 나를 블락한 것.
			if (row && row.block === true) {
				// 날 블락한 사람 찾아서 blockerList에 넣음.
				const blocker = await this.userRepository.findById(row.user_id.id);
				blockerList.push(blocker);
			}
		}
		return blockerList;
	}

	async getWhereAreYou(targetname: string): Promise<Chat> {
		const target: User = await this.userRepository.findByNickname(targetname);
		const targetroom: ChatUser = await this.chatUserRepository.findRowJustUser(target);
		return targetroom.chat_id;
	}
}
