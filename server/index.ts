import express from 'express';
import { faucet,clearDaily,regist_github,github_faucet } from './faucet';
import dotenv from 'dotenv'
import cors from 'cors'
import {ViteDevServer,ProxyOptions} from 'vite'
import {faucet_config} from '../common/config'
import { enableProxyAgent } from 'proxy';
import path from 'path'
import axios from 'axios'
import { emitWarning } from 'process';


dotenv.config()
// DOTENV later
const clientId = process.env.clientId
const clientSecret = process.env.clientSecret
const MNEMONIC = process.env.MNEMONIC

if(!clientId || !clientSecret || !MNEMONIC ){
	console.log('set clientId or clientSecret MNEMONIC in ENV first');
	exit(-1)
}



const app = express();


interface ReqData  {  
  FixedAmountRequest: {
      recipient: string
  }
};

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post('/v1/gas', (req, res) => {
  if(req.header('Content-Type')  == 'application/json'){
    console.log('body:' + req.body as unknown as string);
    let data:ReqData = req.body;

    let ret = faucet(data.FixedAmountRequest.recipient)
    ret.then(function(result) {
      console.log(result);
      res.json(result);
    }, function(err) {
      console.log(err);
      res.json(err);
    });
    console.log(data);
  } else{
    console.log("error Content-Type,header:" + req.headers);
  }
    
});


app.get('/v1/gas', (req, res) => {
    let recipient = req.query['recipient'] as unknown as string
    console.log('recipient=',recipient);
    let ret = faucet(recipient)
    ret.then(function(result) {
      console.log(result);
      res.json(result);
    }, function(err) {
      console.log(err);
      res.json(err);
    });
    
});

const msg = `request faucet sui on testnet.

<html>
<body>
<p>
use json rpc to request faucet on test net 
your address  need  have ${faucet_config.mainnet_balance_limit/1e9} SUI @mainnet:
<div> 
 <code>
 https://faucet-rpc.vercel.app/v1/gas?recipient=0xafe36044ef56d22494bfe6231e78dd128f097693f2d974761ee4d649e61f5fa2 
  
</code>
</div>
</p>
</body>
</html>
`;


const proxy:Record<string,string|ProxyOptions> ={
  "/v1/gas":{}
}

app.get('/help',(req,res)=>{
  res.send(msg)
});


///---------------------------- api/auth to github---------------------------------

//Catch API request and route appropriately
app.get('/api/auth', async (req, res) => {
    const ghCode = req.query.code;
    const data ={
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      code:ghCode
    }
    let url =`https://github.com/login/oauth/access_token?client_id=${clientId}&client_secret=${clientSecret}&code=${ghCode}`;
    //Send code to GitHub with 
    const result = await fetch(encodeURI(url), {
        method: 'GET',
        headers: {
            "Accept": "application/json"
        }
    });
    if(!result.ok){
      throw new Error(`/api/auth fetch https://github.com/login/oauth/access_token error:${result.status}`);
    }

    const token = await result.json();

    console.log("/api/auth token object:",token); 
    console.log('https://api.github.com/user'); 
    const ret = await fetch('https://api.github.com/user', {
        headers: { Authorization: `${token.token_type} ${token.access_token}` }
    })
    if(! ret.ok){
       throw new Error(`/api/auth fetch https://api.github.com/user error:${ret.status}`);
    }
    let user_res= await ret.json();
    console.log("/api/auth user_res:",user_res)
    if(user_res.login){    
      regist_github(token.access_token,user_res.login);
      const ghResponse = {"userData": user_res, "token": token.access_token}
      res.json(ghResponse)
    } else{
      res.json({"error":"no user res.login",user_res})
    }
})


app.get('/faucet/github', async (req, res) => {
  const address = req.query.address;
  let token:string = req.query.token;
  
  console.log("req.query:",req.query);
  console.log('/faucet/github req headers token=',token,',address=',address);
  
  res.json(await github_faucet(token,address))
})



// Catch any other request to the 8080 and redirect back to the client files
// Only if in production environment
if (process.env.NODE_ENV === 'production') {
    app.get('*', (req, res) => {
        console.log("Server:", "Routing pages...")

        app.use(express.static(path.join(__dirname, '../client')));
        res.sendFile(path.join(__dirname, '../client/index.html'));
    })
}

// app.listen(PORT, () => {
//     console.log('Server:', `listening on port ${PORT}`)
// })


console.log("RUNNING=",process.env.RUNNING);

const port = process.env.PORT || 3001;
//enableProxyAgent();
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

clearDaily();


// export function expressPlugin() {
//   return {
//     name: 'express-plugin',
//     config(){
//       return {
//         server:{proxy},
//         preview:{proxy}
//       }
//     },
//     configureServer(server: ViteDevServer) {
//       server.middlewares.use(app)
//     }
//   }
// }

// export default app;



/**
curl --location --request POST 'https://faucet.testnet.sui.io/v1/gas' \
--header 'Content-Type: application/json' \
--data-raw '{
    "FixedAmountRequest": {
        "recipient": "0x5e23b1067c479185a2d6f3e358e4c82086032a171916f85dc9783226d7d504de"
    }
}'


curl --location --request POST 'http://localhost:3001/v1/gas' \
--header 'Content-Type: application/json' \
--data-raw '{
    "FixedAmountRequest": {
        "recipient": "0xafe36044ef56d22494bfe6231e78dd128f097693f2d974761ee4d649e61f5fa2"
    }
}'

curl --location --request POST 'http://localhost:3001/v1/gas' \
--header 'Content-Type: application/json' \
--data-raw '{
    "FixedAmountRequest": {
        "recipient": "0x540105a7d2f5f54a812c630f2996f1790ed0e60d1f9a870ce397f03e4cec9b38"
    }
}'


 */
