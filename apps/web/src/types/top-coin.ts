export interface TopCoin {
    id: string;
    symbol: string;
    changePercent24Hr: number | string | any;
    explorer?: string;
    marketCapUsd: number;
    maxSupply?: number;
    name: string;
    priceUsd: number | string | any;
    rank: number | string;
    supply?: number;
    volumeUsd24Hr: number;
    vwap24Hr?: number | string | any;
}
