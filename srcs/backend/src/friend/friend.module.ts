import { Module } from '@nestjs/common';
import { FriendService } from './friend.service';
import { FriendController } from './friend.controller';
import { TypeOrmExModule } from '../typeorm-ex/typeorm-ex.module';
import { FriendRepository } from './friend.repository';
import { UserRepository } from 'src/user/user.repository';
import { UserService } from 'src/user/user.service';


@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([FriendRepository]),
    TypeOrmExModule.forCustomRepository([UserRepository])
  ],
  providers: [FriendService, UserService],
  controllers: [FriendController]
})
export class FriendModule {}
