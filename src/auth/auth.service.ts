import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserRepository } from "./repository/user.repository";
import { UserDTO } from "./dto/user.dto";

@Injectable()
export class AuthService {
	constructor(
    	@InjectRepository(UserRepository) 
        private userRepository: UserRepository,
    ){}

    async signUp(userDTO: UserDTO): Promise<void> {
        return this.userRepository.createUser(userDTO);
    }
}