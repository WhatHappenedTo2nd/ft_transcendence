import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { GameCreateDto } from './dto/game-create.dto';
import { GameUpdateDto } from './dto/game-update.dto';

import { Games } from './games.entity';
import { GamesRepository } from './games.repository';

import { UserRepository } from 'src/user/user.repository';
@Injectable()
export class GamesService {
	/**
	 * @param gamesRepository
	 */
	 constructor(
		@InjectRepository(GamesRepository)
		private gamesRepository: GamesRepository,
		@InjectRepository(GamesRepository)
		private userRepository: UserRepository,
	) {}

	/**
	 * @returns
	 */
	async findAll() {
		return this.gamesRepository.find({
			relations: ['players'],
		});
	}

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
	async create(gameCreateDto: GameCreateDto): Promise<Games> {
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

	/**
	 * 게임 결과 업데이트
	 * 승리 횟수
	 * 진 횟수
	 * 승리 비율
	 * @param user
	 * @param isWinner
	 * @returns
	 */
	async updateStatus(user: Games, isWinner: boolean) {
		if (isWinner) {
			user.wins += 1;
		}
		else {
			user.losses += 1;
		}
		user.ratio = (user.wins / (user.wins + user.losses)) * 100;

		const updatedUser = await this.gamesRepository.save(user);
		return updatedUser;
	}
}

/**
 * GameService
 */
