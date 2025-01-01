import axios from "axios";
import { execSync } from "child_process";
import * as dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const order = "date";
const perPage = 25;
const apiUrl = `https://api.koinly.io/api/transactions?per_page=${perPage}&order=${order}&page=`;
const authToken = process.env.AUTH_TOKEN;
const portfolioToken = process.env.PORTOFILIO_ID;
const cookies = process.env.COOKIES;
const userAgent =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
const DEBUG = process.env.DEBUG === "true" || false;

async function getKoinlyTransactions(): Promise<Transactions> {
  let page = 0;
  let allTransactions: Transactions = [];

  try {
    let response = null;

    do {
      console.log("page:", page);
      // response = await getUsingAxios(response);
      response = getResponseUsingCurl(response);
      const transactions: Transactions = response.transactions;
      allTransactions = allTransactions.concat(transactions);
      page++;
    } while (response.transactions.length > 0);

    console.log("allTransactions:", allTransactions.length);
    return allTransactions;
  } catch (error) {
    console.error(
      "Error retrieving transactions:",
      error.response?.data ?? error.message
    );
    throw error;
  }

  async function getUsingAxios(response: any) {
    response = await axios.get(apiUrl, {
      // params: { order, page },
      headers: {
        accept: "application/json, text/plain, */*",
        cookie: process.env.COOKIE,
        "user-agent": userAgent,
        "x-auth-token": authToken,
        "x-portfolio-token": portfolioToken,
      },
    });
    return response.data;
  }

  function getResponseUsingCurl(response: any) {
    const curlCommand = `
      curl --location '${apiUrl}${page}'  \
      --header 'accept: application/json, text/plain, */*' \
      --header 'cookie: ${cookies}' \
      --header 'user-agent: ${userAgent}' \
      --header 'x-auth-token: ${authToken}' \
      --header 'x-portfolio-token: ${portfolioToken}'`;

    if (DEBUG) {
      console.log("curlCommand:", curlCommand);
    }

    const curlReponse = execSync(curlCommand);
    response = JSON.parse(curlReponse.toString());
    return response;
  }
}

const csvFilePath = "/tmp/txns.csv";
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
          transaction.description?.replace(/\n/g, " "),
          transaction.synced,
          transaction.manual,
          transaction.txhash,
          transaction.txsrc,
          transaction.txdest,
          transaction.txurl,
        ].join(",");
        return transactionString;
      })
      .join("\n");

    // Add the titles to the CSV content
    const csvContentWithTitles = `${titles()}\n${csvContent}`;

    // Write the CSV content to the file
    fs.writeFile(csvFilePath, csvContentWithTitles, (err) => {
      if (err) {
        console.error("Error writing CSV file:", err);
      } else {
        console.log(`CSV file '${csvFilePath}' has been created successfully.`);
      }
    });

    function titles() {
      return [
        "date",
        "id",
        "type",
        "from.amount",
        "from.currency.symbol",
        "from.wallet.name",
        "from.cost_basis",
        "from.source",
        "to.amount",
        "to.currency.symbol",
        "to.wallet.name",
        "to.cost_basis",
        "to.source",
        "fee.amount",
        "fee.currency.symbol",
        "fee.wallet.name",
        "fee.cost_basis",
        "fee.source",
        "net_value",
        "fee_value",
        "net_worth.amount",
        "fee_worth",
        "gain",
        "label",
        "description",
        "synced",
        "manual",
        "txhash",
        "txsrc",
        "txdest",
        "txurl",
      ].join(",");
    }
  })
  .catch((error) => {
    console.error("Error retrieving transactions from Koinly:", error);
  });
