import {forwardRef, Module} from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "./user.model";
import {AuthModule} from "../auth/auth.module";

@Module({
  providers: [UserService],
  controllers: [UserController],
  imports: [
      SequelizeModule.forFeature([
          User
      ]),
      forwardRef(() => AuthModule)
  ],
    exports: [
        UserService
    ]
})
export class UserModule {}
