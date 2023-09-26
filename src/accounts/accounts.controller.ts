import {Body, Controller, Get, Post, Put, UseGuards} from '@nestjs/common';
import {AccountsService} from "./accounts.service";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {AddAccDto} from "./dto/add-acc.dto";

@Controller('accounts')
export class AccountsController {
    constructor(private accService: AccountsService) {}
    @UseGuards(JwtAuthGuard)
    @Post('')
    async addAccs(@Body() dto: AddAccDto){
        return await this.accService.addAcc(dto)
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getAllAccs(){
        return await this.accService.getAllAcc()
    }

    @UseGuards(JwtAuthGuard)
    @Put()
    async updateAcc(@Body() dto: AddAccDto){
        return await this.accService.putData(dto)
    }
}
