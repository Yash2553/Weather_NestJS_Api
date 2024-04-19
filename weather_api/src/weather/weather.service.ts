import { ForbiddenException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { City, CityDocument } from "./schemas/City";
import { Model } from "mongoose";
import { CreateCityDTO } from "./dtos/CreateCity.dto";
import { HttpService } from '@nestjs/axios';
import { map, catchError, lastValueFrom } from 'rxjs';
import { ConfigService } from "@nestjs/config";
import { GetAllCitiesDTO } from "./dtos/GetAllCities.dto";
import { GetWeatherDTO } from "./dtos/GetWeather.dto";
import { CityAlreadyExistsExceptions, InvalidCityInputException } from "./exceptions/AddCity.exception";
import { FailedToGetWeatherDataException } from "./exceptions/GetWeather.exception";

@Injectable()
export class WeatherService {
    constructor(@InjectModel(City.name) private cityModel: Model<CityDocument>,
        private readonly http: HttpService, private readonly configService: ConfigService) { }

    async addCity(cityDTO: CreateCityDTO): Promise<City> {
        const existingCity = await this.cityModel.findOne({ city: cityDTO.city }).exec();
        if (cityDTO.city.trim() === '') {
            throw new InvalidCityInputException()
        }
        else if (existingCity) {
            throw new CityAlreadyExistsExceptions()
        }

        const model = new this.cityModel();
        model.city = cityDTO.city
        // model.latitude = cityDTO.latitude;
        // model.longitude = cityDTO.longitude
        return model.save();
    }

    async getAllCities(): Promise<GetAllCitiesDTO> {
        const all_cities_docs = await this.cityModel.find().exec();
        const allCitiesDto = new GetAllCitiesDTO()
        allCitiesDto.cities = []
        all_cities_docs.forEach(cityDoc =>  allCitiesDto.cities.push(cityDoc.city));
        return allCitiesDto;
    }
    
    async getWeather() {
        try {
            const all_cities_docs = await this.cityModel.find().exec();
            const apiKey = this.configService.get("API_KEY");

            const requests = all_cities_docs.map(async (cityDoc) => {
                try {
                    const city = cityDoc.city;
                    const apiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
                    const response = await this.http.get(apiUrl).pipe(
                        map(response => {
                            const getWeatherDto = new GetWeatherDTO();
                            getWeatherDto.City = cityDoc.city;
                            getWeatherDto.Maximum_Temperature = parseFloat((response.data['main']['temp'] - 273.15).toFixed(1)) + "°C";
                            getWeatherDto.Minimum_Temperature = parseFloat((response.data['main']['temp_max'] - 273.15).toFixed(1)) + "°C";
                            getWeatherDto.Temperature = parseFloat((response.data['main']['temp_min'] - 273.15).toFixed(1)) + "°C";
                            return getWeatherDto;
                        }),
                        catchError(error => {
                            throw new FailedToGetWeatherDataException()
                        })
                    );
                    const data = await lastValueFrom(response);
                    return data;
                } catch (error) {
                    throw new FailedToGetWeatherDataException()
                }
            });

            const results = await Promise.all(requests);
            return results.filter(result => result !== null);
        } catch (error) {
            throw new FailedToGetWeatherDataException()
        }
    }

}
