import { Module } from '@nestjs/common';
import { WeatherController } from './weather.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { City, CitySchema } from './schemas/City';
import { WeatherService } from './weather.service';
import { HttpModule } from '@nestjs/axios';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ MongooseModule.forFeature([{name: City.name, schema: CitySchema}]), HttpModule],
  controllers: [WeatherController],
  providers: [WeatherService, JwtService]
})
export class WeatherModule {}
