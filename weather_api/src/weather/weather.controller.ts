import { Body, Controller, Get, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateCityDTO } from './dtos/CreateCity.dto';
import { WeatherService } from 'src/weather/weather.service';
import { ApiBadGatewayResponse, ApiBasicAuth, ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetAllCitiesDTO } from './dtos/GetAllCities.dto';
import { GetWeatherDTO } from './dtos/GetWeather.dto';
import { CityAlreadyExistsExceptions, InvalidCityInputException } from './exceptions/AddCity.exception';
import { FailedToGetWeatherDataException } from './exceptions/GetWeather.exception';


@ApiTags('weather')
@Controller('weather')
export class WeatherController {
    constructor (private readonly weatherService: WeatherService, ) {}

    @ApiResponse({status: 403, type: FailedToGetWeatherDataException, description: "Error Response when OpenWeather API calls fails for any reason"})
    @ApiOkResponse({type: GetWeatherDTO, description: "Weather of all configured cities"})
    @Get()
    async getWeather() {
        try {
            return await this.weatherService.getWeather();
        } catch (error){
            throw error
        }
    }

    @ApiOkResponse({type: GetAllCitiesDTO, description: "List of all configured cities"})
    @Get("cities") 
    getListOfCities() {
        return this.weatherService.getAllCities();
    }
    

    @ApiResponse({status: 403, type: InvalidCityInputException, description: "Error response when city is not an valid input."})
    @ApiResponse({status: 400, type: CityAlreadyExistsExceptions, description: "Error response when city is already present in the database."})
    @ApiOkResponse({type: CreateCityDTO, description: "The name of the added city"})
    @ApiBasicAuth()
    @Post('add')
    @UsePipes(new ValidationPipe())
    async addCity(@Body() city: CreateCityDTO) {
        try {
            await this.weatherService.addCity(city);
            return city;
          } catch (error) {
            throw error; 
          }
    }

}
