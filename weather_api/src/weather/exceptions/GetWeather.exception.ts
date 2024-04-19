import { HttpException, HttpStatus } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

export class FailedToGetWeatherDataException extends HttpException{

    @ApiProperty({example: 403})
    statusCode: number

    @ApiProperty({example: "Failed to get the weather data from OpenWeather API"})
    message: string
    
    constructor(){
        super('Failed to get the weather data from OpenWeather API', HttpStatus.FORBIDDEN)
    }
}