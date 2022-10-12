import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "src/user/user.entity";

@Entity()
export class Friend extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User, (user) => user.id)
	user_id: User;

	@ManyToOne(() => User, (user) => user.id)
	another_id: User;

	@Column({default: false})
	status: boolean;

	@Column({default: false})
	block: boolean;
}