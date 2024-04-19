import { HttpException, HttpStatus } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

export class CityAlreadyExistsExceptions extends HttpException{
    @ApiProperty({example: 400})
    statusCode: number

    @ApiProperty({example: "City already present in the database"})
    message: string
    constructor (){
        super( "City already present in the database", HttpStatus.BAD_REQUEST)
    }
}

export class InvalidCityInputException extends HttpException{
    @ApiProperty({example: 400})
    statusCode: number

    @ApiProperty({example: "Provided input for city is Invalid/Empty."})
    message: string
    constructor (){
        super( "Provided input for city is Invalid/Empty.", HttpStatus.BAD_REQUEST)
    }
}
