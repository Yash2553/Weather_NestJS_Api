import { ApiProperty } from "@nestjs/swagger";

export class GetWeatherDTO {
    @ApiProperty({example: "Hyderabad", description: "The name of the city"})
    City: string

    @ApiProperty({example: "35.5°C", description: "The current temperature"})
    Temperature: string

    @ApiProperty({example: "37.5°C", description: "The Maximum temperature for the day"})
    Maximum_Temperature: string

    @ApiProperty({example: "30.5°C", description: "The Minimum temperature for the day"})
    Minimum_Temperature: string

}
