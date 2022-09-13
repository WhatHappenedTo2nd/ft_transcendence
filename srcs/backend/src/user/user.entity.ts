import { BaseEntity, Column, Entity, JoinColumn, PrimaryGeneratedColumn, Unique } from "typeorm";

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
	@Column()
	intra_id: string;

	// 사이트에서 사용하는 닉네임.
	// 처음 로그인을 했을 때는 intra_id와 동일하게 설정됨.
	@Column({ type: "varchar", length: 20 })
	nickname: string;

	// 사용자 프로필 이미지.
	// 처음 로그인을 했을 때는 인트라 프로필 이미지와 동일하게 설정됨.
	@Column()
	avatar: string;

	// 유저가 접속 중인지 여부
	@Column({ default: false })
	is_online: boolean;

	// 유저가 게임 중인지 여부
	@Column({ default: false })
	now_playing: boolean;

	// 2차 인증할 때 받는 이메일.
	// 이메일이 비어있으면 아직 2차 인증을 하지 않은 것임.
	@Column({ default: "" })
	email: string;
}

/**
 * 차단한 사람과 차단 당한 사람 테이블
 */
@Entity()
export class Block extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	// 차단한 사람
	@JoinColumn()
	blocker: User;

	// 차단 당한 사람
	@JoinColumn()
	blocked: User;
}

/**
 * 친구 목록 테이블
 * a와 b가 친구라면 친구 1에 a, 친구 2에 b가 있고
 * 또 반대로 친구 1에 b, 친구 2에 a도 있음.
 */
@Entity()
export class Friend extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	// 친구 1
	@JoinColumn()
	user_id: User;

	// 친구 2
	@JoinColumn()
	friend_id: User;
}

/**
 * 게임 대결 전적 테이블
 * 마이페이지 히스토리에서는 내가 왼쪽에 가게 설정함.
 * 여기서 정보를 뽑아 몇 승 몇 패인지, 승률 같은 것도 계산하면 됨.
 */
@Entity()
export class History extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	// 이긴 유저
	@JoinColumn()
	user_a: User;

	// 진 유저
	@JoinColumn()
	user_b: User;

	// 이긴 유저의 점수
	@Column({ default: 0 })
	score_a: number;

	// 진 유저의 점수
	@Column({ default: 0 })
	score_b: number;
}
