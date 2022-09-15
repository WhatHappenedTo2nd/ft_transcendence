import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setBaseViewsDir(join(__dirname, '..', 'src', 'views'));
  app.setViewEngine("ejs");
  app.enableCors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'HEAD', 'PATCH', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  });
  await app.listen(9633);
}
bootstrap();
