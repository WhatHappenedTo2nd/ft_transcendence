import { Module } from '@nestjs/common';
<<<<<<< HEAD
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatRepository } from './chat.repository';
import { TypeOrmExModule } from '../typeorm-ex/typeorm-ex.module';
import { ChatGateway } from './chat.gateway';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      ChatRepository
    ])
  ],
  providers: [ChatService, ChatGateway],
  controllers: [ChatController]
})
=======
import { ChatGateway } from './chat.gateway';

@Module({
	providers: [ChatGateway],
})

>>>>>>> 0eca8e0e035cc14606cd89af922e8a175bde16d9
export class ChatModule {}
