import { useState, useEffect } from 'react'
import "@radix-ui/themes/styles.css";
import { Theme, Button,TextField,Box,Flex } from "@radix-ui/themes";
import { FaucetResult } from 'common/type';
import {  Trash2 } from "lucide-react";
//TODO upload 的时候替换 github_config_local =》 github_config
import {github_config_faucet as config}  from './site_config'
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

function GithubPage( props : { update_history : ()=>void }) {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code')
  
  console.log("href:",window.location.href);

  const [loading, setLoading] = useState(false);
  const [gitToken,setGitToken] = useState<string>("")
  const [address,setAddress] = useState<string>("")
  const [msg,setMsg] = useState<string>("")
  const [userData,setUserData] = useState<UserType>()

//  成功 code=>token  ,失败 code =>init
  const authByCode = async (code :string) =>{
    setLoading(true) // Loading is true while our app is fetching
    const ret = await fetch(`/api/auth?code=${code}`)
    try{
      const ret_json = await ret.json();
      console.log("/api/auth result:",ret_json);
      const data = ret_json as ProfileData
      if( data.ok && data.token && data.token.length> 0  && data.userData?.login) {
        localStorage.setItem("githubAuth",data.token!)
        localStorage.setItem("githubExpired", String(new Date().getUTCMilliseconds() + config.time_expired));
        setGitToken(data.token);
        console.log("right profile data",data.userData);
        return;
      } else if(data.error_description){
        console.log("data error:",data.error_description);
        setMsg(data.error_description);
      }
      
    }
    catch(ex){
      console.log('catch ex:',ex);
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
    } else{
      console.log("github expired");
    }
    
    const ignore = false;

    if (token != null && token.length > 0) {
      setLoading(false)
      setGitToken(token)
    } 
    else if (code) {
        console.log("auth by Code: code=",code);
        authByCode(code).then(()=>setLoading(false));
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
    const reqUrl = `/faucet/github?address=${encodeURI(address)}&token=${encodeURI(token)}`
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
      props.update_history();
      setMsg(getMsg(result))
      console.log("faucetresult", result);
      setLoading(false)
    })
  }

 

  // Creating object to hold information for 'RESET' Button component
  const resetBtn = {
    label: "Unlink GitHub",
    handleClick: () => oAuthReset,
    extraClass: "bg-red-500 active:bg-red-800 hover:ring-red-400 focus:ring-red-400 ms-3",
  }

  const handleClearInput = () => {
    setAddress('');
  };


  //正在登录场景
  if(loading) {
    return <h2>Loading Content... Please Wait.</h2>
  }
  // 登录后场景
  if(gitToken && gitToken.length > 0) {
    return <>
    	<Flex direction="column" gap="2" maxWidth="800px">
	      <label htmlFor='address'>Sui address</label>
        <div className='relative inline-block'>
        <TextField.Root id="address" variant="surface" value={address} onChange={(e)=>setAddress(e.target.value)} placeholder="0xafed3..." />
        <div className="absolute top-2 right-2 flex space-x-2">
            
           {address && <button onClick={handleClearInput} className="text-gray-500 hover:text-gray-700">
              <Trash2 size={20} />
            </button>
          }
        </div>
        </div>
        <Button className="cursor-pointer disabled:cursor-not-allowed" onClick={()=>requestFaucet(gitToken)} disabled={ gitToken == "" || address === "" } >Reques Faucet</Button>
        <Button className="cursor-pointer" onClick={oAuthReset}>Unlink GitHub</Button>
        {msg && <label>{msg}</label>}
      </Flex>
    </>
  }
  //未登录场景
  return <Flex direction="column" gap="2" maxWidth="800px">
    <Button className="cursor-pointer" onClick={oAuthGitHub} >Github Login</Button>
    {msg && <label>{msg}</label>}
    </Flex>
}

export default GithubPage
