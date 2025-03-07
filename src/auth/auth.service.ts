import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserRepository } from "./repository/user.repository";
import { UserDTO } from "./dto/user.dto";
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
	constructor(
    	@InjectRepository(UserRepository) 
        private userRepository: UserRepository,
        private jwtService: JwtService,
    ){}

    async signUp(userDTO: UserDTO): Promise<void> {
        return this.userRepository.createUser(userDTO);
    }

    async signIn(userDTO: UserDTO): Promise<{ accessToken: string }> {
        const { username, password } = userDTO;
        const user = await this.userRepository.findOne({ where: { username }});
    
        if (user && (await password == user.password )) {
            const payload = { username };
            const accessToken = await this.jwtService.sign(payload);
            return { accessToken };
        } else {
            console.log(password);
            console.log(user?.password);
            throw new UnauthorizedException("로그인 실패");
        }
    }
}