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
      users: { admin: 'password' },
    }),
  );


  const config = new DocumentBuilder()
    .setTitle('Weather API')
    .setDescription('API to fetch weather for configured cities using Open Weather API.')
    .setVersion('1.0')
    .addTag('weather')
    .addBasicAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  const options = {
    swaggerOptions: {
      schemas: [
        {
          CreateCityDTO: {
            type: 'object',
            properties: {
              city: { type: 'string' },
              latitude: { type: 'number' },
              longitude: { type: 'number' },
            },
            required: ['city', 'latitude', 'longitude'],
          },
        },
        {
          WeatherResponse: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                city: { type: 'string' },
                weather: { type: 'string' },
              },
            },
          },
        },
      ],
    },
  };
  SwaggerModule.setup('api', app, document, options);

  await app.listen(3000);
}
bootstrap();
