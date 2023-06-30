import axios from 'axios';
import * as dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const apiUrl = 'https://api.koinly.io/api/transactions';
const order = 'date';
const authToken = process.env.AUTH_TOKEN;
const portfolioToken = process.env.PORTOFILIO_ID;
const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36'

async function getKoinlyTransactions(): Promise<Transactions> {
  let page = 1;
  let allTransactions: Transactions = [];

  try {
    let response = null;

    do {
      response = await axios.get(apiUrl, {
        params: { order, page },
        headers: {
          'user-agent': userAgent,
          'x-auth-token': authToken,
          'x-portfolio-token': portfolioToken,
          'cookie': process.env.COOKIE
        },
      });

      const transactions: Transactions = response.data.transactions;
      allTransactions = allTransactions.concat(transactions);

      page++;
      console.log('page:', page)
    } while (response.data.transactions.length > 0);

    return allTransactions;
  } catch (error) {
    console.error('Error retrieving transactions:', error.response?.data ?? error.message);
    throw error;
  }
}

const csvFilePath = "/tmp/txns.csv"
getKoinlyTransactions()
  .then((transactions: Transactions) => {
    // Create the CSV content from the transactions data
    const csvContent = transactions
      .map((transaction: Transaction) => {
        // Create a string with all attributes of the transaction, explicitly specifying each attribute
        const transactionString = [
          transaction.date,
          transaction.id,
          transaction.type,
          transaction.from?.amount ?? "",
          transaction.from?.currency.symbol,
          transaction.from?.wallet.name,
          transaction.from?.cost_basis,
          transaction.from?.source,
          transaction.to?.amount ?? "",
          transaction.to?.currency.symbol,
          transaction.to?.wallet.name,
          transaction.to?.cost_basis,
          transaction.to?.source,
          transaction.fee?.amount ?? "",
          transaction.fee?.currency.symbol,
          transaction.fee?.wallet.name,
          transaction.fee?.cost_basis,
          transaction.fee?.source,
          transaction.net_value,
          transaction.fee_value,
          transaction.net_worth?.amount,
          transaction.fee_worth,
          transaction.gain,
          transaction.label,
          transaction.description,
          transaction.synced,
          transaction.manual,
          transaction.txhash,
          transaction.txsrc,
          transaction.txdest,
          transaction.txurl,
        ].join(',');
        return transactionString;
      })
      .join('\n');

    // Add the titles to the CSV content
    const csvContentWithTitles = `${titles()}\n${csvContent}`;

    // Write the CSV content to the file
    fs.writeFile(csvFilePath, csvContentWithTitles, (err) => {
      if (err) {
        console.error('Error writing CSV file:', err);
      } else {
        console.log(`CSV file '${csvFilePath}' has been created successfully.`);
      }
    });

    function titles() {
      return [
        'date',
        'id',
        'type',
        'from.amount',
        'from.currency.symbol',
        'from.wallet.name',
        'from.cost_basis',
        'from.source',
        'to.amount',
        'to.currency.symbol',
        'to.wallet.name',
        'to.cost_basis',
        'to.source',
        'fee.amount',
        'fee.currency.symbol',
        'fee.wallet.name',
        'fee.cost_basis',
        'fee.source',
        'net_value',
        'fee_value',
        'net_worth.amount',
        'fee_worth',
        'gain',
        'label',
        'description',
        'synced',
        'manual',
        'txhash',
        'txsrc',
        'txdest',
        'txurl',
      ].join(',');
    }
  })
  .catch((error) => {
    console.error('Error retrieving transactions from Koinly:', error);
  });