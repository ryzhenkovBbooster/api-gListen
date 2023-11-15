// import {google} from "googleapis";
// import path from "path";
// import { promises as fs } from 'fs';
const {google}= require('googleapis')

const path = require('path')
const fs= require('fs').promises




const CREDENTIALS_PATH = path.join(process.cwd(), 'api google drive\\creds.json');

const TOKEN_PATH = path.join(process.cwd(), 'api google drive\\token.json');

const SCOPES = ['https://www.googleapis.com/auth/drive'];
async function oauth() {
    let credentials;
    let token;

    try {
        const credentialsData = await fs.readFile(CREDENTIALS_PATH, );
        credentials = JSON.parse(credentialsData);
    } catch (error) {
        throw new Error(`Ошибка при чтении файла учетных данных: ${error.message}`);
    }

    const { client_id, client_secret, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    try {
        if (await fs.stat(TOKEN_PATH)) {
            const tokenData = await fs.readFile(TOKEN_PATH, );
            token = JSON.parse(tokenData);
            oAuth2Client.setCredentials(token);
        }
    } catch (error) {
        throw new Error(`Токен аутентификации не найден: ${error.message}`);
    }

    return oAuth2Client;
}

async function loadSavedCredentialsIfExist() {
    try {
        const content = await fs.readFile(TOKEN_PATH);
        const credentials = JSON.parse(content);
        return google.auth.fromJSON(credentials);
    } catch (err) {
        return null;
    }
}
exports.auth = oauth