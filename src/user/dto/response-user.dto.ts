import { ApiProperty } from "@nestjs/swagger";

export class ResponceUserDto {
    @ApiProperty({ description: 'id Пользователя' })
    id: string;

    @ApiProperty({ description: 'email Пользователя' })
    email: string;

    @ApiProperty({ description: 'userName' })
    username: string;

    @ApiProperty({ description: 'Рейтинг пользователя' })
    rating: number

    @ApiProperty({ description: 'Дата регистрации' })
    createdAt: string

    @ApiProperty({ description: 'Дата обновления' })
    updatedAt: string
}