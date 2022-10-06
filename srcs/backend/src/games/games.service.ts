import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { GameCreateDto } from './dto/game-create.dto';
import { GameUpdateDto } from './dto/game-update.dto';

import { Games } from './games.entity';
import { GamesRepository } from './games.repository';

@Injectable()
export class GamesService {
	private logger: Logger = new Logger('GamesService');
	/**
	 * @param gamesRepository
	 */
	 constructor(
		@InjectRepository(GamesRepository)
		private gamesRepository: GamesRepository,
	) {}

	/**
	 * @returns
	 */
	async findAll() {
		return this.gamesRepository.find({
			relations: ['players'],
		});
	}

	/**
	 * 플레이어 중에 검색할 id 입력
	 * id가 승자 또는 패자에 있으면 그 게임을 반환
	 * @param id
	 * @returns
	 */
	async find(id: number) {
		const found = await this.gamesRepository.find({
			where: [{ winner_id: id }, { loser_id: id }],
			relations: ['players'],
		});
		if (!found.length) {
			return [];
		}
		return found;
	}

	async findOne(id: number): Promise<Games> {
		const game = await this.gamesRepository.findOneBy({id});
		if (!game) {
			throw new NotFoundException(`Games [${id}] not ofound`);
		}
		return game;
	}

	/**
	 * GameCreateDto
	 */
	async create(gameCreateDto : GameCreateDto): Promise<Games> {
		this.logger.log(`게임서비스에서 게임을 저장합니다.`);
		const game = this.gamesRepository.create({ ...gameCreateDto });
		this.logger.log(`게임서비스/gameDTO에 게임을 저장합니다.`);
		return await this.gamesRepository.save(game);
	}

	/**
	 * GameUpdateDto
	 */
	async update(id: number, gameUpdataDto: GameUpdateDto): Promise<Games> {
		const game = await this.gamesRepository.preload({
			id: +id,
			...gameUpdataDto,
		});
		if (!game) {
			throw new NotFoundException(`Cannot update Game[${id}]: Not Found`);
		}
		return this.gamesRepository.save(game);
	}

	async remove(id: number): Promise<Games> {
		const game = await this.findOne(id);
		return this.gamesRepository.remove(game);
	}
}

/**
 * GameService
 */
