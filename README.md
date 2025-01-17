# Faucet RPC Service

A JSON-RPC service for SUI token faucet functionality, built with Express.js and TypeScript.

## Prerequisites

- Node.js >= 20.0.0
- pnpm >= 9.12.3 (`npm install -g pnpm`)

## Installation

```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
pnpm install
```

## Development

```bash
# Run in development mode
pnpm dev

# Build the project
pnpm build

# Start the production server
pnpm start
```

## Quick Start

- 1  Install pnpm if you haven't already:
```bash
npm install -g pnpm
```

- 2  Install dependencies:
```bash
pnpm install
```

- 3  Create a `.env` file:
need register  a git oauth key in [github](https://github.com/settings/developers)
mnemonics is the faucet account 's mnemonic to generate private key

configure the clientId in site_config.ts

    - 3.1 file: .env
```bash
export MNEMONIC= (your mnemonic here)
export clientId=
export clientSecret={clientSecret}
```
    - 3.2 before debug, 
    ```bash
    source .env
    ```

- 4 debug in localhost:
change GithubPage.tsx
```ts
import {github_config_faucet as config}  from './site_config'
```
to
```ts
import {github_config_local as config}  from './site_config'
``` 

    - 4.1 debug localhost 
    befaucet i use the local redirect uri : 'http://localhost:6789' 
```bash
pnpm devp
```
- github auth token: [oauth](./github-oauth.md)

- 5. Start development server:
```bash
pnpm dev
```

- 6. 上传到vercel 
    - 6.1  enable faucet.mov
change GithubPage.tsx
```ts
import {github_config_faucet as config}  from './site_config'
```

    - 6.2 upload
```bash
pnpm upload
```



