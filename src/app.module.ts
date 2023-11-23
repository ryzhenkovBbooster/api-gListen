import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {ConfigModule} from "@nestjs/config";
import { UserModule } from './user/user.module';
import {User} from "./user/user.model";
import { AuthModule } from './auth/auth.module';
import { AccountsModule } from './accounts/accounts.module';
import { ZoomModule } from './zoom/zoom.module';

import { RedisModule } from './redis/redis.module';
import {RedisService} from "./redis/redis.service";


@Module({
  imports: [
      ConfigModule.forRoot({
            envFilePath: `.env`


      }),




      SequelizeModule.forRoot({
          dialect: 'postgres',
          host: process.env.POSTGRES_HOST,
          port: Number(process.env.POSTGRES_PORT),
          username: process.env.POSTGRES_USER,
          password: process.env.POSTGRES_PASSWORD,
          database: process.env.POSTGRES_DB,
          models: [User],
          autoLoadModels: true,
      }),
      UserModule,
      AuthModule,
      AccountsModule,
      ZoomModule,
      RedisModule,


  ],
  controllers: [AppController],
  providers: [AppService, RedisService],
    exports: [
        RedisService
    ]
})
export class AppModule {}
