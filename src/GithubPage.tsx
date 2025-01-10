import { useState, useEffect } from 'react'
import "@radix-ui/themes/styles.css";
import { Theme, Button,TextField,Box,Flex } from "@radix-ui/themes";
import { FaucetResult } from 'common/type';


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
    token? : string,
    userData? : UserType
 }



function GithubPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code')
  console.log("href:",window.location.href);

  const [loading, setLoading] = useState(false);
  const [gitToken,setGitToken] = useState<string>("")
  const [address,setAddress] = useState<string>("")


  const queryCode = async (code :string) =>{
    setLoading(true) // Loading is true while our app is fetching
    console.log(code);
    let ret = await fetch(`/api/auth?code=${code}`)
    try{
      let ret_json = await ret.json();
      console.log("/api/auth result:",ret_json);
      let data = ret_json as ProfileData
      if( data && data.token && data.userData?.login) {
        
        localStorage.setItem("githubAuth",data.token!)
        setGitToken(data.token);
        setLoading(false)
        console.log("right profile data",data.userData);
      }
      return;
    }
    catch(ex){
      console.log('error',ex);
    }
    oAuthReset();
   }

  useEffect(() => {
    const token = localStorage.getItem('githubAuth')
    console.log('local token :',token);
    let ignore = false;

    if (token && typeof(token) == 'string'  && String(token).indexOf('error') == -1) {
      setLoading(false)
      setGitToken(token)
    } 
    else if (code) {
        queryCode(code).then(()=>setLoading(false));
    }
  }, [code])

  function oAuthGitHub() {
    const clientId = 'Ov23liTwqMa4FQe8ymnB'
    const redirectURI = 'http://localhost:6789'
    const ghScope = 'read:user'
    const oAuthURL = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectURI}&scope=${ghScope}`

    window.location.href = oAuthURL
  }

  function requestFaucet(token : string,addr:string){
    setLoading(true) // Loading is true while our app is fetching
    let reqUrl = `/faucet/github?address=${addr}`
    console.log(`url =`,reqUrl,"token", token);
    fetch(reqUrl, {
      headers: { Authorization: token },
      method: 'GET',
      })
    .then((res) => res.json())
    .then((result : FaucetResult) => {
      setLoading(false)
    })
  }

  function oAuthReset() {
    setGitToken("");
    localStorage.removeItem('githubAuth')
    if(code) urlParams.delete(code)
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
    return <><Button   />
    	<Flex direction="column" gap="2" maxWidth="300px">
	      <label htmlFor='address'>Sui address</label><TextField.Root id="address" variant="surface" placeholder="0xafed3..." />
        <Button onClick={()=>requestFaucet(gitToken,address)} disabled={ gitToken == "" } >Reques Faucet</Button>
        <Button onClick={oAuthReset}>Unlink GitHub</Button>
      </Flex>
    </>
  }
  //未登录场景
  return <Button onClick={oAuthGitHub} >Github Login</Button>
}

export default GithubPage
