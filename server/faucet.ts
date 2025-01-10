import { Transaction } from "@mysten/sui/transactions";
import {  SuiClient, getFullnodeUrl} from '@mysten/sui/client'
import { faucet_config } from "../common/config";
import {getSigner} from './local_key'
import { FaucetResult } from "../common/type";

const test_client = new SuiClient({ url: getFullnodeUrl('testnet') });
const main_client = new SuiClient({ url: getFullnodeUrl('mainnet') });

//记录当天分配过的地址
let allocSet  = new Set<string>();
let warmSet = new Set<String>();

// mainet faucet
export async function faucet(target :string) :Promise<FaucetResult>{

    if(warmSet.has(target)){
        return {succ:false,msg:'called more than one times:',code:'time_limit'};
    }
    warmSet.add(target)   

    try{
        if(allocSet.has(target)){
            return {succ:false,msg:"alread allocated, only allocate once a day",code:'time_limit'} 
        } 
         
        let main_balance = await main_client.getBalance({owner:target});
        if(Number(main_balance.totalBalance) < faucet_config.mainnet_balance_limit){
            return {succ:false,msg:"mainnet balance is not enough",code:'mainnet_limit'};
        }

        let result = await doFaucet(target);
        if(result.succ) {
            allocSet.add(target);
        }
        return result;
    } 
    finally{
        warmSet.delete(target);
    }
}


async  function doFaucet(target:string) :Promise<FaucetResult>{
    let tx = new Transaction();
    let coin = tx.splitCoins(tx.gas,[tx.pure.u64(faucet_config.faucet_amount)]);
    tx.transferObjects([coin],tx.pure.address(target));
    let sign_resp = await test_client.signAndExecuteTransaction({transaction:tx,signer:getSigner()});
    let resp = await test_client.waitForTransaction({digest:sign_resp.digest,options:{showEffects:true,showBalanceChanges:true,showEvents:true}});
    if(resp.errors){
        console.log("tx.digest:",sign_resp.digest,",tx error:",resp.errors);
        return  {succ:false,msg:`tx fail ${sign_resp.digest}`,code:'tx_fail',digest:resp.digest};
    } else{
        if(resp.effects?.status.status === "success"){
            
            console.log("tx.digest:",sign_resp.digest,",tx success");
            return {succ:true,msg:"success",code : 'tx_succ',digest:resp.digest};
        } else{
            console.log("tx.digest:",sign_resp.digest,",tx status:",resp.effects?.status.status);
            return {succ:false,msg:`tx.digest=${sign_resp.digest} tx status error:`,code:'tx_status_error',digest:resp.digest};
        }
    }
}

const  tokenMap = new Map<string,string>();
const alloc_git_set = new Set<string>()
export function regist_github(token : string, user_id : string){
    tokenMap.set(token,user_id);
}

export async function github_faucet(token :string ,address : string ) : Promise<FaucetResult> {
    let user_id = tokenMap[token]
    if(!user_id ) {
        return {succ:false,msg:`token error`,code:'token_error'};
    }

    if(warmSet.has(user_id)){
        return {succ:false,msg:'called more than one times:',code:'time_limit'};
    }
    warmSet.add(user_id)
    try{
        if(alloc_git_set.has(user_id)){
            return {succ:false,msg:"alread allocated, only allocate once a day",code:'time_limit'} ;
        }
        let result = await doFaucet(address);
        if(result.succ) {
            alloc_git_set.add(user_id);
        }
        return result;
    }
    finally{
        warmSet.delete(user_id)
    }
  



    
}

export function  clearDaily(){
    console.log("clear daily!");
    //每天清空一次
    setInterval(async ()=>{
        allocSet.clear();

        alloc_git_set.clear();
    },24*60*60*1000)
}


function test_duplicate_faucet(){
    faucet('0xafe36044ef56d22494bfe6231e78dd128f097693f2d974761ee4d649e61f5fa2').then((result) => {
        if (result.succ) {
            console.log('Faucet successful');
        } else {
            console.error('Faucet failed:', result.msg);
        }
    });

    faucet('0xafe36044ef56d22494bfe6231e78dd128f097693f2d974761ee4d649e61f5fa2').then((result) => {
        if (result.succ) {
            console.log('Faucet successful');
        } else {
            console.error('Faucet failed:', result.msg);
        }
    });
}

if( process.env.TEST){
    test_duplicate_faucet();
}