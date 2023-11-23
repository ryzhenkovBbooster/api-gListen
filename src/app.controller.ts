import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller("kek")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(){
    const cache = await this.appService.getHello()
    if (cache != false){
      return cache
    }else{
      return false
    }
  }
}
