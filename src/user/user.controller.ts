import {Body, Controller, Get, Post, UseGuards} from '@nestjs/common';
import {UserService} from "./user.service";
import {CreateUserDto} from "./dto/create-user.dto";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    // @Post('/ac')
    // async createAccount(@Body() dto: CreateUserDto){
    //     return await this.userService.createUser(dto)
    // }
    @UseGuards(JwtAuthGuard)
    @Get('/ac')
    async getAllAccounts(){
        return await this.userService.getAllUsers()
    }
}
