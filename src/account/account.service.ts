/* eslint-disable */
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, QueryRunner } from 'typeorm';
import { Account } from './entity/account.entity';
import { depositDto } from './dto/deposit.dto';
import { transferDto } from './dto/transfer.dto';
import { User } from 'src/auth/entity/user.entity';

@Injectable()
export class AccountService {
  constructor(
    private readonly dataSource: DataSource, // queryRunner 객체

    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async createAccount(user: User, queryRunner: QueryRunner): Promise<Account> {
    const account = new Account();
    account.user = user; // 유저와 연결
    account.accountId = this.generateAccountId(); // 랜덤 계좌번호 생성
    account.balance = 0; // 초기 잔액

    // 트랜잭션을 통해 계좌 저장
    return await queryRunner.manager.save(account);
  }

  private generateAccountId(): string {
    const accountId = Math.floor(
      10000000 + Math.random() * 90000000,
    ).toString(); //랜덤 8자리 계좌번호 생성
    return accountId;
  }

  async getBalance(
    user: User,
  ): Promise<{ success: boolean; message: string; balance: number }> {
    // 잔액조회
    const account = await this.accountRepository.findOne({
      where: { id: user.id },
    });
    if (!account) throw new NotFoundException('계좌가 없습니다.');
    return {
      success: true,
      message: '잔액 조회 성공',
      balance: account.balance,
    };
  }

  async deposit(
    user: User,
    depositDTO: depositDto,
  ): Promise<{ success: boolean; message: string; balance: number }> {
    // 입금
    const { amount } = depositDTO;
    if (amount <= 0)
      throw new BadRequestException('입금액은 0보다 커야합니다.');

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction(); // 트랜잭션 시작

    try {
      const accountRepository = queryRunner.manager.getRepository(Account);
      const account = await accountRepository.findOne({
        where: { user: { id: user.id } },
      });
      if (!account) throw new NotFoundException('계좌가 없습니다.');

      account.balance += amount;
      await accountRepository.save(account);
      await queryRunner.commitTransaction();

      return {
        success: true,
        message: '입금 성공',
        balance: account.balance,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('입금 실패');
    } finally {
      await queryRunner.release();
    }
  }

  async transfer(
    user: User,
    transferDTO: transferDto,
  ): Promise<{ success: boolean; message: string; balance: number }> {
    const { toAccountId, amount } = transferDTO;
    if (amount <= 0)
      throw new BadRequestException('송금액은 0보다 커야합니다.');

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const senderAccount = await queryRunner.manager.findOne(Account, {
        where: { id: user.id },
      });
      if (!senderAccount) throw new NotFoundException('송금 계좌가 없습니다.');
      if (senderAccount.balance < amount)
        throw new BadRequestException('잔액이 부족합니다.');

      const receiverAccount = await queryRunner.manager.findOne(Account, {
        where: { accountId: toAccountId },
      });
      if (!receiverAccount)
        throw new NotFoundException('수신 계좌가 없습니다.');

      senderAccount.balance -= amount;
      receiverAccount.balance += amount;

      await queryRunner.manager.save(senderAccount);
      await queryRunner.manager.save(receiverAccount);
      await queryRunner.commitTransaction(); // 완료되면 트랜잭션 커밋

      return {
        success: true,
        message: '송금 성공',
        balance: senderAccount.balance,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction(); // 오류나면 롤백
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('송금 실패');
    } finally {
      await queryRunner.release(); // 트랜잭션 해제
    }
  }
}
