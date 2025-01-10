import dotenv from 'dotenv';
import {google} from 'googleapis';
///import {enableProxyAgent} from './proxy.js'
dotenv.config();





////enableProxyAgent();
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'http://localhost:6789',
);

// generate a url that asks permissions for Blogger and Google Calendar scopes
const scopes = [
  'https://www.googleapis.com/userinfo.email',
];

let url = oauth2Client.generateAuthUrl({
  // 'online' (default) or 'offline' (gets refresh_token)
  access_type: 'online',

  // If you only need one scope, you can pass it as a string
  scope: scopes
});

url = encodeURI(url);
console.log("auth url",url);

let ret = await fetch(url,{
    method: 'POST',
    headers: {
        "Referer":"http://localhost:6789",
        "Accept": "application/json"
    }});
console.log('code ret:',ret)

//const {tokens} = await oauth2Client.getToken(code)
//oauth2Client.setCredentials(tokens);
