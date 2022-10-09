import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatRepository } from './chat.repository';
import { TypeOrmExModule } from '../typeorm-ex/typeorm-ex.module';
import { ChatGateway } from './chat.gateway';
import { ChatUserRepository } from './chatuser.repository';
import { UserRepository } from 'src/user/user.repository';
import { FriendRepository } from 'src/friend/friend.repository';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      ChatRepository,
      ChatUserRepository,
      UserRepository,
      FriendRepository
    ]),
  ],
  providers: [ChatService, ChatGateway],
  controllers: [ChatController],
})
export class ChatModule {}
