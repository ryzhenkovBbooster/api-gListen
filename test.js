const axios = require('axios')

async function deleteRecord(meetingId, recordId){
    const accessToken = '.eyJhdWQiOiJodHRwczovL29hdXRoLnpvb20udXMiLCJ1aWQiOiJUWHdkWkNtRFF0Mjh4SHlLOGJ2WmJ3IiwidmVyIjo5LCJhdWlkIjoiZjQxZDYzNmNkOTVlNGQ1YTBiMTZiNjhhMjI3YWI0N2UiLCJuYmYiOjE3MDAwNDE1MDcsImlzcyI6InptOmNpZDpUWHRaT0pDV1JHTjFKQm5CTjVHNGciLCJnbm8iOjAsImV4cCI6MTcwMDA0NTEwNywidHlwZSI6MiwiaWF0IjoxNzAwMDQxNTA3fQ.h2NUPVQZ1NRkI0DOX4F09GJcq1j98IFaY6MQtzUCFNgfvKUqXVK19cHxv3qt7jHRtAO9api8fNAfiMPguyK9Lw'
    const url = `https://api.zoom.us/v2/meetings/${meetingId}/recordings/${recordId}`
    try {
        const res = await axios.delete(url, {
            headers:{
                'Authorization': `Bearer ${accessToken}`
            }
        })

    }catch (err){
        if(err.response && err.response.status === 401){
            const newToken = await updateToken()
            await axios.delete(url, {
                headers:{
                    'Authorization': `Bearer ${newToken}`
                }
            })


        }else{
            console.log(err.response.data)
        }
        // await this.saveLog("false_delete_record_on_zoom: " + err)

    }
}

async function updateToken() {
    var url = "https://zoom.us/oauth/token";
    var CLIENT_ID = "TXtZOJCWRGN1JBnBN5G4g";
    var CLIENT_SECRET = "6dgymG1QMu2VerJZHgskAndTEcznNGin";

    const base64Credentials = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
    const authorizationHeader = `Basic ${base64Credentials}`;
    const params = {
        grant_type: "account_credentials",
        account_id: "36ikwCPyQ7Kul2LngC1zGQ"
    };
    try {
        const res = await axios.post(url, params, {
            headers: {
                "Authorization": authorizationHeader,
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });

        if (res) {
            console.log(res.data.access_token)
            return res.data.access_token;
        }
    } catch (err) {
        // Обработка ошибок
        throw err;
    }
}

// deleteRecord(86204006259, 'd0242b13-ed5b-4cf9-b01c-84ee8af883f7')
// updateToken()
// sessionResponse()




async function getMeeting(){
    const url = 'https://api.zoom.us/v2/meetings/85225601974/recordings'
    let token = await updateToken()
    token = token.replace(/\s+/g, '')
    const res = await axios.get(url, {
        headers:{
            'Authorization': `Bearer ${token}`
        }
    })
    if (res){
        console.log(res.data)
    }

}
async function getAllUsers(){
    const url = 'https://api.zoom.us/v2/users'
    let token = await updateToken()
    token = token.replace(/\s+/g, '')
    const res = await axios.get(url, {
        headers:{
            'Authorization': `Bearer ${token}`
        }
    })
    if (res){
        console.log(res.data)
    }
}
getMeeting()