# Sui dApp Starter Template

This dApp was created using `@mysten/create-dapp` that sets up a basic React
Client dApp using the following tools:

- [React](https://react.dev/) as the UI framework
- [TypeScript](https://www.typescriptlang.org/) for type checking
- [Vite](https://vitejs.dev/) for build tooling
- [Radix UI](https://www.radix-ui.com/) for pre-built UI components
- [ESLint](https://eslint.org/)
- [`@mysten/dapp-kit`](https://sdk.mystenlabs.com/dapp-kit) for connecting to
  wallets and loading data
- [pnpm](https://pnpm.io/) for package management

## Starting your dApp

To install dependencies you can run

```bash
pnpm install`
```

To start your dApp in development mode run

```bash
pnpm dev
```

## Building

To build your app for deployment you can run

```bash
pnpm build
```




### old standard faucet
#### faucet
```bash
curl --location --request POST 'https://faucet.testnet.sui.io/v1/gas' \
--header 'Content-Type: application/json' \
--data-raw '{
    "FixedAmountRequest": {
        "recipient": "0x5e23b1067c479185a2d6f3e358e4c82086032a171916f85dc9783226d7d504de"
    }
}'
```

#### faucet error
```json
{"task":"9083bf9f-cff5-4c09-a4d8-ac4c40bd02b3","error":null}
```

### new faucet 
#### fauce rpc server:
./rpc.sh

#### faucet client call example

```bash
curl --location --request POST 'http://localhost:3002/v1/gas' \
--header 'Content-Type: application/json' \
--data-raw '{
    "FixedAmountRequest": {
        "recipient": "0xafe36044ef56d22494bfe6231e78dd128f097693f2d974761ee4d649e61f5fa2"
    }
}'
```# faucet_react
# faucet-page
