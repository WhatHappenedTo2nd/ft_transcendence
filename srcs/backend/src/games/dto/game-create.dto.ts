import { IsOptional, IsInt } from "class-validator";
import { User } from '../../user/user.entity';
import { GameMode } from '../enum/games.enum';

export class GameCreateDto {
	readonly players: User[];

	@IsOptional()
	@IsInt()
	readonly winner_id: number;

	@IsOptional()
	@IsInt()
	readonly loser_id: number;

	@IsOptional()
	@IsInt()
	readonly win_score: number;

	@IsOptional()
	@IsInt()
	readonly lose_score: number;

	@IsOptional()
	@IsInt()
	readonly mode: GameMode;
	// readonly mode: number;
}

/**
 * GameCreate DTO
 */
