import React from "react";
import * as Tabs from "@radix-ui/react-tabs";
import FaucetPage from './FaucetPage'
import GithubPage from "./GithubPage";
import './App.css'
import './style.css'
import "@radix-ui/themes/styles.css";
import TransactionHistory from './TransactionHistory'
import { Box, Flex , Grid} from "@radix-ui/themes";
import {useState,useEffect} from 'react'
import { SuiClient, getFullnodeUrl,PaginatedTransactionResponse,SuiTransactionBlockResponse  } from '@mysten/sui/client';
import { faucet_config } from '../common/config';

const App = () => {


	const FAUCET = faucet_config.faucet_address
	let test_client = new SuiClient({url:getFullnodeUrl('testnet')});
	
	//view tx : https://testnet.suivision.xyz/txblock/4iYdXoRXJTAscEs5J1FZLXM5ZTdjUZXVR6unn2mQsWsc
	let [transactions,setTransactions] = useState<SuiTransactionBlockResponse[]>([])
	
	let queryTransactions = 	async ()=>{
		let response :PaginatedTransactionResponse = await test_client.queryTransactionBlocks({filter:{
				FromAddress:faucet_config.faucet_address,
			},
			order:"descending",
			options:{
				showBalanceChanges:true,
				showEffects:true
			}
		});
		setTransactions([... response.data ])
	}

	const update_history = ()=>{
		queryTransactions();
	}

	useEffect( ()=>{queryTransactions()},[]);

    return(
    <>
<center>
<Grid columns="1" gap="2" maxWidth="800px">
	<Box>
		<Tabs.Root className="TabsRoot" defaultValue="tab1">
			<Tabs.List className="TabsList" aria-label="Manage your account">
				<Tabs.Trigger className="TabsTrigger" value="tab1">
				Github
				</Tabs.Trigger>
				<Tabs.Trigger className="TabsTrigger" value="tab2">
				sui@Mainnet 
				</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content className="TabsContent" value="tab1">
				<GithubPage update_history={update_history}/>
			</Tabs.Content>
			<Tabs.Content className="TabsContent" value="tab2">
				<FaucetPage update_history={update_history}/>
			</Tabs.Content>
		</Tabs.Root>
	</Box>
	<Box>
		<TransactionHistory transactions={transactions}/>
	</Box>
</Grid>
</center>
    </>    
);
}

export default App;