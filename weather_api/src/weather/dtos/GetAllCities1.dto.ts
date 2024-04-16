import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { STATUS_CODES } from "http";

export class GetAllCitiesDTO{
    @ApiProperty({example: ['Hyderabad', 'Delhi'], description: "The list of all configured cities."})
    cities: string[];


    
}
