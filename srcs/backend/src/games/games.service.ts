import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { GameCreateDto } from './dto/game-create.dto';
import { GameUpdateDto } from './dto/game-update.dto';

import { Games } from './games.entity';
import { GamesRepository } from './games.repository';

@Injectable()
export class GamesService {
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
	async findGame(id: number) {
		return this.gamesRepository.findGame(id);
	}

	async findOne(id: number): Promise<Games> {
		const game = await this.gamesRepository.findOneBy({id});
		if (!game) {
			throw new NotFoundException(`Games [${id}] not ofound`);
		}
		return game;
	}

	async findAllGame(): Promise<Games []> {
		const games = await this.gamesRepository.find({});
		return games;
	}

	/**
	 * GameCreateDto
	 */
	async create(gameCreateDto : GameCreateDto): Promise<Games> {
		const game = this.gamesRepository.create({ ...gameCreateDto });
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
