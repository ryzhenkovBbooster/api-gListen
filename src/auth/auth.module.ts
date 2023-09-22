import {forwardRef, Module} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {UserModule} from "../user/user.module";
import {JwtModule} from "@nestjs/jwt";
import * as process from "process";

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [
      forwardRef(() => UserModule),
      JwtModule.register({
        secret: process.env.PRIVATE_KEY || 'secret',
        signOptions: {
          expiresIn: '24h'
        }
      })
  ],
  exports: [
      AuthService,
      JwtModule
  ]
})
export class AuthModule {}
