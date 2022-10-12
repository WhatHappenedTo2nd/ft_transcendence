import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmExModule } from '../typeorm-ex/typeorm-ex.module';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';
import { GamesGateway } from './games.gateway';
import { GamesRepository } from './games.repository';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { UserRepository } from 'src/user/user.repository';
import { ChatModule } from 'src/chat/chat.module';
import { ChatService } from 'src/chat/chat.service';
import { ChatRepository } from 'src/chat/chat.repository';
import { ChatUserRepository } from 'src/chat/chatuser.repository';
import { FriendRepository } from 'src/friend/friend.repository';

@Module({
	imports: [TypeOrmExModule.forCustomRepository([GamesRepository, UserRepository, ChatRepository, ChatUserRepository, FriendRepository]), UserModule, AuthModule, forwardRef(() => ChatModule)],
	controllers: [GamesController],
	providers: [GamesService, GamesGateway, ChatService],
	exports: [GamesGateway],
})
export class GamesModule {}

/**
 * GameModule
 */
