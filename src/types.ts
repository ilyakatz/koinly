// create a type for the transaction object
type Transaction = {
    id: string;
    type: string;
    from: undefined | SourceOrDestination;
    to: undefined | SourceOrDestination;
    fee: undefined | SourceOrDestination;
    net_value: string;
    fee_value: string;
    net_worth: Networth;
    fee_worth: any;
    gain: string;
    date: string;
    label: string;
    description: string;
    synced: boolean;
    manual: boolean;
    txhash: any;
    txsrc: any;
    txdest: any;
    txurl: any;
    negative_balances: any;
    missing_rates: boolean;
    missing_cost_basis: any;
    margin: boolean;
    group_name: any;
    group_count: any;
    from_source: any;
    to_source: string;
    ignored: boolean;
    imported: boolean;
    synced_to_accounting_at: any;
    rates_updated_at: string;
}

// write a type for the `to` object
type SourceOrDestination = {
    amount: string;
    currency: Currency;
    wallet: Wallet;
    cost_basis: string;
    ledger_id: string;
    source: string;
}

type Currency = {
    id: string;
    name: string;
    symbol: string;
    icon: string;
    fiat: boolean;
}

type Wallet = {
    id: string;
    name: string;
}

type Networth = {
    amount: string;
}

type Transactions = Transaction[]