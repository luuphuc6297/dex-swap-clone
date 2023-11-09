import { ExchangeIcon } from 'components/Tailwind/icons/exchange';
import { HomeIcon } from 'components/Tailwind/icons/home';
import { PoolIcon } from 'components/Tailwind/icons/pool';
import routes from 'config/routes';

export const menuItems = [
    {
        name: 'Home',
        icon: <HomeIcon />,
        href: routes.home,
        // dropdownItems: [],
    },
    {
        name: 'Swap',
        icon: <ExchangeIcon />,
        href: routes.swap,
        // dropdownItems: [],
    },
    {
        name: 'Liquidity',
        icon: <PoolIcon />,
        href: routes.liquidity,
        // dropdownItems: [],
    },
];
