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

@Injectable()
export class WeatherService {
    constructor(@InjectModel(City.name) private cityModel: Model<CityDocument>,
        private readonly http: HttpService, private readonly configService: ConfigService) { }

    addCity(cityDTO: CreateCityDTO): Promise<City> {
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
        const all_cities_docs = await this.cityModel.find().exec();
        const apiKey = this.configService.get("API_KEY");

        const requests = all_cities_docs.map(async (cityDoc) => {
            const city = cityDoc.city;
            // const lat = cityDoc.latitude;
            // const lon = cityDoc.longitude;
            const apiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
            const result = this.http.get(apiUrl).pipe(
                map(response => {
                    const getWeatherDto = new GetWeatherDTO()
                    getWeatherDto.City = cityDoc.city;
                    getWeatherDto.Maximum_Temperature = parseFloat((response.data['main']['temp'] - 273.15).toFixed(1)) + "°C";
                    getWeatherDto.Minimum_Temperature = parseFloat((response.data['main']['temp_max'] - 273.15).toFixed(1)) + "°C";
                    getWeatherDto.Temperature = parseFloat((response.data['main']['temp_min'] - 273.15).toFixed(1)) + "°C";
                    return getWeatherDto
                })
            );
            const data = await lastValueFrom(result);

            return data
        });

        const results = await Promise.all(requests);
        return results;
    }

}
