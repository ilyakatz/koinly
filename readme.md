This script reads all the transactions from Koinly and generates a CVS file of all transactions

# Install

```
npm install -g ts-node
pnpm i
```

# Run


## Set environment

```
cp .env.example .env
```

Edit `.env` and update the values


```
npx tsc && node dist/index.js
```