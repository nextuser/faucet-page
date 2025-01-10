# 访问g.html 发起gmail登录跳转

# 获得url跳转,提取token

http://localhost:6789/#state=pass-through%20value&access_token=ya29.a0ARW5m77cdfSY7AJ0d-0CiI1eKTxNvLE9n_2cbU_yGh_K6eGqcTajWJIWK0poc8N8fZ-dvqjXvuBt07RvfQ-iB9vl1eE1Aax48uMYqJGDVTjdBHDy2AZCNRT9BGG87v0z4JpCn-7d9uUSWMQYEBGs12xU99yutXFrMQaCgYKAV0SARASFQHGX2Mi4AD_p5B3r5TvTgpp2o0aIg0169&token_type=Bearer&expires_in=3599&scope=email%20https://www.googleapis.com/auth/userinfo.email%20openid&authuser=0&prompt=none

# 访问用户信息
https://www.googleapis.com/oauth2/v2/userinfo
hearder

Bearer ya29.a0ARW5m77cdfSY7AJ0d-0CiI1eKTxNvLE9n_2cbU_yGh_K6eGqcTajWJIWK0poc8N8fZ-dvqjXvuBt07RvfQ-iB9vl1eE1Aax48uMYqJGDVTjdBHDy2AZCNRT9BGG87v0z4JpCn-7d9uUSWMQYEBGs12xU99yutXFrMQaCgYKAV0SARASFQHGX2Mi4AD_p5B3r5TvTgpp2o0aIg0169