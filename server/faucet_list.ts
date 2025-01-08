
import { Transaction } from "@mysten/sui/transactions";
import {  SuiClient, getFullnodeUrl} from '@mysten/sui/client'
import {getSigner} from './local_key'
import {faucet_config} from '../common/config'
const test_client = new SuiClient({ url: getFullnodeUrl('testnet')});
const main_client = new SuiClient({ url: getFullnodeUrl('mainnet')});
const MAIN_LIMIT = faucet_config.mainnet_balance_limit
const FAUCET_AMOUNT = faucet_config.faucet_amount
const GAS_BUDGET = faucet_config.gas_budget
//记录当天分配过的地址
let allocSet  = new Set<string>();

type FaucetResult =  {
    from :string,
    succ :boolean,
    err?: string
}

interface Transfer {
    to: string;
    amount: number;
}

async function filter(targets : string[]) :Promise<string[]>{
    let results:string[] = [];
    for(let i = 0 ; i < targets.length; ++ i)
    {
        let target = targets[i];
        let main_balance = await main_client.getBalance({owner:target});
        if(Number(main_balance.totalBalance) < MAIN_LIMIT){            console.log(`${target} have insufficient gas in mainnet`);
            continue;
        }
        results.push(target);
    }
    return results;
}
async  function faucet_list(targets:string[]) :Promise<FaucetResult[]>{
    console.log("tagets:",targets)
    let results :FaucetResult[] = [];
    let amount_list:number[] = [];
    let to_list:string[] = [];
    let left_balance = await main_client.getBalance({owner:getSigner().toSuiAddress()});
    let  max_count = (Number(left_balance.totalBalance) - GAS_BUDGET) / FAUCET_AMOUNT;
   
    const transfers: Transfer[] = [];
    for(let i = 0 ; i < targets.length && i < max_count; ++ i)
    {
        let target = targets[i];
    

        amount_list.push(FAUCET_AMOUNT)
        to_list.push(target);
        transfers.push({to:target,amount:FAUCET_AMOUNT});

        if(amount_list.length >= max_count){
            break;
        }
    }
    if(amount_list.length == 0){
        results.push({from:targets.toString(),succ:false,err:"no enough balance"});
        return results;
    }
    // console.log(transfers);

    const tx = new Transaction();
    
    // first, split the gas coin into multiple coins
    const coins = tx.splitCoins(
        tx.gas,
        transfers.map((transfer) => transfer.amount),
    );
    
    // next, create a transfer transaction for each coin
    transfers.forEach((transfer, index) => {
        tx.transferObjects([coins[index]], transfer.to);
    });

    
    let sign_resp = await test_client.signAndExecuteTransaction({transaction:tx,signer:getSigner()});
    //tx.setGasBudget(GAS_BUDGET)
    let resp = await test_client.waitForTransaction({digest:sign_resp.digest,options:{showEffects:true,showBalanceChanges:true,showEvents:true}});
    if(resp.errors){
        console.log("tx.digest:",sign_resp.digest,",tx error:",resp.errors);
        results.push({from: to_list.toString(), succ:false,err:"tx error"});
    } else{
        if(resp.effects?.status.status === "success"){
            console.log("tx.digest:",sign_resp.digest,",tx success");
            results.push({from: to_list.toString(), succ:true});
        } else{
            console.log("tx.digest:",sign_resp.digest,",tx status:",resp.effects?.status.status);
            results.push({from: to_list.toString(), succ:false,err:"resp effect error"});
        }
    }
    return results;
}

//每天清空一次
setInterval(async ()=>{
    allocSet.clear();
},24*60*60*1000)

let addr_list = [
    '0xafe36044ef56d22494bfe6231e78dd128f097693f2d974761ee4d649e61f5fa2',
    '0x5e23b1067c479185a2d6f3e358e4c82086032a171916f85dc9783226d7d504de',
    '0x16781b5507cafe0150fe3265357cccd96ff0e9e22e8ef9373edd5e3b4a808884',
    '0xa23b00a9eb52d57b04e80b493385488b3b86b317e875f78e0252dfd1793496bb',
    '0xafe36044ef56d22494bfe6231e78dd128f097693f2d974761ee4d649e61f5fa2',
    '0x540105a7d2f5f54a812c630f2996f1790ed0e60d1f9a870ce397f03e4cec9b38',
    '0xebb49dad8eae5f8cf9e55fbb02c1addd54415ac1d4422f8b47cb898bfbdc49f8',
    '0x8f6bd80bca6fb0ac57c0754870b80f2f47d3c4f4e815719b4cda8102cd1bc5b0'];

async function do_faucet(address_list :string[]){
    let list = await filter(address_list)
    return faucet_list(list);
}

do_faucet(addr_list).then((result) => {
    console.log(result);
});

