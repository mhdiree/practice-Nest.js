import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDTO } from './dto/user.dto';
import { JwtService } from '@nestjs/jwt';
import { FindOptionsWhere, Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { AccountService } from 'src/account/account.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
    private accountService: AccountService,
  ) {}

  async signUp(userDTO: UserDTO): Promise<void> {
    return this.createUser(userDTO);
  }

  async createUser(userDTO: UserDTO): Promise<void> {
    const { username, password } = userDTO;
    const user = new User(); // repository entity 객체 생성
    Object.assign(user, {
      username,
      password,
    });

    const queryRunner =
      this.userRepository.manager.connection.createQueryRunner();

    await queryRunner.startTransaction(); // 트랜잭션 시작

    try {
      await queryRunner.manager.save(user);

      const account = await this.accountService.createAccount(
        user,
        queryRunner,
      );
      user.account = account;
      await queryRunner.manager.save(user);
      await queryRunner.commitTransaction(); // 트랜잭션 커밋
    } catch (e) {
      await queryRunner.rollbackTransaction(); // 트랜잭션 롤백
      /* eslint-disable */
      if (e.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('이미 존재하는 사용자입니다.');
      } else {
        throw new InternalServerErrorException();
      }
    } finally {
      await queryRunner.release();
    }
  }

  async signIn(userDTO: UserDTO): Promise<{ accessToken: string }> {
    const { username, password } = userDTO;
    const user = await this.userRepository.findOne({
      where: {
        username: username,
      } as FindOptionsWhere<User>,
    });

    if (user && password === user.password) {
      const payload = { username };
      const accessToken = this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('존재하지 않는 사용자입니다.');
    }
  }

  async validateUser(username: string): Promise<User> {
    try {
      const user = await this.userRepository.findOneOrFail({
        where: { username },
      });
      if (!user) {
        throw new UnauthorizedException();
      }

      return user;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException();
    }
  }

  async findOneByIdWithAccount(id: number) {
    return await this.userRepository.findOne({
      relations: { account: true },
      where: { id },
    });
  }

  async findOneByAccountIdWithAccount(accountId: string) {
    return await this.userRepository.findOne({
      relations: { account: true },
      where: { account: { accountId } },
    });
  }
}
