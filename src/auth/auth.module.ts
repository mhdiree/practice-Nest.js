import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { User } from './entity/user.entity';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { AccountController } from 'src/account/account.controller';
import { AccountService } from 'src/account/account.service';
import { AccountModule } from 'src/account/account.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "jwt"}),
    JwtModule.register({
      secret: "SECRET",
      signOptions: {
        expiresIn: '1h'
      }
    }),
    AccountModule,
    TypeOrmModule.forFeature([User])],
  controllers: [ AuthController ],
  providers: [
    AuthService,
    JwtStrategy,
  ],
  exports: [ JwtModule, PassportModule, AuthService],
})
export class AuthModule {}