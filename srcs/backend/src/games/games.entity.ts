import { BaseEntity, Column, Entity, ManyToMany, JoinTable,ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';

/**
 * Entity
 * DB 테이블에 존재하는 Column들을 필드로 가지는 객체를 말한다.
 * DB 테이블과 1대1 대응이며, 테이블에 가지지않은 Column을 필드로 가져서는 안된다.
 * Entity 클래스는 다른 클래스를 상속받거나 인터페이스의 구현체여서는 안되고 순수한 데이터 객체인 것이 좋다.
 * 중복되는 내용이 있을 경우 BaseEntity를 만들어 상속할 수 있다.
 *
 * @see https://code-lab1.tistory.com/201
 */

/**
 * Game의 결과를 저장하는 테이블 -> user.entity.ts의 history와 같다.
 */
@Entity()
export class Games extends BaseEntity {
	/**
	 * 자동생성되는 ID값을 표현하는 방식을 아래와 같이 2가지 옵션을 사용할 수 있도록 한다.
	 * increment: 기본 옵션, AUTO_INCREMENT를 사용해서 1씩 증가하는 ID를 부여한다.
	 * uuid: 유니크한 uuid를 사용할 수 있다.
	 */
	@PrimaryGeneratedColumn()
	id: number;

	/**
	 * 추가로 필요한 데이터
	 */
	// @ManyToOne(() => User, (user) => user.id, {
	// 	cascade: true,
	// })
	@ManyToMany(() => User, (user) => user.games)
	@JoinTable()
	players: User[];

	@Column({
		nullable: true,
	})
	winner_id: number;

	@Column({
		nullable: true,
	})
	loser_id: number;

	@Column({
		nullable: true,
	})
	win_score: number;

	@Column({
		nullable: true,
	})
	lose_score: number;

	@Column({
		nullable: true,
	})
	mode: number;
}

/**
 * 추가로 필요하다고 생각하는 데이터 추가
 */
