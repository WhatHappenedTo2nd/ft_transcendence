import { join } from 'path';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeORMConfig } from './configs/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { FriendModule } from './friend/friend.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ProfileModule } from './profile/profile.module';
import { ChatModule } from './chat/chat.module';
import { GamesModule } from './games/games.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '/profilePicture'),
    }),
    TypeOrmModule.forRoot(typeORMConfig),
    AuthModule,
    UserModule,
    FriendModule,
    ChatModule,
    ProfileModule,
    GamesModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
