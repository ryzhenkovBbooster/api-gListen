import {Body, Controller, Post} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {CreateUserDto} from "../user/dto/create-user.dto";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/login')
    async login(@Body() dto: CreateUserDto){
        return this.authService.login(dto)
    }

    @Post('/register')
    async register(@Body() dto: CreateUserDto){
        return this.authService.registration(dto)
    }
}
