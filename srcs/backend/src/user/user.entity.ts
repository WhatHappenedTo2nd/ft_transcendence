import { BaseEntity, Column, Entity, JoinColumn, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
@Unique(['intra_id', 'nickname', 'email'])
export class User extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	intra_id: string;

	@Column({ type: "varchar", length: 20 })
	nickname: string;
	
	@Column()
	avatar: string;
	
	@Column({ default: false })
	is_online: boolean;
	
	@Column({ default: false })
	now_playing: boolean;
	
	@Column({ default: "" })
	email: string;
}

@Entity()
export class Block extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;
	
	@JoinColumn()
	blocker: User;
	
	@JoinColumn()
	blocked: User;
}

@Entity()
export class Friend extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@JoinColumn()
	user_id: User;

	@JoinColumn()
	friend_id: User;
}

@Entity()
export class History extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@JoinColumn()
	user_a: User;

	@JoinColumn()
	user_b: User;

	@Column({ default: 0 })
	score_a: number;

	@Column({ default: 0 })
	score_b: number;
}
