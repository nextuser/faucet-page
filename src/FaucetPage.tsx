import {useState,useEffect} from 'react'
import { SuiClient, getFullnodeUrl  } from '@mysten/sui/client';
import { faucet_config } from '../common/config';
import { FaucetResult } from '../common/type';
import { Theme, Button,TextField,Box,Flex } from "@radix-ui/themes";

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
const FaucetPage = ( props : {update_history : ()=>void }) => {
    const [loading, setLoading] = useState(false);
    let [ msg , setMsg ] = useState(''); 
    let [recipient , setRecipient] = useState<string>('')

    let [mainnet_balance , set_mainnet_balance] = useState<number>(0)
    let [testnet_balance , set_testnet_balance] = useState<number>(0)

    let [total_balance ,set_total_balance] = useState<number>(0);

    let [faucet_enable , set_faucet_enable ] = useState(false)
    let update_total =  ()=>{
      setLoading(true)
      test_client.getBalance({owner:FAUCET}).then((balance) => {
        console.log('Balance:', balance);
        set_total_balance(Number(balance.totalBalance)/1e9);
        setLoading(false)
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
        let url =`${faucet_config.rpc_url}?recipient=${recipient}`;
        console.log(url);
        try {
          const res = await fetch(url, {
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
          //console.log("faucet result:",await res.text());
          const result : FaucetResult = await res.json();
          console.log(result)
          let str = result.succ ? 'success!':'failed!' ;
          if(result.digest){
            str += ` transaction digest=${result.digest}`
          }
                    
          str += result.succ ?  '':result.msg
          setMsg(str)

          props.update_history();
          if(result.succ){
            update_recipient_test();
            update_total();

          }
        } catch (error) {
            console.log(`Error: ${error}`);
        }
      };

    useEffect( ()=>{
      if(recipient.length == 0){
        setMsg('Input an address with a balance of at least 0.1 SUI on the mainnet');
        set_faucet_enable(false);
        return 
      }
        let enable = total_balance >  (faucet_config.faucet_amount + faucet_config.gas_budget)/1e9;
        if(enable){
          enable = mainnet_balance >= faucet_config.mainnet_balance_limit/1e9
          if(!enable){
            setMsg(`this address has no enough balance in mainnet . you need at least ${faucet_config.mainnet_balance_limit/1e9} SUI @mainnet`);
          }
          else if(msg.length == 0){
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

    if(loading){
        return <h2>Loading Content... Please Wait.</h2>
    }
   
    return <>
 
 <Flex direction="column" gap="2" maxWidth="800px">
      <h1 className="text-2xl font-bold mb-4">Faucet@Sui_network</h1>

     
      <div>
           
            <label htmlFor='testnet_total'>Faucet total balance@testnet</label>
            <TextField.Root id="testnet_total" variant="surface" value={total_balance || ''} readOnly  />

      </div>

      <div>
        <label htmlFor='testnet_balance'>Your balance@mainnet</label>
        <TextField.Root id="testnet_balance" variant="surface" value={mainnet_balance || '0'}  readOnly></TextField.Root>      
      </div>

      <div>
        <label htmlFor='testnet_balance'>Your balance@testnet</label>
        <TextField.Root id="testnet_balance" variant="surface" value={testnet_balance}  readOnly />
      </div>
      <div>
        <label htmlFor='address'>Sui address</label>
        <TextField.Root id="address" variant="surface" value={recipient || ''}  onChange={(e)=>{
          let addr = e.target.value
          if(addr.length == 0){
            setMsg('Input an address with a balance of at least 0.1 SUI on the mainnet');
          } else{
            setMsg('');
          }
          setRecipient(addr)
        }} placeholder="0xaf83..."/>       
      </div>

      <div>
        <Button id="request_faucet"
          onClick={handleRequestFaucet}
          className="cursor-pointer w-full disabled:cursor-not-allowed"
          disabled={!faucet_enable}
        >
          Request Faucet
        </Button>
        {msg && <label  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{msg}</label>}
      </div>
    </Flex>


    </>
}


export default FaucetPage;