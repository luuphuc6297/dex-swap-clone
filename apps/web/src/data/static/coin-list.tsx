import { Bitcoin } from 'components/Tailwind/icons/bitcoin';
import { Bnb } from 'components/Tailwind/icons/bnb';
import { Cardano } from 'components/Tailwind/icons/cardano';
import { Doge } from 'components/Tailwind/icons/doge';
import { Ethereum } from 'components/Tailwind/icons/ethereum';
import { Tether } from 'components/Tailwind/icons/tether';
import { Usdc } from 'components/Tailwind/icons/usdc';

export const coinList = [
  {
    icon: <Bitcoin />,
    code: 'BTC',
    name: 'Bitcoin',
    price: 19076.29,
  },
  {
    icon: <Ethereum />,
    code: 'ETH',
    name: 'Ethereum',
    price: 1053.28,
  },
  {
    icon: <Tether />,
    code: 'USDT',
    name: 'Tether USD',
    price: 0.999,
  },
  {
    icon: <Bnb />,
    code: 'BNB',
    name: 'Binance Coin',
    price: 214.96,
  },
  {
    icon: <Usdc />,
    code: 'USDC',
    name: 'USD Coin',
    price: 1.001,
  },
  {
    icon: <Cardano />,
    code: 'ADA',
    name: 'Cardano',
    price: 0.448,
  },
  {
    icon: <Doge />,
    code: 'DOGE',
    name: 'Doge Coin',
    price: 0.065,
  },
];
