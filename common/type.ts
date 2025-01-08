export type FaucetResult = {
    succ: boolean,
    msg: string,
    digest?:string,
    code : 'mainnet_limit' | 'faucet_limit' | 'time_limit' 
            |'tx_fail' | 'tx_status_error' | 'tx_succ'
}