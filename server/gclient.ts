

import dotenv from 'dotenv';
import {google} from 'googleapis';
import { gmail } from 'googleapis/build/src/apis/gmail';
import { Http2ServerRequest } from 'http2';
import https from 'https'
import {enableProxyAgent} from './proxy.js'
dotenv.config();
enableProxyAgent();
const gmail_config = {
    'redirect_uri': 'http://localhost:6789',
    'scope': 'https://www.googleapis.com/auth/userinfo.email',
    client_id : process.env.GOOGLE_CLIENT_ID,
    client_secret : process.env.GOOGLE_CLIENT_SECRET
}

if(gmail_config.client_id == undefined || gmail_config.client_secret == undefined){
    console.log('please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env file');
    process.exit(1);
}



const baseUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
var params = {'client_id': gmail_config.client_id,
    'redirect_uri': gmail_config.redirect_uri,
    'response_type': 'token',
    'scope': gmail_config.scope,
    'include_granted_scopes': 'true',
    'state': 'pass-through value'
};

const url = new URL(baseUrl);
url.search = new URLSearchParams(params).toString();

let auth_url = url.toString();


// Parameters to pass to OAuth 2.0 endpoint.

console.log('auth url',auth_url);
// fetch(auth_url,{
//     method: 'GET',
//     headers: {
//         "Referer":"http://localhost:6789",
//     }});

async function get_token(url){
    
    let ret = await fetch(url,{
        method: 'GET',
        headers: {
            "Referer":"http://localhost:6789",
            "Accept": "application/json"
        }});
    console.log('code auth url return :',ret)

    let ret_obj = await ret.json()

    console.log('token parent obj' , ret_obj);
}

// get_token(get_token);

//# redirect url
let tokenType = "Bearer"
let access_token = 'ya29.a0ARW5m760Y1CRkSsdjQp9uDoUYwzbrqmFQAJjRYNNVwNdX2XEkr8aS1tg25ryC2kuSjvIav3zpOV_DHv-Z8BEJxT9L9kvCyBrJwr8BZ1157QE1-r0KDeZXA2UDO5b5B9F8SrjuSgbRQS4O9IY9naVd9oodAcrR9whEQaCgYKARESARASFQHGX2Mi9NtTyaR_7zB1kz7ygXlmtA0169'
let expires_in = 3599

// redirect 

async function getUserEmail(tokenType,token) {
    ////const userInfoUrl = 'https://www.googleapis.com/oauth2/v2/userinfo';
    var options = {        
        hostname: 'www.googleapis.com',
        port: 443,
        path: '/oauth2/v2/userinfo',
        method: 'GET',
        headers:{
            Authorization: 'Bearer ${token}'            
        }
    };
    

    const req = https.request(options, (res) => {
        console.log('statusCode:', res.statusCode);
        console.log('headers:', res.headers);

        res.on('data', (d) => {
        process.stdout.write(d);
        });
    });
}



async function getUserEmail2(tokenType,token) {
    const userInfoUrl = 'https://www.googleapis.com/oauth2/v2/userinfo';
    let ret = await fetch(userInfoUrl,{
        method: 'GET',
        headers: {
            Authorization: 'Bearer ${token}' 
        }});
    
    console.log("email ret:", await ret.text());

}




getUserEmail2(tokenType,access_token);

