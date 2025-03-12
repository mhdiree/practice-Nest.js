import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entity/account.entity';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "jwt"}),
    TypeOrmModule.forFeature([Account]),
  ],
  controllers: [AccountController],
  providers: [AccountService],
  exports: [AccountService]
})
export class AccountModule {}
