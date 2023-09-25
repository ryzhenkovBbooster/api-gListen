import { Injectable } from '@nestjs/common';
import {Accounts} from "./accounts.model";
import {InjectModel} from "@nestjs/sequelize";
import {AddAccDto} from "./dto/add-acc.dto";

@Injectable()
export class AccountsService {
    constructor(@InjectModel(Accounts) private accRepository: typeof Accounts) {}

    async addAcc(dto: AddAccDto){
        return await this.accRepository.create({...dto})
    }

    async getAllAcc(){
        return await this.accRepository.findAll()
    }
}
