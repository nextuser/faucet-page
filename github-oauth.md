# oauth 流程
vite server 和express server
vite server处理静态页面,  express server 处理rpc请求.
这里vite serer => scriptserver   express server=>rpc server

[github auth scope](https://githubdocs.cn/en/apps/oauth-apps/building-oauth-apps/scopes-for-oauth-apps)
# 初始接入流程

```puml
@startuml
box client #LightBlue
participant user
participant    browser
participant  script as script

end box
box Server
participant  react_server
participant  rpcserver as rpc
end box
participant github_auth as github
autonumber

user -> browser : open url
browser -> react_server   : request page
react_server --> browser : page

browser -> script: load
script->script:check_token_in_cookie

alt "toke过期或不合法" 
script->browser : windown.location.href=... github auth
browser -> github :https://github.com/login/oauth/authorize
note over browser,github:{client_id,redirect_uri,state:?,scope,login?}
 
 === browser - github login==
github -->browser : "${redirect_uri}?code=xxx&sate=yyy"
browser -> react_server:   "${redirect_uri}?code=xxx&sate=yyy"
react_server -->browser : page
browser -> script: load
note over script: todo  ,check state
script -> rpc:  rpc_uri?code=xxx
rpc->github: POST 
note over rpc,github:https://github.com/login/oauth/access_token
note over rpc,github: params:{client_id,client_secret,code,redirect_uri?} \n header:{Accept: "application/json"}'

github -->rpc: {access_token ,userData}
note over github,rpc:{access_token ,token_type,scope}
rpc -> github:GET https://api.github.com/user
note over rpc,github: "header:{Authorization: 'Bearer ${token}'}"
github -->rpc:' {userData:{login,id,},access_token}'
rpc --> rpc:' 记录token和用户对应关系 {token,userData.login}'
rpc --> script: '{token ,userData}'
script->script: "cookie.write(token)"
end
==== token 合法阶段 ===
user -> browser: request faucet
browser->script : requestFaucet
script --> rpc: 'POST faucet/github param:{ token :}'

rpc ->rpc : check(token, user_id)
alt "githubAllocSet.contains(user_id)"
    rpc --> script: {succ:fail}
else
    rpc --> Sui : ptb
    
    note over rpc,Sui:  "split-coins gas, transfer-objects"
    sui --> rpc :: result
    rpc --> script : { succ : true}
    
end
rpc -> browser: show faucet result


@enduml
```

# github auth state chart

```puml
@startuml
@startuml
hide empty description
left to right direction
state init
state code
state token

[*]->init
init --> code : github登录成功
code --> init: github登录失败
token --> init :token过期或认证失败
code->token : 认证成功

@enduml

```

认证失败可能发生在:
1. 使用code 调用auth过程  ,没有返回access_token
2. 使用token请求sui ,返回 code=invalid_token

github token有个时间10分钟,cookie可以记录


