import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as basicAuth from 'express-basic-auth';

 async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    ['/weather/add'],
    basicAuth({
      challenge: true,
      // this is the username and password used to authenticate
      users: { admin: 'password' },
    }),
  );  

  const config = new DocumentBuilder()
    .setTitle('Weather')
    .setDescription('Fetch weather for configured cities using Open Weather API.')
    .setVersion('1.0')
    .addBasicAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();

