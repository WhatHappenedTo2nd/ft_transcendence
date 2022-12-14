import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import * as config from 'config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { FtStrategy } from './strategies/ft.strategy';
import { UserRepository } from 'src/user/user.repository';
import { TypeOrmExModule } from 'src/typeorm-ex/typeorm-ex.module';

const jwtConfig = config.get('jwt');

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: '42' }),
    JwtModule.register({
      secret: jwtConfig.secret,
      signOptions: {
        expiresIn: 3600 * 3,
      }
    }),
    TypeOrmExModule.forCustomRepository([UserRepository])
  ],
  controllers: [AuthController],
  providers: [JwtStrategy, FtStrategy],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
