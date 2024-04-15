import { Body, Controller, Get, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateCityDTO } from './dtos/CreateCity.dto';
import { WeatherService } from 'src/weather/weather.service';
import { ApiBasicAuth, ApiBearerAuth } from '@nestjs/swagger';

@Controller('weather')
export class WeatherController {
    constructor (private readonly weatherService: WeatherService, ) {}

    @Get()
    getWeather() {
        return this.weatherService.getWeather();
    }

    @Get("cities") 
    getListOfCities() {
        return this.weatherService.getAllCities();
    }
    
    @ApiBasicAuth()
    @Post('add')
    @UsePipes(new ValidationPipe())
    addCity(@Body() city: CreateCityDTO) {
        this.weatherService.addCity(city)
        return "City Added Successfully."
    }

}
