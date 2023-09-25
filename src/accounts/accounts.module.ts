import {forwardRef, Module} from '@nestjs/common';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {Accounts} from "./accounts.model";
import {AuthModule} from "../auth/auth.module";

@Module({
  controllers: [AccountsController],
  providers: [AccountsService],
  imports: [
      SequelizeModule.forFeature([
          Accounts
      ]),
      AuthModule
  ]

})
export class AccountsModule {}
