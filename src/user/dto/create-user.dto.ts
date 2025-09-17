import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength, minLength } from "class-validator";

export class CreateUserDto {
    @ApiProperty({
        description: 'Email пользователя',
        example: 'user@tournament.ru',
        required: true,
        type: String
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: 'User name',
        example: 'userName',
        required: true,
        minimum: 3,
        type: String
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(3, { message: 'Имя пользователя должно быть не менее 3х символов' })
    username: string
}
