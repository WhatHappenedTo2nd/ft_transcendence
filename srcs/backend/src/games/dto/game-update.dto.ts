import { PartialType } from '@nestjs/mapped-types';
import { GameCreateDto  } from './game-create.dto';

export class GameUpdateDto extends PartialType(GameCreateDto) {}

/**
 * GameUpdate DTO
 */
