import { IsNotEmpty } from "class-validator";

export class FindUserDto {
    @IsNotEmpty({message:'Id parameter required'})
    id: string
}