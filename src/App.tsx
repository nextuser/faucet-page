import React from "react";
import * as Tabs from "@radix-ui/react-tabs";
import FaucetPage from './FaucetPage'
import GithubPage from "./GithubPage";
import './App.css'
import './style.css'

const App = () => {
    return(
    <>


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
			<GithubPage/>
		</Tabs.Content>
		<Tabs.Content className="TabsContent" value="tab2">
			<FaucetPage/>
		</Tabs.Content>
	</Tabs.Root>
    </>    
);
}

export default App;