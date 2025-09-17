import { ApiProperty } from "@nestjs/swagger"

export class ResponseTournamentDto {
    @ApiProperty({ description: 'Ид турнира' })
    id: string;
    @ApiProperty({ description: 'Название турнира' })
    name: string
    @ApiProperty({ description: 'Описание турнира' })
    description: string
    @ApiProperty({ description: 'Статус турнира' })
    status: string
    @ApiProperty({ description: 'Дата начала' })
    startDate: string
    @ApiProperty({ description: 'Дата окончания' })
    endDate: null | string
    @ApiProperty({ description: 'Дата создания' })
    createdAt: string
    @ApiProperty({ description: 'Дата обновления' })
    updatedAt: string
}