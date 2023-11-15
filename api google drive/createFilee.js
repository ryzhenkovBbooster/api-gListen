
const auth = require("./auth/auth")
const {google} = require('googleapis')
const {GoogleAuth} = require('google-auth-library')
const fs = require('fs')

async function createFolder(name, parentFolderid){
    const check = await checkFolder(name, parentFolderid)
    // console.log(check)
    if (!check){
        const client = await auth.auth()
        const drive = google.drive({version: 'v3', auth: client});
        const fileMetadata = {
            'name': name,
            'mimeType': 'application/vnd.google-apps.folder',
            // ...(parentFolderId && { parents: [parentFolderid] })
            'parents': [parentFolderid]

        };
        try {
            const folder = await drive.files.create({
                requestBody: fileMetadata,
                fields: 'id',
                supportsAllDrives: true

            })
            // console.log(folder)
            return  folder.data
        }catch (err){
            err = 'false_create_folder_on_googleDrive: ' + err
            const log = JSON.stringify(err) + '\n'
            await fs.promises.appendFile('zoom-log.txt', log)
            return false

        }
    }else{
        return check
    }

}
async function createFile(filePath, fileName, folderId){
    const client = await auth.auth()
    const drive = google.drive({version: 'v3', auth: client});

    const fileMetadata = {
        'name': fileName,
        'parents': [folderId['id']]
    };
    const media = {
        mimeType: 'video/mp4',
        body: fs.createReadStream(filePath)
    }
    try {
        const file = await drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id, webViewLink',
            supportsAllDrives: true

        })
        return file.data
    }catch (err){
        err = 'false_load_to_googleDrive: ' + err
        const log = JSON.stringify(err) + '\n'
        await fs.promises.appendFile('zoom-log.txt', log)
        return false
    }
}

async function checkFolder(name, parentFolderId){
    const client = await auth.auth()

    const drive = google.drive({version: 'v3', auth: client});
    const query = "name = '2023-11-15T08-58-26Z RC CAO HD1' and mimeType = 'application/vnd.google-apps.folder'";
    // const query = `mimeType = 'application/vnd.google-apps.folder' and name = '${name}'` +
    //     ` ${parentFolderId ? ` and '${parentFolderId}' in parents` : ''}`;
    try {
        const exist = await drive.files.list({
            q: query,
            supportsAllDrives: true,
            fields: 'files(id, name, parents, mimeType, trashed)'
        })
        if (exist.data.files.length > 0 )  {
            return {id: exist.data.files}
        }else return false
    }catch (err){
        err = 'false_checkFolder_in_parent_fodler: ' + err
        const log = JSON.stringify(err) + '\n'
        await fs.promises.appendFile('zoom-log.txt', log)
        return false
    }
}

exports.createFile = createFile
exports.createFolder = createFolder




async function getFolder(){
    const client = await auth.auth()
    // const client = new GoogleAuth({
    //     scopes: 'https://www.googleapis.com/auth/drive'
    // })
    const drive = google.drive({version: 'v3', auth: client});
    const params = {

    }
    try {
        const folder = await drive.files.get({
            fileId: '1w76ehmSycFgMveQ-QFuLdu1MkiFL-KeX',
            supportsAllDrives: true

        })
        console.log(folder.data)
    }catch (error){

        console.error('Ошибка при создании папки:', error.message);
    }

}

//
// async function getPermis(){
//     const client = await auth.auth()
//     const drive = google.drive({version: 'v3', auth: client});
//     const res = await drive.permissions.list({
//         fileId: '13f6uqWY_V9vf-3EB5HZtK8VvTDgejAqm',
//         supportsAllDrives: true,
//         fields: 'permissions(id, type, role, emailAddress)'
//
//     })
//     console.log(res.data)
// }
// // getFolder()
//
// exports.getPermis = getPermis