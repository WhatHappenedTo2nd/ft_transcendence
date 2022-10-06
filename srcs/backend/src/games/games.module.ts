import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '../typeorm-ex/typeorm-ex.module';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';
import { GamesGateway } from './games.gateway';
import { GamesRepository } from './games.repository';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { UserRepository } from 'src/user/user.repository';

@Module({
	imports: [TypeOrmExModule.forCustomRepository([GamesRepository, UserRepository]), UserModule, AuthModule],
	controllers: [GamesController],
	providers: [GamesService, GamesGateway,],
	exports: [GamesGateway],
})
export class GamesModule {}

/**
 * GameModule
 */
