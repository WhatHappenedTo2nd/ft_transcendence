import { Module } from '@nestjs/common';
import { FriendService } from 'src/friend/friend.service';
import { FriendRepository } from '../friend/friend.repository';
import { TypeOrmExModule } from '../typeorm-ex/typeorm-ex.module';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      UserRepository,
      FriendRepository,
    ])
  ],
  controllers: [UserController],
  providers: [UserService, FriendService],
  exports: [UserService],
})
export class UserModule {}
