import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "src/user/user.entity";
import { Chat } from "./chat.entity";

/**
 * Chat 테이블. 채팅에 필요한 정보를 저장함.
 */
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
 