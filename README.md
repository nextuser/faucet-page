# Faucet RPC Service

A JSON-RPC service for SUI token faucet functionality, built with Express.js and TypeScript.

## Prerequisites

- Node.js >= 16.0.0
- pnpm >= 7.0.0 (`npm install -g pnpm`)

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

1. Install pnpm if you haven't already:
```bash
npm install -g pnpm
```

2. Install dependencies:
```bash
pnpm install
```

3. Create a `.env` file:
```env
PORT=3000
NODE_ENV=development
```

4. Start development server:
```bash
pnpm dev
```

5. 上传到vercel 
pnpm upload

## API Endpoints

### JSON-RPC Endpoint: `/v1/gas`

All RPC methods should be called using POST requests to the `/rpc` endpoint.

```
https://faucet-page.vercel.app/v1/gas?recipient=0x540105a7d2f5f54a812c630f2996f1790ed0e60d1f9a870ce397f03e4cec9b38
```

### Health Check: `/health`

GET request to check service health status.

## Available RPC Methods

| Method | Parameters | Description |
|--------|------------|-------------|
| ping | none | Health check method |
| getFaucet | [address: string] | Request tokens for a wallet address |
| getBalance | [address: string] | Get wallet balance |

## Project Structure
