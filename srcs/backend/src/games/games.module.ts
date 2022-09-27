import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';
import { GamesGateway } from './games.gateway';
import { GamesRepository } from './games.repository';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';

@Module({
	imports: [TypeOrmModule.forFeature([GamesRepository]), UserModule, AuthModule],
	controllers: [GamesController],
	providers: [GamesService, GamesGateway,],
	exports: [GamesGateway],
})
export class GamesModule {}

/**
 * GameModule
 */
