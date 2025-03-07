import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength } from "class-validator";


export class UserDTO {
    @ApiProperty()
    @IsString()
    @MaxLength(10)
    username: string;

    @ApiProperty()
    @IsString()
    @MaxLength(20)
    password: string;
}