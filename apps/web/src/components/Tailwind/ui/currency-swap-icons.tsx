import { Bitcoin } from 'components/Tailwind/icons/bitcoin';
import { Ethereum } from 'components/Tailwind/icons/ethereum';
import { Tether } from 'components/Tailwind/icons/tether';
import { Bnb } from 'components/Tailwind/icons/bnb';
import { Usdc } from 'components/Tailwind/icons/usdc';
import { Cardano } from 'components/Tailwind/icons/cardano';
import { Doge } from 'components/Tailwind/icons/doge';

export type CoinList = 'BTC' | 'ETH' | 'USDT' | 'BNB' | 'USDC' | 'ADA' | 'DOGE';

const coinIcons: Record<CoinList, JSX.Element> = {
  BTC: <Bitcoin />,
  ETH: <Ethereum />,
  USDT: <Tether />,
  BNB: <Bnb />,
  USDC: <Usdc />,
  ADA: <Cardano />,
  DOGE: <Doge />,
};

interface CurrencySwapIconsProps {
  from: CoinList;
  to: CoinList;
}

export default function CurrencySwapIcons({
  from,
  to,
}: CurrencySwapIconsProps) {
  return (
    <div className="flex items-center">
      <div className="flex items-center">
        <div className="relative">{coinIcons[from]}</div>
        <div className="ltr:-ml-1.5 rtl:-mr-1.5">{coinIcons[to]}</div>
      </div>
      <div className="whitespace-nowrap text-sm font-medium uppercase text-black ltr:ml-3 rtl:mr-3 dark:text-white">
        {from}-{to}
      </div>
    </div>
  );
}
