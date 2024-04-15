import { ForbiddenException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { City, CityDocument } from "./schemas/City";
import { Model } from "mongoose";
import { CreateCityDTO } from "./dtos/CreateCity.dto";
import { HttpService } from '@nestjs/axios';
import { map, catchError, lastValueFrom } from 'rxjs';
import { ConfigService } from "@nestjs/config";

@Injectable()
export class WeatherService {
    constructor(@InjectModel(City.name) private cityModel: Model<CityDocument>,
        private readonly http: HttpService, private readonly configService: ConfigService) { }

    addCity(cityDTO: CreateCityDTO): Promise<City> {
        const model = new this.cityModel();
        model.city = cityDTO.city
        model.latitude = cityDTO.latitude;
        model.longitude = cityDTO.longitude
        return model.save();
    }

    async getAllCities(): Promise<string[]> {
        const all_cities_docs = await this.cityModel.find().exec();
        return all_cities_docs.map(cityDoc => (cityDoc.city))
    }

    async getWeather() {
        const all_cities_docs = await this.cityModel.find().exec();
        const apiKey = this.configService.get("API_KEY");
        const requests = all_cities_docs.map(async (cityDoc) => {
            const lat = cityDoc.latitude;
            const lon = cityDoc.longitude;
            const apiUrl = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
            const result = this.http.get(apiUrl).pipe(
                map(response => ({
                    city: cityDoc.city,
                    weather: response.data['weather'][0]['description']
                }))
            );
            return await lastValueFrom(result);
        });

        const results = await Promise.all(requests);
        return results;
    }

}
