

import dotenv from 'dotenv';
import {google} from 'googleapis';
import { gmail } from 'googleapis/build/src/apis/gmail';
///import {enableProxyAgent} from './proxy.js'
dotenv.config();

gmail_config = {
    'redirect_uri': 'http://localhost:6789',
    'scope': 'https://www.googleapis.com/auth/userinfo.email',
    client_id : process.env.GOOGLE_CLIENT_ID,
    client_secret : process.env.GOOGLE_CLIENT_SECRET
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
fetch(auth_url,{
    method: 'GET',
    headers: {
        "Referer":"http://localhost:6789",
        "Accept": "application/json"
    }});

async function get_token(auth_url){

    let ret = await fetch(url,{
        method: 'POST',
        headers: {
            "Referer":"http://localhost:6789",
            "Accept": "application/json"
        }});
    console.log('code auth url return :',ret)

    let ret_obj = await ret.json()

    console.log('token parent obj' , ret_obj);
}

get_token();