import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { User } from './entity/user.entity';
import { UserRepository } from './repository/user.repository';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "jwt"}),
    JwtModule.register({
      secret: "SECRET",
      signOptions: {
        expiresIn: '1h'
      }
    }),
    TypeOrmModule.forFeature([User])],
  controllers: [ AuthController ],
  providers: [
    {
      provide: UserRepository, 
      useFactory: (dataSource: DataSource) => new UserRepository(dataSource),
      inject: [DataSource],
    },
    AuthService,
    JwtStrategy,
  ],
  exports: [UserRepository, JwtModule, PassportModule],
})
export class UserModule {}