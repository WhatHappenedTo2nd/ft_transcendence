import { Module } from '@nestjs/common';
import { TypeOrmExModule } from './typeorm-ex/typeorm-ex.module';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([UserRepository])
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
