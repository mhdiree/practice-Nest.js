import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { UserRepository } from "./repository/user.repository";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "entity/user.model";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository
    ){
        super({ //토큰 유효성 확인
            secretOrKey: 'SECRET',
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        })
    }

    async validate(payload) {
        const { username } = payload;
        const user = await this.userRepository.findOne({ where: { username }});
        
        if(!user){
            throw new UnauthorizedException('사용자가 존재하지 않음');
        }
        return user;
    }
}