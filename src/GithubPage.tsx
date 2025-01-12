import { useState, useEffect } from 'react'
import "@radix-ui/themes/styles.css";
import { Theme, Button,TextField,Box,Flex } from "@radix-ui/themes";
import { FaucetResult } from 'common/type';
// upload 的时候替换 github_config_local =》 github_config
import {github_config as config}  from './site_config'
type UserType = {
  avatar_url: string;
  login: string;
  location: string;
  name: string;
  id: string;
  type: string;
  followers: number;
  following: number;
  public_repos: number;
 };

 type ProfileData = {
    ok : string
    error_description?:string
    token? : string
    userData? : UserType
 }

const redirectURI = config.redirect_uri


function getMsg(result:FaucetResult){
  if(result.succ){
    return "Success! Digest=" + result.digest
  }else{
    return "Failed!" + result.msg + (result.digest ? ` Digest=${result.digest}` : "");
  }
}

function GithubPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code')
  
  console.log("href:",window.location.href);

  const [loading, setLoading] = useState(false);
  const [gitToken,setGitToken] = useState<string>("")
  const [address,setAddress] = useState<string>("")
  const [msg,setMsg] = useState<string>("")
  const [userData,setUserData] = useState<UserType>()

//  成功 code=>token  ,失败 code =>init
  const queryCode = async (code :string) =>{
    setLoading(true) // Loading is true while our app is fetching
    let ret = await fetch(`/api/auth?code=${code}`)
    try{
      let ret_json = await ret.json();
      console.log("/api/auth result:",ret_json);
      let data = ret_json as ProfileData
      if( data.ok && data.token && data.userData?.login) {
        localStorage.setItem("githubAuth",data.token!)
        localStorage.setItem("githubExpired", String(new Date().getUTCMilliseconds() + config.time_expired));
        setGitToken(data.token);
        console.log("right profile data",data.userData);
        return;
      } else if(data.error_description){
        setMsg(data.error_description);
      }
      
    }
    catch(ex){
      console.log('error',ex);
    }
    finally{
      setLoading(false)
    }
    oAuthReset();
   }

  useEffect(() => {
    let token :string |null = null;
    const time = Number(localStorage.getItem('githubExpired'));
    if( time > new Date().getUTCMilliseconds()){
      token = localStorage.getItem('githubAuth')
    }
    
    let ignore = false;

    if (token != null) {
      setLoading(false)
      setGitToken(token)
    } 
    else if (code) {
        queryCode(code).then(()=>setLoading(false));
    }
  }, [])

  function oAuthGitHub() {
    const clientId = encodeURI(config.client_id)   
    const ghScope = encodeURI(config.scope)//'read:user'
    const oAuthURL = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectURI}&scope=${ghScope}`

    window.location.href = oAuthURL
  }

  function oAuthReset() {
    setGitToken("");
    localStorage.removeItem('githubAuth')
    let oldUrl = new URL(window.location.href);
    window.location.href = `${oldUrl.origin}${oldUrl.pathname}`
    if(code) urlParams.delete(code)
  }

  function requestFaucet(token:string){
    setLoading(true) // Loading is true while our app is fetching
    let reqUrl = `/faucet/github?address=${encodeURI(address)}&token=${encodeURI(token)}`
    console.log(`url =`,reqUrl);
    fetch(reqUrl, {
      method: 'GET',
      })
    .then((res) => {
      if(res.ok){
        return res.json()
      }
      else{
        setLoading(false);
        oAuthReset();
        throw "Error: Unable to fetch faucet funds. Please try again later.";
      }

    })
    .then((result : FaucetResult) => {
      if(result.code == 'token_error'){
        oAuthReset();
      }
      setMsg(getMsg(result))
      console.log("faucetresult", result);
      setLoading(false)
    })
  }

 

  // Creating object to hold information for 'RESET' Button component
  let resetBtn = {
    label: "Unlink GitHub",
    handleClick: () => oAuthReset,
    extraClass: "bg-red-500 active:bg-red-800 hover:ring-red-400 focus:ring-red-400 ms-3",
  }


  //正在登录场景
  if(loading) {
    return <h2>Loading Content... Please Wait.</h2>
  }
  // 登录后场景
  if(gitToken && gitToken.length > 0) {
    return <>
    	<Flex direction="column" gap="2" maxWidth="600px">
	      <label htmlFor='address'>Sui address</label>
        <TextField.Root id="address" variant="surface" value={address} onChange={(e)=>setAddress(e.target.value)} placeholder="0xafed3..." />
        <Button onClick={()=>requestFaucet(gitToken)} disabled={ gitToken == "" } >Reques Faucet</Button>
        <Button onClick={oAuthReset}>Unlink GitHub</Button>
        {msg && <label>{msg}</label>}
      </Flex>
    </>
  }
  //未登录场景
  return <Flex direction="column" gap="2" maxWidth="600px">
    <Button onClick={oAuthGitHub} >Github Login</Button>
    {msg && <label>{msg}</label>}
    </Flex>
}

export default GithubPage
