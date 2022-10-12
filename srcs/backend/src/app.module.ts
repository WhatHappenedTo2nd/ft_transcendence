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
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter'
import { GamesModule } from './games/games.module';
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '/dist'),
    }),
    MailerModule.forRoot({
      transport: 'smtps://whathappenedto2nd@gmail.com:oybpqqnyvcwhgbkw@smtp.gmail.com',
      defaults: {
        from: '"2nd-Pong" <noreply@what2nd.com>'
      },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new EjsAdapter(),
        options: {
          strict: true,
        }
      }
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
