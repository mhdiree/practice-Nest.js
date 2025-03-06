import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigProjectModule } from './config-project/config-project.module';
import { MysqlSequelizeModule } from './mysql_sequelize/mysql_sequelize.module';

@Module({
  imports: [AuthModule, UserModule, ConfigProjectModule, MysqlSequelizeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
