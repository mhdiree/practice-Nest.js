import { IsString, MaxLength } from "class-validator";

export class UserDTO {
    @IsString()
    @MaxLength(10)
    username: string;

    @IsString()
    @MaxLength(20)
    password: string;
}