import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateCityDTO {
    @ApiProperty({example:"Delhi", description: 'Name of the city' })
    @IsNotEmpty()
    city: string;
}

