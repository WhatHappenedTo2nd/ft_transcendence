import { Controller, Get, Logger, Param, UseGuards} from '@nestjs/common';
import { GamesService } from './games.service';
import { Games } from './games.entity';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
/**
 * Promise
 * 프로미스가 생성된 시점에는 알려지지 않았을 수도 있는 값을 위한 대리자로, 비동기 연산이 종료된 이후에 결과 값과 실패 사유를 처리하기 위한 처리기를 연결할 수 있습니다.
 * 프로미스를 사용하면 비동기 메서드에서 마치 동기 메서드처럼 값을 반환할 수 있습니다.
 * 다만 최종 결과를 반환하는 것이 아니고, 미래의 어떤 시점에 결과를 제공하겠다는 '약속'(프로미스)을 반환합니다
 */
@Controller('games')
@UseGuards(JwtAuthGuard)
export class GamesController {
	private logger: Logger = new Logger('gameController');
	/**
	 * @param gamesService
	 */
	constructor (private gamesService: GamesService) {}

	/**
	 * 게임 유저 정보 반환
	 * @returns gameusers
	 */
	@Get()
	async findAll(): Promise<Games[]> {
		const gameusers = await this.gamesService.findAll();
		return gameusers;
	}

	@Get(':id')
	async findByGameUser(@Param('id') id: number): Promise<Games[]> {
		const games = await this.gamesService.findGame(id);

		let response = [];
		let count = games.length - 1;
		for (count; count >= 0; count--) {
			const winnerId = games[count].winner_id;
			const loserId = games[count].loser_id;
			const winner = games[count].players.find((value) => value.id === winnerId);
			const loser = games[count].players.find((value) => value.id === loserId);
			const win_score = games[count].win_score;
			const lose_score = games[count].lose_score;

			response.push({
				id:games[count].id,
				me: id,
				winner: winner,
				loser: loser,
				win_score: win_score,
				lose_score: lose_score,
			});
		}
		return response;
	}

	@Get('/all')
	async getAllGame(): Promise<Games[]> {
		const games = await this.gamesService.findAllGame();
		console.log(games);
		return games;
	}

}

/**
 * GameController
 */
