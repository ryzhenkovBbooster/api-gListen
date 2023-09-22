import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {User} from "./user.model";
import {CreateUserDto} from "./dto/create-user.dto";

@Injectable()
export class UserService {
    constructor(@InjectModel(User) private userRepository: typeof User) {}

    async createUser(dto: CreateUserDto){

        return  await this.userRepository.create({...dto})


    }

    async getAllUsers(){
        return await this.userRepository.findAll()
    }


    async getUserByEmail(email: string){

        const user = await this.userRepository.findOne({ where: {email}, include: {all: true} })
        console.log(user)
        return user
    }
}
