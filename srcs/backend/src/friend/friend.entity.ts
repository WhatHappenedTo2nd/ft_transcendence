import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "src/user/user.entity";
import { FriendStatus } from "./friendStatus";

@Entity()
export class Friend extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User, (user) => user.id)
	user_id: User;

	@ManyToOne(() => User, (user) => user.id)
	another_id: User;

	@Column({default: FriendStatus.NONE})
	status: FriendStatus;

	@Column({default: false})
	block: boolean;
}