import React from "react";
//import * as Tabs from "@radix-ui/react-tabs";
import FaucetPage from './FaucetPage'
import GithubPage from "./GithubPage";
import './App.css'
import './style.css'
import './global.css'
import "@radix-ui/themes/styles.css";
import TransactionHistory from './TransactionHistory'
import { Box, Flex , Grid} from "@radix-ui/themes";
import {useState,useEffect} from 'react'
import { SuiClient, getFullnodeUrl,PaginatedTransactionResponse,SuiTransactionBlockResponse  } from '@mysten/sui/client';
import { faucet_config } from '../common/config';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


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
  return (
<>
<center>
<Grid columns="1" gap="2" maxWidth="800px">
	<Box>
    <Tabs defaultValue="tab1" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="tab1">GitHub User</TabsTrigger>
        <TabsTrigger value="tab2">Wallet with SUI@mainnet</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">
        <Card>
          <CardHeader>
            <CardTitle>GitHub User</CardTitle>
            <CardDescription>
              Login to Github to request SUI@testnet from Faucet
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
		  	<GithubPage update_history={update_history} />
          </CardContent>

        </Card>
      </TabsContent>
      <TabsContent value="tab2">
        <Card>
          <CardHeader>
            <CardTitle>Wallet with SUI@mainnet</CardTitle>
            <CardDescription>
              request SUI@testnet to wallet with at least {faucet_config.mainnet_balance_limit/1e9} SUI@mainnet
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
		  	<FaucetPage update_history={update_history} />
          </CardContent>

        </Card>
      </TabsContent>
    </Tabs>
	</Box>
	<Box>
	<TransactionHistory transactions={transactions}/>


	</Box>

</Grid>
</center></>
  )
}



export default App;