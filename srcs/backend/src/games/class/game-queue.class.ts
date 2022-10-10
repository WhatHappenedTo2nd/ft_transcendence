import { GameUser } from "./game-user.class";
import { MAX_QUEUE } from "../constant/games.constant";

export default class Queue {
	/**
	 * 게임 유저를 담는 배열 -> 유자가 게임 실행(모드 중 선택) 시 열려야하는 게임 목록을 저장
	 * 배열을 큐처럼 사용하기
	 */
	private queue: Array<GameUser> =  new Array();

	/**
	 * Array 용량 설정
	 */
	constructor(private capacity: number = MAX_QUEUE) {}

	/**
	 * 유저를 배열에 추가
	 */
	enqueue(gameuser: GameUser): void {
		if (this.size() === this.capacity) {
			throw Error('Queue has reached max capacity, you cannot add more items');
		}
		this.queue.push(gameuser);
	}

	/**
	 * 유저를 배열에서 제거
	 * shift(): 배열에서 첫 번째 요소를 제거하고, 제거된 요소를 반환. 이 메서드는 배열의 길이를 변하게 한다.
	 */
	dequeue(): GameUser | undefined {
		return this.queue.shift();
	}

	/**
	 * 배열의 크기를 반환
	 */
	size(): number {
		return this.queue.length;
	}

	/**
	 * 게임 유저의 닉네임을 찾아서 반환
	 */
	getUserbyNickname(nickname: string): GameUser {
		return this.queue.find((element) => element.nickname === nickname);
	}

	/**
	 * 게임 유저 삭제
	 * splice(): 배열의 기존 요소를 삭제 또는 교체하거나 새 요소를 추가하여 배열의 내용을 변경한다.
	 *  array.splice(start[, deleteCount[, item1[, item2[, ...]]]])
	 *  start: 배열의 변경을 시작한 index
	 *  deleteCount: 배열에서 제거할 요소의 수
	 *  item: 배열에 추가할 요소, 아무 요소도 지정하지않으면 요소를 제거만 한다.
	 *
	 * @see https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
	 */
	removeUser(gameuser: GameUser): void {
		let index: number = this.queue.findIndex((element) => element.nickname === gameuser.nickname);
		if (index !== -1) {
			this.queue.splice(index, 1);
		}
	}

	isInQueue(gameuser: GameUser): boolean {
		return this.getUserbyNickname(gameuser.nickname) !== undefined;
	}

	/**
	 * 가장 차이가 적은 ratio의 유저와 매칭
	 */
	matchPlayers(): Array<GameUser> {
		let players: Array<GameUser> = Array();
		let firstPlayer: GameUser = this.dequeue();
		let secondPlayerId: number = 0;
		// let difference: number = Math.abs(firstPlayer.ratio - this.queue[0].ratio);

		for (let i = 0; i < this.size(); i++) {
			// if (firstPlayer.mode === this.queue[i].mode && Math.abs(firstPlayer.ratio - this.queue[i].ratio) < difference)

			if (firstPlayer.mode === this.queue[i].mode && firstPlayer.roomNo === this.queue[i].roomNo)
			{
				secondPlayerId = i;
			}
		}
		if (firstPlayer.mode !==  this.queue[secondPlayerId].mode || firstPlayer.roomNo !== this.queue[secondPlayerId].roomNo) {
			this.queue.splice(1, 0, firstPlayer);
			return players;
		}

		players.push(firstPlayer);
		players.push(this.queue[secondPlayerId]);
		this.queue.splice(secondPlayerId, 1);
		return players;
	}
}

/**
 * GameQueue class
 */
