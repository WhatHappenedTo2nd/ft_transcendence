import { BaseEntity, Column, Entity, JoinColumn, ManyToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Games } from "src/games/games.entity";
/**
 * User 테이블. 유저의 회원 정보를 저장함.
 */
@Entity()
@Unique(['intra_id', 'nickname', 'email'])
export class User extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	// 42서울에서 사용하는 인트라 아이디.
	// 나중에 닉네임이 바뀌어도 로그인 할 때 기존 유저인지 확인하기 위함.
	@Column({
		nullable: true,
	})
	intra_id: string;

	// 사이트에서 사용하는 닉네임.
	// 처음 로그인을 했을 때는 intra_id와 동일하게 설정됨.
	@Column({ nullable: true, type: "varchar", length: 20 })
	nickname: string;

	// 사용자 프로필 이미지.
	// 처음 로그인을 했을 때는 인트라 프로필 이미지와 동일하게 설정됨.
	@Column({
		nullable: true,
	})
	avatar: string;

	// 유저가 접속 중인지 여부
	@Column({ nullable: true, default: false })
	is_online: boolean;

	// 유저가 게임 중인지 여부
	@Column({ nullable: true, default: false })
	now_playing: boolean;

	// 2차 인증할 때 받는 이메일.
	// 이메일이 비어있으면 아직 2차 인증을 하지 않은 것임.
	@Column({ nullable : true })
	email: string ;

	@Column({nullable: true})
	tfaCode: string;

	@Column({ nullable: true, default: false })
	tfaAuthorized: boolean;

	/** games */
	@Column({
		nullable: true,
		default: 0,
	})
	wins: number;

	@Column({
		nullable: true,
		default: 0,
	})
	losses: number;

	@Column({
	nullable: true,
	default: 0,
	})
	ratio: number;
	@Column({
		nullable: true,
		default: '',
	})
	roomId: string;

	// @ManyToMany(() => Games, (game) => game.players)
	// games: Games[];
}


