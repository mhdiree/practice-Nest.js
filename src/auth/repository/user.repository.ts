import { Repository } from "typeorm";
import { User } from "../entity/user.entity";
import { BadRequestException, ConflictException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { DataSource } from 'typeorm';
import { UserDTO } from "../dto/user.dto";

@Injectable() //USer 엔티티 사용
export class UserRepository extends Repository<User>{
    constructor(private dataSource: DataSource) {
        super(User, dataSource.createEntityManager());
    }

    async createUser(userDTO: UserDTO): Promise<void> {
        const { username, password } = userDTO;
        const user = this.create({username, password}); //repository entity의 객체 생성

        try {
            await this.save(user);
        }catch(e){
            if (e.code === "ER_DUP_ENTRY") {
                throw new ConflictException("이미 존재하는 사용자입니다.");
            } else {
                throw new InternalServerErrorException();
            }
        }
    }
}