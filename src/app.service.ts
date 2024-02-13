import {Inject, Injectable} from '@nestjs/common';
import * as process from "process";
import axios from "axios";


@Injectable()
export class AppService {
  constructor() {
  }
  async getHello() {

    return true
  }
  async  sendMessageInTelegram (message){
    const TOKEN = process.env.TELEGRAM_TOKEN
    const chat_id = process.env.CHAT_ID
    const url = `https://api.telegram.org/bot${TOKEN}/sendMessage`
    try{
      const response = await axios.post(url, {
        chat_id: chat_id,
        text: message

      })
      return response
    }catch (e){
      return 'err'
    }
  }
  async scrap(URLS){
    let data = []
    for (let url of URLS){
      try {
        const response = await axios.get(url)
        if (response.status === 200){
          const html = response.data

          const content = html.match(/нет в наличии/i);
          if(content){
            data.push({
              "false": url
            })
          }else data.push({
            "true": url
          })
        }
      }catch (e){
        console.log(e)
      }
    }
    return data
  }



}
