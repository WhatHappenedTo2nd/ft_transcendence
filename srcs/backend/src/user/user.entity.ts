import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";

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
export class History extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User, (user) => user.id)
	user_a: User;

	@ManyToOne(() => User, (user) => user.id)
	user_b: User;

	@Column({ default: 0 })
	score_a: number;

	@Column({ default: 0 })
	score_b: number;
}
