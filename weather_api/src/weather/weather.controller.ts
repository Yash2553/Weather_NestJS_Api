import { Body, Controller, Get, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateCityDTO } from './dtos/CreateCity.dto';
import { WeatherService } from 'src/weather/weather.service';
import { ApiBasicAuth, ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GetWeatherDTO } from './dtos/GetWeather.dto';
import { GetAllCitiesDTO } from './dtos/GetAllCities.dto';


@ApiTags('weather')
@Controller('weather')
export class WeatherController {
    constructor (private readonly weatherService: WeatherService, ) {}
    
    
    @ApiOkResponse({type:GetWeatherDTO, description:"Weather of all configured cities"})
    @Get()
    getWeather() {
        return this.weatherService.getWeather();
    }
 

    @ApiOkResponse({type: GetAllCitiesDTO, description: "List of all configured cities"})
    @Get("cities") 
    getListOfCities() {
        return this.weatherService.getAllCities();
    }
    

    @ApiOkResponse({type: CreateCityDTO, description: "The name of the added city"})
    @ApiBasicAuth()
    @Post('add')
    @UsePipes(new ValidationPipe())
    addCity(@Body() city: CreateCityDTO) {
        this.weatherService.addCity(city)
        return city
    }

}
