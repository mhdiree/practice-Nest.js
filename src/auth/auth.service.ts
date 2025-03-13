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

  async signUp(
    userDTO: UserDTO,
  ): Promise<{ success: boolean; message: string }> {
    try {
      await this.createUser(userDTO);
      return { success: true, message: '회원가입 성공' };
    } catch (error) {
      if (error instanceof ConflictException) {
        return { success: false, message: '이미 존재하는 사용자입니다.' };
      }
      throw new InternalServerErrorException('회원가입 중 오류가 발생했습니다.');
    }
  }

  async createUser(userDTO: UserDTO): Promise<void> {
    const existingUser = await this.userRepository.findOne({ where: { username: userDTO.username } });
    if (existingUser) {
      throw new ConflictException();
    }
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
    } catch (error) {
      await queryRunner.rollbackTransaction(); // 트랜잭션 롤백
      console.log(error);
      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }
  }

  async signIn(
    userDTO: UserDTO,
  ): Promise<{ success: boolean; message: string; accessToken: string }> {
    const { username, password } = userDTO;
    const user = await this.userRepository.findOne({
      where: {
        username: username,
      } as FindOptionsWhere<User>,
    });

    if (user && password === user.password) {
      const payload = { username };
      const accessToken = this.jwtService.sign(payload);
      return { success: true, message: '로그인 성공', accessToken };
    }
    throw new UnauthorizedException('존재하지 않는 사용자입니다.');
  }

  async validateUser(username: string): Promise<User> {
    try {
      const user = await this.userRepository.findOneOrFail({
        where: { username },
      });
      return user;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException("사용자가 존재하지 않습니다.");
    }
  }

  async getProfile(
    user: User,
  ): Promise<{ success: boolean; message: string; user?: any }> {
    if (!user) {
      throw new UnauthorizedException('인증되지 않은 사용자');
    }

    const userWithAccount = await this.findOneByIdWithAccount(user.id);

    if (!userWithAccount) {
      return { success: false, message: '사용자를 찾을 수 없습니다.' };
    }

    return {
      success: true,
      message: '사용자 정보 조회 성공',
      user: {
        id: userWithAccount.id,
        username: userWithAccount.username,
        accountId: userWithAccount.account?.accountId,
      },
    };
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
