import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatRepository } from './chat.repository';
import { TypeOrmExModule } from '../typeorm-ex/typeorm-ex.module';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      ChatRepository
    ])
  ],
  providers: [ChatService],
  controllers: [ChatController]
})
export class ChatModule {}
