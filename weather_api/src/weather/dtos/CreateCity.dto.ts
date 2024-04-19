import { ApiProperty } from '@nestjs/swagger';

export class CreateCityDTO {
    @ApiProperty({example:"Delhi", description: 'Name of the city' })
    city: string;
}

