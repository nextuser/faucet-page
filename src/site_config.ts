 export type SiteConfig ={
    redirect_uri:string;
    time_expired:number;
    scope:string;
    client_id:string
};

// const site_config={
//     redirect_uri : 'https://faucet-page.vercel.app',
//     github_time_expired :  1000*60*10 ,//10 minutes  =>milliseconds
//     github_scope:'user:email'

// }
export const github_config : SiteConfig={
    redirect_uri : 'https://faucet-page.vercel.app',
    scope:'user:email',
    time_expired :  1000*60*10 ,//10 minutes  =>milliseconds
    client_id:'Ov23liymQHNmuLu3DL4d'  //faucetpage.vercel.app
    
}

export const github_config_faucet : SiteConfig={
    redirect_uri : 'https://www.faucet.mov',
    scope:'user:email',
    time_expired :  1000*60*10 ,//10 minutes  =>milliseconds
    client_id:'Ov23li4c4ki7GtmxHYbZ' //fauce.mov
    
}

export const github_config_local : SiteConfig={
    redirect_uri : 'http://localhost:6789',
    scope:'user:email',
    time_expired :  1000*60*10 ,//10 minutes  =>milliseconds
    client_id:'Ov23liTwqMa4FQe8ymnB'
}

export const gmail_config:SiteConfig = {
    redirect_uri: 'http://localhost:6789',
    scope: 'https://www.googleapis.com/auth/userinfo.email',
    time_expired : 1000*60*30,
    client_id : '1093985330970-n1i603t2fcobnkumi1i0alttpl4ohv26.apps.googleusercontent.com',
}