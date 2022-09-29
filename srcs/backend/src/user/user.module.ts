import { Module } from '@nestjs/common';
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
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
