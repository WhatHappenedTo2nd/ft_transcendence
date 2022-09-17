import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GameUser } from './class/game-user.class';
import { Games } from './games.entity';
import { GamesService } from './games.service';

@Controller('games')
export class GamesController {
    constructor (private gameService: GamesService) {}

}
