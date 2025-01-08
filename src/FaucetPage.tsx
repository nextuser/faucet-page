import {useState,useEffect} from 'react'
import { SuiClient, getFullnodeUrl  } from '@mysten/sui/client';
import { faucet_config } from '../common/config';
import { FaucetResult } from '../common/type';

const FAUCET=faucet_config.faucet_address

function isAddrValid(str : string):boolean{
    if(str && str.length == 66 && str.startsWith('0x')){
        return true;
    }
    return false;   
}

let test_client = new SuiClient({url:getFullnodeUrl('testnet')});
let main_client = new SuiClient({url:getFullnodeUrl('mainnet')});
interface ReqData  {  
    FixedAmountRequest: {
        recipient: string
    }
  };

const default_msg = `Welcome : faucet ${faucet_config.faucet_amount/1e9} SUI  testnet once a day, when you have at lease ${faucet_config.mainnet_balance_limit/1e9} SUI in mainnet`
export const FaucetPage = () => {
    let [ msg , setMsg ] = useState(default_msg); 
    let [recipient , setRecipient] = useState<string>('')

    let [mainnet_balance , set_mainnet_balance] = useState<number>(0)
    let [testnet_balance , set_testnet_balance] = useState<number>(0)

    let [total_balance ,set_total_balance] = useState<number>(0);

    let [faucet_enable , set_faucet_enable ] = useState(false)
    let update_total =  ()=>{
      test_client.getBalance({owner:FAUCET}).then((balance) => {
      console.log('Balance:', balance);
      set_total_balance(Number(balance.totalBalance)/1e9);
    });
  }

  let update_recipient_test =  ()=>{
      test_client.getBalance({owner:recipient}).then((balance) => {
      console.log('Balance:', balance);
      set_testnet_balance(Number(balance.totalBalance)/1e9);
    });
  }
    const redirect_faucet = ( e )=>{
      const url = `https://faucet-rpc.vercel.app/v1/gas?recipient=${recipient}`
      window.location.href=url;
    }
    let redirect = false;
    const handleRequestFaucet = async (e: React.FormEvent) => {
        e.preventDefault();
        if(redirect){
          redirect_faucet(e);
          return;
        }
        set_faucet_enable(false);
        let formData :ReqData ={
            FixedAmountRequest:{
                recipient:""
            }
        }
        formData.FixedAmountRequest.recipient = recipient;
        try {
          const res = await fetch(`${faucet_config.rpc_url}?recipient=${recipient}`, {
            method: 'GET',
            headers: {
              'Content-Type':  'text/plain',
            },
            // body: JSON.stringify(formData),
          });
          set_faucet_enable(true);
          if (!res.ok) {
            setMsg('Network response was not ok');
            return;
          }
    
          const result : FaucetResult = await res.json();
          console.log(result)
          let str = result.succ ? 'faucet success.':'faucet failed:' ;
          if(result.digest){
            str += `transaction digest=${result.digest}`
          }
                    
          str += result.succ ? '':result.msg
          setMsg(str)
          if(result.succ){
            update_recipient_test();
            update_total();

          }
        } catch (error) {
            console.log(`Error: ${error}`);
        }
      };

    useEffect( ()=>{

        let enable = total_balance >  (faucet_config.faucet_amount + faucet_config.gas_budget)/1e9;
        if(enable){
          enable = mainnet_balance >= faucet_config.mainnet_balance_limit/1e9
          if(!enable){
            setMsg(`this address has no enough balance in mainnet . you need at least ${faucet_config.mainnet_balance_limit/1e9} SUI @mainnet`);
          }
          else{
            setMsg('Click the button to request faucet')
          }
        }
        else{
          setMsg(`Faucet balance  is not enough.`)
        }

        if(enable != faucet_enable)
          set_faucet_enable(enable);
    },[mainnet_balance,total_balance])

 
    useEffect(() => {
      update_total();
    }, []);

      useEffect(()=>{
        if(isAddrValid(recipient)){ 
            main_client.getBalance({owner:recipient}).then((balance) => {
                console.log('main Balance:', balance);
                set_mainnet_balance(Number(balance.totalBalance)/1e9);
            });    
            update_recipient_test();
        }
        else if(mainnet_balance != 0){
            set_mainnet_balance(0);
        }

      },[recipient])

   
    return <>
 
    <div className="px-20 flex flex-col items-center text-center w-600 h-screen mx-auto bg-blue:200">
      <h1 className="text-2xl font-bold mb-4">Faucet@Sui_network</h1>


      <div>
            <label htmlFor="testnet_total" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Faucet Balance @testnet:</label>
            <input type="text" id="testnet_total" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John" 
            value={total_balance || '0'} readOnly required />
      </div>

      <div>
            <label htmlFor="mainnet_balance" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your Balance @mainnet:</label>
            <input type="text" id="mainnet_balance" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John" 
            value={mainnet_balance || '0'} readOnly required />
      </div>
      <div>
            <label htmlFor="testnet_balance" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your Balance @testnet:</label>
            <input type="text" id="testnet_balance" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John" 
            value={testnet_balance || '0'} readOnly required />
      </div>
      <div>
            <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Sui Address</label>
            <input type="text"  id="address" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={recipient} onChange={(e)=>setRecipient(e.target.value)} placeholder="0x..." required />
      </div>
      <div>
      <button id="request_faucet"
        onClick={handleRequestFaucet}
        className="bg-blue-300 text-white px-4 py-2 rounded dark:bg-blue-500 dark:hover:bg-blue-600 hover:bg-blue-400"
        disabled={!faucet_enable}
      >
        Request Faucet
      </button>

      
      <label htmlFor="request_faucet" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{msg}</label>
      
      </div>
    </div>


    </>
}