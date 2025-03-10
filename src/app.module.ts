import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'entity/user.model';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { UserRepository } from './auth/repository/user.repository';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './auth/jwt.strategy';
import { EventsModule } from './events/events.module';
import { EventsGateway } from './events/events.gateway';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path'; 

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),  // public 폴더를 루트로 설정
    }),
    PassportModule.register({ defaultStrategy: "jwt"}),
    JwtModule.register({
      secret: "SECRET",
      signOptions: {
        expiresIn: '1h'
      }
    }),
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV == 'dev' ? '.env.dev' : '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWD,
      database: process.env.DB_DATABASE,
      entities: [__dirname + "/**/*.entity{.ts,.js}"],
      synchronize: true,
      logging: true,
    }),
    EventsModule,
   ],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService, UserRepository, JwtStrategy, /*EventsGateway*/ ],
})
export class AppModule {}
