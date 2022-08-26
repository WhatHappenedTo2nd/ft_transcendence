import { User } from "src/user/user.entity";
import { BaseEntity, Column, Entity, JoinColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Chat extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: "varchar", length: 20 })
	title: string;

	@Column({ type: "varchar", length: 20 })
	password: string;

	@Column()
	is_private: boolean;

	@JoinColumn()
	host: User;

	@Column()
	now_playing: boolean;
}

@Entity()
export class ChatUser extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@JoinColumn()
	chat_id: Chat;

	@JoinColumn()
	user_id: User;

	@Column()
	is_muted: boolean;
}
