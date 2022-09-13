import { Module } from '@nestjs/common';
import { FriendService } from './friend.service';
import { FriendController } from './friend.controller';
import { TypeOrmExModule } from '../typeorm-ex/typeorm-ex.module';
import { FriendRepository } from './friend.repository';


@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      FriendRepository
    ])
  ],
  providers: [FriendService],
  controllers: [FriendController]
})
export class FriendModule {}
