import { COINS_LIMIT } from 'config/constants';
import { ListResponse, TopCoin } from 'types';
import axiosClient from './axios-client';

export const coinCapApis = {
    topCoins(): Promise<ListResponse<TopCoin> | any> {
        const url = `/assets?limit=${COINS_LIMIT}`;
        return axiosClient.get(url);
    },
    coinById(id: string): Promise<any> {
        return axiosClient.get(`/assets/${id}`);
    },
};

// tether,binance-coin,usd-coin,dogecoin,polkadot,multi-collateral-dai
