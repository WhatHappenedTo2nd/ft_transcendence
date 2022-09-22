import { BaseEntity, Column, Entity, OneToOne, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "src/user/user.entity";

/**
 * Chat 테이블. 채팅에 필요한 정보를 저장함.
 */
@Entity()
export class Chat extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	// 채팅방 제목
	@Column({ type: "varchar", length: 20 })
	title: string;

	// 비밀채팅방의 비밀번호
	@Column({ type: "varchar", length: 20, default: "" })
	password: string;

	// 비밀방인지 여부
	@Column({ default: false })
	is_private: boolean;

	// 채팅방 소유자. 채팅방을 만든 사람.
	@OneToOne(() => User, (user) => user.id)
	host: User;

	// 이 채팅방에서 게임이 진행되고 있는지 여부
	@Column({ default: false })
	now_playing: boolean;
}

/**
 * 어떤 채팅방에 어떤 유저가 들어가있는지 확인하기 위한 테이블
 */
@Entity()
export class ChatUser extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	// 채팅방 객체
	@ManyToOne(() => Chat, (chat) => chat.id)
	chat_id: Chat;

	// 유저 객체
	@ManyToOne(() => User, (user) => user.id)
	user_id: User;

	// 음소거된 유저인지 여부
	@Column({ default: false })
	is_muted: boolean;
}
