/**
 * @Decorator
 *
 * '@EntityRepository'가 될 아이
 * 직접 데코레이터를 생성하고, 데코레이터가 적용된 Repository를 받아줄 모듈을 사용하는 방법으로 해결
 * @see https://prod.velog.io/@pk3669/typeorm-0.3.x-EntityRepository-%EB%8F%8C%EB%A0%A4%EC%A4%98
 */

import { SetMetadata } from "@nestjs/common";

export const TYPEORM_EX_CUSTOM_REPOSITORY = "TYPEORM_EX_CUSTOM_REPOSITORY";

export function CustomRepository(entity: Function): ClassDecorator {
	/**
	* @func SetMetadata
	* SetMetadata는 key: value형태
	*   'key: TYPEORM_EX_CUSTOM_REPOSITORY
	*   value: entity'
	* SetMetadata()메서드를 이용하여 전달받은 Entity를 TYPEORM_EX_CUSTOM_REPOSITORY 메타데이터에 지정한다.
	*
	* 메타데이터는 왜 쓰는가?
	*   Nest에서 DI는 런타임에서 제어하기 때문에 런타임 전에 메타데이터 세팅을 해놓고 런타임에 다이나믹모듈 방식으로 DI를 해줄 것이기 때문이다.
	*   다이나믹모듈 참고
	*   @see https://velog.io/@pk3669/Nest%EC%97%90%EC%84%9C-%EB%8B%A4%EC%9D%B4%EB%82%98%EB%AF%B9-%EB%AA%A8%EB%93%88Dynamic-module-%EA%B0%9C%EB%85%90%EB%A7%8C-%EC%95%8C%EC%95%84%EB%B3%B4%EA%B8%B0
	*
	*/
	return SetMetadata(TYPEORM_EX_CUSTOM_REPOSITORY, entity);
}
