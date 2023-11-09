// used to construct the list of all pairs we consider by default in the frontend

// SDN OFAC addresses
export const BLOCKED_ADDRESSES: string[] = [
    '0x7F367cC41522cE07553e823bf3be79A889DEbe1B',
    '0xd882cFc20F52f2599D84b8e8D58C7FB62cfE344b',
    '0x901bb9583b24D97e995513C6778dc6888AB6870e',
    '0xA7e5d5A720f06526557c513402f2e6B5fA20b008',
    '0x8576aCC5C05D6Ce88f4e49bf65BdF0C62F91353C',
];

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 50;
// 20 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 20;

export { default as ifosConfig } from './ifo';
export { default as poolsConfig } from './pools';

export const FAST_INTERVAL = 10000;
export const SLOW_INTERVAL = 60000;

export const NOT_ON_SALE_SELLER = '0x0000000000000000000000000000000000000000';
export const NO_PROXY_CONTRACT = '0x0000000000000000000000000000000000000000';

export const PREDICTION_TOOLTIP_DISMISS_KEY = 'prediction-switcher-dismiss-tooltip';

// Gelato uses this address to define a native currency in all chains
export const GELATO_NATIVE = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';

export const EXCHANGE_DOCS_URLS = 'https://docs.pancakeswap.finance/products/pancakeswap-exchange';
export const EXCHANGE_HELP_URLS = 'https://docs.pancakeswap.finance/help';

export const API_URL_SOCKET = 'wss://ws.coincap.io';
export const COINS_LIMIT = 100;
export const SYMBOL_EMPTY = '–';
export const CHANGELLY_EXANGE_URL = 'https://changelly.com';
export const API_URL_COINCAP = 'https://api.coincap.io/v2';

export const CHANGELLY_REF_ID = '3ynbitfg0s5h4ymu';
export const CHANGELLY_EXANGE_AMOUNT = 0.1;
