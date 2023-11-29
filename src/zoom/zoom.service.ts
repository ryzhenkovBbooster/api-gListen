import {Injectable} from '@nestjs/common';
import * as crypto from 'crypto'
import * as fs from "fs";
import axios from "axios";

import {RedisService} from "../redis/redis.service";


@Injectable()
export class ZoomService {

    private readonly zoomSecret: string = "InVxdBkUTOCuI3HGwHOYIA"

    async helloWorld() {
        return await 'hello'
    }

    constructor(private readonly redis: RedisService) {
    }


    async validateZoomWebhook(plainToken: string) {

        // const hmac = crypto.createHmac('sha256', Buffer.from(this.zoomSecret, 'base64'));
        // hmac.update(plainToken);
        // const encryptedToken = hmac.digest('hex');
        const hmac = crypto.createHmac('sha256', this.zoomSecret);
        hmac.update(plainToken);
        const encryptedToken = hmac.digest('hex');

        return await {
            plainToken: plainToken,
            encryptedToken: encryptedToken,
        };
    }


    async saveLog(responce: any) {
        try {
            const log = JSON.stringify(responce) + '\n'
            return await fs.promises.appendFile('zoom-log.txt', log)
        } catch (e) {

            return await fs.promises.appendFile('zoom-log.txt', responce + '\n')

        }
    }


    async downloadVideo(url: string, filePath: string) {
        try {


            const response = await axios.get(url, {
                responseType: 'stream'
            })


            // const finished = promisify(stream.finished);
            const writer = fs.createWriteStream(filePath)

            response.data.pipe(writer)
            await new Promise((resolve, reject) => {
                writer.on('finish', resolve);
                writer.on('error', reject);
            });
            const stats = fs.statSync(filePath);
            if (stats.size < 10 * 1024 * 1024) {
                // Если размер файла меньше 10 МБ, удаляем его
                fs.unlinkSync(filePath);
                return 'small';
            }


            return true

        } catch (error) {
            await this.saveLog("false_load_file_to_localMachine" + error)

            return false
        }

    }

    async deleteRecord(meetingId: string, filePath: string) {
        const accessToken = 'eyJzdiI6IjAwMDAwMSIsImFsZyI6IkhTNTEyIiwidiI6IjIuMCIsImtpZCI6IjNkOTczNDJjLWY0MzMtNDFkYi05ZDhmLTQ5ODEwNDdlNmE3ZSJ9.eyJhdWQiOiJodHRwczovL29hdXRoLnpvb20udXMiLCJ1aWQiOiJUWHdkWkNtRFF0Mjh4SHlLOGJ2WmJ3IiwidmVyIjo5LCJhdWlkIjoiNjc4MWUzYzAxMzBkOTI0MTliNzVjNTExMzYzYjdkMDAiLCJuYmYiOjE2OTk5NzU0MjgsImNvZGUiOiJmN3Q0T3dLQVJPT3dGeTJjLTdTQnJnNTFoNkNIVlpmeU8iLCJpc3MiOiJ6bTpjaWQ6VFh0Wk9KQ1dSR04xSkJuQk41RzRnIiwiZ25vIjowLCJleHAiOjE2OTk5NzkwMjgsInR5cGUiOjMsImlhdCI6MTY5OTk3NTQyOCwiYWlkIjoiMzZpa3dDUHlRN0t1bDJMbmdDMXpHUSJ9.wupmgsz6Y47Jitk0vTwJNs-Nfo4x7OhUJGKczehCPQRZjvylxAlzy2Wp4aXR3_KyJY0B7glwAvKXrRPHP_W_GQ'
        const url = `https://api.zoom.us/v2/meetings/${meetingId}/recordings?action=trash`
        try {
            await axios.delete(url, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })


        } catch (err) {
            if (err.response && err.response.status === 401) {
                let newToken = await this.updateToken()
                newToken = newToken.replace(/\s+/g, '');
                await axios.delete(url, {
                    headers: {
                        'Authorization': `Bearer ${newToken}`
                    }
                })

            } else {
                await this.saveLog("false_delete_record_on_zoom: " + err)
                return false
            }


        }
        try {
            await fs.promises.unlink(filePath)
            return true
        } catch (err) {

            await this.saveLog("false_delete_record_on_localmachine" + err)
            return false

        }
    }

    private async updateToken() {
        var url = "https://zoom.us/oauth/token";
        var CLIENT_ID = "TXtZOJCWRGN1JBnBN5G4g";
        var CLIENT_SECRET = "6dgymG1QMu2VerJZHgskAndTEcznNGin";

        const base64Credentials = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
        const authorizationHeader = `Basic ${base64Credentials}`;

        try {
            const params = {
                grant_type: "account_credentials",
                account_id: "36ikwCPyQ7Kul2LngC1zGQ"
            }
            const res = await axios.post(url, params, {
                headers: {
                    "Authorization": authorizationHeader,
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            });

            if (res) {
                return res.data.access_token;
            }
        } catch (err) {
            // Обработка ошибок
            throw err;
        }
    }

    async checkInCache(uuid) {
        const cacheData = await this.redis.get(uuid)
        console.log(cacheData)

        if (cacheData) {
            return true
        } else {

            await this.redis.set(uuid, 'cashed', 7200)
            return false
        }
    }
}
