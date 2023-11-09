import { Box } from '@mui/material';
import { SYMBOL_EMPTY } from 'config/constants';
import isNaN from 'lodash/isNaN';
import isNumber from 'lodash/isNumber';
import { TopCoin } from 'types';

export const parseFloatNumber = (value: number | any) => {
    const floatValue = parseFloat(value);
    return !isNaN(floatValue) ? floatValue : '';
};

export const parseIntNumber = (value: number | any) => {
    const floatValue = parseInt(value, 10);
    return !isNaN(floatValue) ? floatValue : '';
};

export const pickCap24hrChangeColor = (val: any, formatNumber: any) => {
    if (!isNumber(val)) {
        return SYMBOL_EMPTY;
    }
    if (val > 0) {
        return (
            <Box
                sx={{
                    color: '#28a745',
                }}
            >
                <span className="d-inline-block font-xs app-arrow">&#9650; </span>
                {formatNumber(val / 100, {
                    style: 'percent',
                    maximumFractionDigits: 2,
                })}
            </Box>
        );
    }
    if (val < 0) {
        return (
            <Box sx={{ color: '#dc3545' }}>
                <span className="font-xs app-arrow">&#9660;</span>
                {formatNumber(val / 100, {
                    style: 'percent',
                    maximumFractionDigits: 2,
                })}
            </Box>
        );
    }

    return formatNumber(val / 100, {
        style: 'percent',
        maximumFractionDigits: 2,
    });
};

export const formatTopCurrencyData = (topCoins: TopCoin[]) => {
    if (topCoins && topCoins.length !== 0) {
        return topCoins.map(
            ({
                id,
                name,
                rank,
                priceUsd,
                symbol,
                marketCapUsd,
                volumeUsd24Hr,
                changePercent24Hr,
            }: TopCoin) => ({
                id,
                rank: parseIntNumber(rank) || '-',
                coin: {
                    name,
                    symbol,
                },
                usd_price: parseFloatNumber(priceUsd),
                usd_price_change_24h: parseFloatNumber(changePercent24Hr) || '-',
                usd_marketcap: parseFloatNumber(marketCapUsd) || '-',
                usd_volume_24h: parseFloatNumber(volumeUsd24Hr) || '-',
            })
        );
    }
    return [];
};

export const pickSvgUrl = (code: string) => {
    const name = code?.toLowerCase() || '';
    let svgUrl;
    try {
        // eslint-disable-next-line import/no-dynamic-require, global-require, @typescript-eslint/no-var-requires
        svgUrl = require(`../assets/images/color/${name}.svg`);
    } catch (e) {
        // eslint-disable-next-line global-require
        svgUrl = require(`../assets/cryptocurrency-icons/empty.svg`);
    }

    return svgUrl;
};
