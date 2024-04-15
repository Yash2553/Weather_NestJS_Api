import { IsNotEmpty } from "class-validator";

export class CreateCityDTO{
    @IsNotEmpty()
    city: string

    @IsNotEmpty()
    latitude: number

    @IsNotEmpty()
    longitude: number
}