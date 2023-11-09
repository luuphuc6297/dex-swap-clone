/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react-hooks/rules-of-hooks */
import { UseQueryOptions, useQuery } from '@tanstack/react-query';
import { coinCapApis } from 'apis/top-coin';
import { AxiosError } from 'axios';
import { API_URL_SOCKET } from 'config/constants';
import debounce from 'lodash/debounce';
import reverse from 'lodash/reverse';
import React from 'react';
import { ListResponse, TopCoin } from 'types';
import { formatTopCurrencyData } from 'utils/top-coin';

const topCoinsKeys = {
    all: () => ['top-coin-services'] as const,
    topCoins: () => [topCoinsKeys.all(), 'top-coins'] as const,
    coin: (id: string) => [topCoinsKeys.all(), 'coin', id] as const,
};

// Chat gpt version
export const useCoinList = (
    config: UseQueryOptions<
        ListResponse<TopCoin>,
        AxiosError,
        ListResponse<TopCoin>,
        InferQueryKey<typeof topCoinsKeys.topCoins>
    > = {}
) => {
    const [topCoins, setTopCoins] = React.useState<TopCoin[]>([]);

    const { data } = useQuery(topCoinsKeys.topCoins(), () => coinCapApis.topCoins(), {
        keepPreviousData: true,
        initialData: [],
        // eslint-disable-next-line @typescript-eslint/no-shadow
        onSuccess: (data) => {
            if (data?.data) {
                setTopCoins(data.data);
            }
        },
    });

    const coinIds = React.useMemo(
        () => data?.data?.map((coin: { id: string }) => coin.id)?.join(','),
        [data?.data]
    );

    const handleWebSocketMessage = React.useCallback((event: MessageEvent<any>) => {
        // eslint-disable-next-line @typescript-eslint/no-shadow
        const data: { [key: string]: string } = JSON.parse(event.data);
        if (!data) return;

        setTopCoins((prevCoinList) =>
            prevCoinList.map((coin: TopCoin) => {
                if (data[coin.id]) {
                    return { ...coin, priceUsd: data[coin.id] };
                }
                return coin;
            })
        );
    }, []);
    React.useEffect(() => {
        if (!coinIds) return;

        const ws = new WebSocket(`${API_URL_SOCKET}/prices?assets=${coinIds}`);
        ws.onmessage = handleWebSocketMessage;

        // eslint-disable-next-line consistent-return
        return () => {
            ws.close();
        };
    }, [coinIds, handleWebSocketMessage]);

    return {
        topCoins: formatTopCurrencyData(topCoins),
        ...config,
    };
};

export const useCoinById = (coinId: string) => {
    return useQuery(topCoinsKeys.coin(coinId), () => coinCapApis.coinById(coinId), {});
};

// export const useCoinListById = () => {

//     const bnbTopCoins = React.useMemo(() => ['tether', 'binance-coin', 'usd-coin', 'dogecoin', 'polkadot', 'multi-collateral-dai', 'trueusd', 'elrond-egld', 'paxos-standard', 'conflux-network', 'maker'], [])

//     const coins = bnbTopCoins.map((coinId) => {
//         const { isLoading, isError, data } = useCoinById(coinId)

//         return { isLoading, isError, data }
//     })

//     const data = coins.reduce<TopCoin[]>((acc, coin) => {
//         if (!coin.isLoading && !coin.isError && coin.data) {
//             const { id, rank, symbol, name, supply, maxSupply, marketCapUsd, volumeUsd24Hr, priceUsd, changePercent24Hr, vwap24Hr } = coin.data?.data
//             acc.push({ id, rank, symbol, name, supply, maxSupply, marketCapUsd, volumeUsd24Hr, priceUsd, changePercent24Hr, vwap24Hr })
//         }
//         return acc
//     }, [])

//     return {
//         topCoins: formatTopCurrencyData(data),
//         isLoading: coins.some((coin) => coin.isLoading),
//         isError: coins.some((coin) => coin.isError),
//     }
// }

const coinSystem = [
    {
        id: 'vltt',
        name: 'VLTT',
        symbol: 'vltt',
        rank: '-',
        marketCapUsd: '-',
        priceUsd: '1.0012335869577192',
        changePercent24Hr: '-',
        volumeUsd24Hr: '-',
    },
    {
        id: 'stmt',
        name: 'STMT',
        symbol: 'stmt',
        rank: '-',
        marketCapUsd: '-',
        priceUsd: '1.0012335869577192',
        changePercent24Hr: '-',
        volumeUsd24Hr: '-',
    },
];

// GPT version
export const useCoinListById = () => {
    const [topCoins, setTopCoins] = React.useState<TopCoin[]>([]);

    const bnbTopCoins = React.useMemo(
        () => [
            'tether',
            'binance-coin',
            'usd-coin',
            'dogecoin',
            'polkadot',
            'multi-collateral-dai',
            'trueusd',
            'elrond-egld',
            'paxos-standard',
            'conflux-network',
            'maker',
        ],
        []
    );

    const coins = bnbTopCoins.map((coinId) => {
        const { isLoading, isError, data } = useCoinById(coinId);

        return { isLoading, isError, data };
    });

    const data = coins.reduce<TopCoin[]>((acc, coin) => {
        if (!coin.isLoading && !coin.isError && coin.data) {
            const {
                id,
                rank,
                symbol,
                name,
                supply,
                maxSupply,
                marketCapUsd,
                volumeUsd24Hr,
                priceUsd,
                changePercent24Hr,
                vwap24Hr,
            } = coin.data.data;
            acc.push({
                id,
                rank,
                symbol,
                name,
                supply,
                maxSupply,
                marketCapUsd,
                volumeUsd24Hr,
                priceUsd,
                changePercent24Hr,
                vwap24Hr,
            });
        }
        return acc;
    }, []);

    React.useEffect(() => {
        debounce(() => {
            setTopCoins(data);
        }, 3000)();
    }, [data]);

    const handleWebSocketMessage = React.useCallback((event: MessageEvent<any>) => {
        const data: { [key: string]: string } = JSON.parse(event.data);
        if (!data) return;

        setTopCoins((prevCoinList) =>
            prevCoinList.map((coin: TopCoin) => {
                if (data[coin.id]) {
                    return { ...coin, priceUsd: data[coin.id] };
                }
                return coin;
            })
        );
    }, []);

    React.useEffect(() => {
        const ws = new WebSocket(`${API_URL_SOCKET}/prices?assets=${bnbTopCoins}`);
        ws.onmessage = handleWebSocketMessage;

        return () => {
            ws.close();
        };
    }, [bnbTopCoins, handleWebSocketMessage]);

    return {
        // @ts-ignore
        topCoins: formatTopCurrencyData(reverse(topCoins.concat(coinSystem))),
        isLoading: coins.some((coin) => coin.isLoading),
        isError: coins.some((coin) => coin.isError),
    };
};
