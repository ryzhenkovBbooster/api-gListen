import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {Accounts} from "./accounts.model";
import {InjectModel} from "@nestjs/sequelize";
import {AddAccDto} from "./dto/add-acc.dto";


@Injectable()
export class AccountsService {
    constructor(@InjectModel(Accounts) private accRepository: typeof Accounts) {}

    async addAcc(dto: AddAccDto){

        const acc = await this.accRepository.findOne({ where: {email: dto.email, fullName: dto.fullName} })
        if (acc){
            throw new HttpException('Такой аккаунт уже есть в базе', HttpStatus.BAD_REQUEST)
        }else{
            return await this.accRepository.create(dto)
        }
    }

    async getAllAcc(){
        return await this.accRepository.findAll()
    }


    async getByEmail(email: string){
        return await this.accRepository.findOne({where: {email}})
    }

    async putData(dto: AddAccDto){
        const account = await this.accRepository.update(dto,{
            where:
                {email: dto.email, fullName: dto.oldName}
        })
        if(account){
            return account
        }else{
            throw new HttpException('Такого аккаунта нет в базе', HttpStatus.BAD_REQUEST)

        }

    }
}
