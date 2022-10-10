import { forwardRef, Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatRepository } from './chat.repository';
import { TypeOrmExModule } from '../typeorm-ex/typeorm-ex.module';
import { ChatGateway } from './chat.gateway';
import { ChatUserRepository } from './chatuser.repository';
import { UserRepository } from 'src/user/user.repository';
import { FriendRepository } from 'src/friend/friend.repository';
import { GamesRepository } from 'src/games/games.repository';
import { GamesModule } from 'src/games/games.module';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      ChatRepository,
      ChatUserRepository,
      UserRepository,
      FriendRepository,
      GamesRepository,
    ]),
    forwardRef(() => GamesModule),
  ],
  providers: [ChatService, ChatGateway],
  controllers: [ChatController],
})
export class ChatModule {}
