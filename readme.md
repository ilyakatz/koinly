This script reads all the transactions from Koinly and generates a CVS file of all transactions

# Install

npm install -g ts-node
pnpm i

# Run


## Set environment

'x-auth-token': AUTH_TOKEN,
'x-portfolio-token': PORTOFILIO_ID,
'cookie': COOKIE

export AUTH_TOKEN=...
export PORTOFILIO_ID=...
export COOKIE=...

npx tsc && node dist/index.js