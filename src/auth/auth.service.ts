import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserDTO } from "./dto/user.dto";
import { JwtService } from "@nestjs/jwt";
import { FindOptionsWhere, Repository } from "typeorm";
import { User } from "./entity/user.entity";

@Injectable()
export class AuthService {
	constructor(
    	@InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private jwtService: JwtService,
    ){}

    async signUp(userDTO: UserDTO): Promise<void> {
        
        return this.createUser(userDTO);
    }

    async createUser(userDTO: UserDTO): Promise<void> {
        const { username, password } = userDTO;
        //const account = new Account();
        //account.accountId = this.generateAccountId();
        
        const user = new User() //repository entity의 객체 생성
        Object.assign(user, {
            username,
            password
        })
        try {
            await this.userRepository.save(user);
        }catch(e){
            if (e.code === "ER_DUP_ENTRY") {
                throw new ConflictException("이미 존재하는 사용자입니다.");
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    async signIn(userDTO: UserDTO): Promise<{ accessToken: string }> {
        const { username, password } = userDTO;
        const user = await this.userRepository.findOne({
            where: {
                username: username,
            } as FindOptionsWhere<User>,
        });
    
        if (user && password === user.password ) {
            const payload = { username };
            const accessToken = await this.jwtService.sign(payload);
            return { accessToken };
        } else {
            throw new UnauthorizedException("로그인 실패");
        }
    }

    async validateUser(username: string):Promise<User>{
        try{
            const user = await this.userRepository.findOneOrFail({where: {username}})
            if(!user){
                throw new UnauthorizedException()
            }
            
            return user;

        }catch(error){
            console.log(error)
            throw new UnauthorizedException()
        }
    }
}