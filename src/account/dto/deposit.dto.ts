import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class depositDto {

    @ApiProperty()
    @IsNumber()
    amount: number;
}