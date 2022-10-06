import { BaseEntity, Column, Entity, OneToOne, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from "typeorm";
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
	@JoinColumn()
	host: User;

	// 이 채팅방에서 게임이 진행되고 있는지 여부
	@Column({ default: false })
	now_playing: boolean;
}
