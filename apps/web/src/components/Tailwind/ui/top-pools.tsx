import cn from 'classnames';
import { TopPoolsData } from 'data/static/token-data';
import CurrencySwapIcons from 'components/Tailwind/ui/currency-swap-icons';
import { CoinList } from 'components/Tailwind/ui/currency-swap-icons';
import { useLayout } from 'hooks/tailwind-hooks/use-layout';
import { LAYOUT_OPTIONS } from 'libs/constants';
import { Typography } from '@mui/material';

interface TopPoolsProps {
    limit?: number;
}

export default function TopPools({ limit }: TopPoolsProps) {
    const { layout } = useLayout();
    return (
        <div
            className={cn('rounded-lg bg-white p-6 shadow-card dark:bg-light-dark sm:p-8', {
                'w-full lg:w-[49%]': layout === LAYOUT_OPTIONS.RETRO,
            })}
        >
            <Typography variant="h3" className="mb-6 text-base font-medium uppercase">
                Top Pools
            </Typography>
            <div className="mb-5 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <span className="col-span-2">Pool</span>
                <span>Volume</span>
            </div>

            {TopPoolsData.slice(0, limit ?? -1).map((pool, index) => {
                let from = pool.from as CoinList;
                let to = pool.to as CoinList;
                return (
                    <div
                        className="mb-5 flex items-center justify-between text-sm text-gray-900 last:mb-0 dark:text-white"
                        key={index}
                    >
                        <div className="col-span-2 flex items-center gap-2">
                            <CurrencySwapIcons from={from} to={to} />
                        </div>
                        <span>{pool.volume}</span>
                    </div>
                );
            })}
        </div>
    );
}
