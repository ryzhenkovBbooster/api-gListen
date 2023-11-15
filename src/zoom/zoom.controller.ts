import {Body, Controller, Get, Post, Res} from '@nestjs/common';
import {ZoomService} from "./zoom.service";
import { Response } from 'express';

import {dirPath} from "./dto/downloadFile";
import {createFile} from "../../api google drive/createFilee.js"
import {createFolder} from "../../api google drive/createFilee.js"

import * as path from "path";



@Controller('zoom')
export class ZoomController {
    constructor(private readonly zoomService: ZoomService) {}

    @Get()
    async hello(){
        return await this.zoomService.helloWorld()
    }

    @Post('validate')
    async checkValidate(@Body() body: any, @Res() res: Response){
        if (body.event === 'endpoint.url_validation'){
            const response = await this.zoomService.validateZoomWebhook(body.payload.plainToken)
            await this.zoomService.saveLog(body)
            return await res.status(200).json(response)

        }
        if (body.event === "recording.completed" && dirPath.hasOwnProperty(body.payload.object.account_id)){
            let filename = `${body.payload.object.start_time} ` + `${body.payload.object.topic}`
            const account_id = body.payload.object.account_id
            filename = filename.replace(/:/g, '-').replace(/[\/\\]/g, ' ');
            const folder_id = await  createFolder(filename, dirPath[account_id][1])
            if(folder_id){
                for(let file of body.payload.object.recording_files){
                    if(file.download_url){
                        const url = file.download_url
                        // console.log(dirPath[account_id][1])
                        await this.zoomService.saveLog( body)

                        const filePath= path.join(process.cwd(), '/static') + `/${filename}.mp4`;

                        const local_file = await this.zoomService.downloadVideo(url, filePath)
                        if (local_file){

                            const drive_file = await createFile(filePath, filename+'.mp4', folder_id)
                            if (drive_file){
                                const meetingId = body.payload.object.id
                                const recordId = file.id
                                const deleteRecord = await this.zoomService.deleteRecord(meetingId, recordId, filePath)
                                if (deleteRecord){
                                    return await res.status(200).json({err: false})


                                }else return await res.status(404).json({err: 'deleteRecord'})

                            }else return await res.status(404).json({err: 'drivefile'})
                        }else return await res.status(404).json({err: 'localfile'})

                        // await this.zoomService.downloadVideo(url, filePath)


                    }else return await res.status(404).json({err: true})
                }
            }else return await res.status(404).json({err: 'create folder'})

            // const filePath = dirPath[account_id][0] + filename

        }

    }
}
