import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class AccountDto {
    @ApiProperty()
    @IsString()
    account_id: string;
    
    @ApiProperty()
    @IsNumber()
    balance : string;
}