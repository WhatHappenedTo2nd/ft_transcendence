import { CustomRepository } from "../typeorm-ex/typeorm-ex.decorator";
import { Repository } from "typeorm";
import { Games } from './games.entity';
import { GameCreateDto } from "./dto/game-create.dto";

/**
 * Repository 생성(필요한) 이유
 *
 * 1. service에서 repository에 접근하여 DB에 관한 연산을 진행하고 이는 TypeORM을 이용한 하나의 Repository 패턴이다.
 * -> service layer에는 서비스에 핵심이 되는 비지니스 로직이 존재한다. Repository 패턴을 사용하지않고 DB에 직접 접근을 하면 문제가 발생한다.
 * -> 'client-(DTO)controller-(DTO)service-DB'의 흐름처럼 클라이언트로부터 DTO객체를 받은 컨트롤러는 이를 서비스단에 넘겨주게 된다. 서비스는 구현된 비지니스 로직을 통해 컨트롤러로부터 받은 DTO객체를 사용해 DB에 직접 접근하여 저장한다.
 * -> 발생하는 문제점!
 *   1.1 비지니스 로직에만 집중하기 힘들다.
 *   - 서비스의 비지니스 로직에서 DB에 접근할 때 더 복잡한 로직이 필요하다면 서비스는 비지니스 로직에만 집중할 수 없게 된다.
 *   -비즈니스 로직 자체를 Testing 하는데 어려워지고 코드 중복이 발생하여 가독성이 떨어지게 된다.
 *   1.2 순환 참조 현상
 *   - 만약 A라는 서비스에서 B라는 서비스의 일부를 참조하고 있고, B라는 서비스에서도 A의 일부를 참조하고 있는 경우 순환 참조의 경우가 생길 수 있다.
 *   - 해결 할 수 있지만 이렇게 된다면 마찬가지로 코드의 중복과 가독성이 떨어질 수 있는 문제점이 있다.
 *
 * 2. service에서 repository를 사용하기 위해서는 service가 repository를 가지고 있어야 한다. 아무 repository가 아니라, board에 관한 DB연산을 하는 인스턴스를 받아야 한다.
 * 매번 생성하는 것이 아니라, nestjs에 등록한 repository를 가져와야 한다 -> module.ts에서 forFeature의 사용으로 등록
 *
 * @see https://tasddc.tistory.com/124
 * @see https://velog.io/@chappi/Nestjs%EB%A5%BC-%EB%B0%B0%EC%9B%8C%EB%B3%B4%EC%9E%90-9%EC%9D%BC%EC%B0%A8-Repository%EB%A5%BC-%EC%9D%B4%EC%9A%A9%ED%95%9C-Board-CRUD
 *
 */
/**
 * custom Repository 만들기
 *
 * typeorm 0.3.x 에서는 기존에 사용하던 '@EntityRepository'가 deprecated 되었다.
 * 데코레이터를 이용하여 생성
 * @see https://prod.velog.io/@pk3669/typeorm-0.3.x-EntityRepository-%EB%8F%8C%EB%A0%A4%EC%A4%98
 */
 @CustomRepository(Games)
export class GamesRepository extends Repository<Games> {
	async findGame(id: number) {
		const found = await this.find({
			where: [{ winner_id: id }, { loser_id: id }],
			relations: ['players'],
		});
		if (!found.length) {
			return [];
		}
		return found;
	}
}

/**
 * GameRepository
 */
