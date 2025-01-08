old faucet
```bash
curl --location --request POST 'https://faucet.testnet.sui.io/v1/gas' \
--header 'Content-Type: application/json' \
--data-raw '{
    "FixedAmountRequest": {
        "recipient": "0x5e23b1067c479185a2d6f3e358e4c82086032a171916f85dc9783226d7d504de"
    }
}'
```

## error
```json
{"task":"9083bf9f-cff5-4c09-a4d8-ac4c40bd02b3","error":null}
```

##
succ:

```bash
curl --location --request POST 'https://faucet.devnet.sui.io/v1/gas' \
--header 'Content-Type: application/json' \
--data-raw '{
    "FixedAmountRequest": {
        "recipient": "0xafe36044ef56d22494bfe6231e78dd128f097693f2d974761ee4d649e61f5fa2"
    }
}'
```

