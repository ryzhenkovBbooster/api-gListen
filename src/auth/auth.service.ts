import {HttpException, HttpStatus, Injectable, UnauthorizedException} from '@nestjs/common';
import * as bcrypt from 'bcrypt'
import {UserService} from "../user/user.service";
import {JwtService} from "@nestjs/jwt";
import {CreateUserDto} from "../user/dto/create-user.dto";

@Injectable()
export class AuthService {

    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) {}

    async login(dto: CreateUserDto){

        const user = await this.validateUser(dto)
        return this.generateToken(user)


    }

    async registration(dto : CreateUserDto){
        console.log(dto.email)
        const candidate = await this.userService.getUserByEmail(dto.email);

        if (candidate){
            throw new HttpException('Пользователь с таким email уже существует', HttpStatus.BAD_REQUEST)
        }
        const hashPassword = await bcrypt.hash(dto.password, 5);
        const user = await this.userService.createUser({...dto, password: hashPassword})

        // console.log(await this.profileService.createProfile({...userDto, password: hashPassword}))
        return this.generateToken(user)


    }
    private async generateToken(user){
        //не видит email
        const payload = {email: user.email, id:user.id};
        return {
            token: this.jwtService.sign(payload)
        }
    }

    private async validateUser (dto: CreateUserDto){
        const user = await this.userService.getUserByEmail(dto.email);
        const passwordEquals = await bcrypt.compare(dto.password, user.password);
        if (user && passwordEquals){
            return user;
        }
        throw new UnauthorizedException({message:'Некоректный mail или password'})
    }
}
