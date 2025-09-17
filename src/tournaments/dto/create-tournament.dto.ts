import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateTournamentDto {
    @ApiProperty({
        description: 'Название турнира',
        example: 'Турнир по шашкам',
        required: true,
        type: String,
    })
    @IsNotEmpty()
    @IsString()
    name: string

    @ApiProperty({
        description: 'Описание турнира',
        example: 'Турнир для определения победителя',
        type: String,
    })
    @IsOptional()
    @IsString()
    description?: string

    @IsDateString()
    @IsNotEmpty()
    startDate: string

}
