import { useTranslation } from '@pancakeswap/localization';
import { Text } from '@pancakeswap/uikit';
import { formatNumber } from '@pancakeswap/utils/formatBalance';
import Container from 'components/Layout/Container';
import { useRouter } from 'next/router';
import { Collection } from 'state/nftMarket/types';
import BaseSubMenu from '../components/BaseSubMenu';
import MarketPageHeader from '../components/MarketPageHeader';
import MarketPageTitle from '../components/MarketPageTitle';
import StatBox, { StatBoxItem } from '../components/StatBox';
import { nftsBaseUrl } from '../constants';
import LowestPriceStatBoxItem from './LowestPriceStatBoxItem';
import TopBar from './TopBar';

interface HeaderProps {
    collection: Collection;
}

const Header: React.FC<React.PropsWithChildren<HeaderProps>> = ({ collection }) => {
    const router = useRouter();
    const collectionAddress = router.query.collectionAddress as string;
    const { totalSupply, numberTokensListed, totalVolumeBNB, banner, avatar } = collection;
    const { t } = useTranslation();

    const volume = totalVolumeBNB
        ? parseFloat(totalVolumeBNB).toLocaleString(undefined, {
              minimumFractionDigits: 3,
              maximumFractionDigits: 3,
          })
        : '0';

    const itemsConfig = [
        {
            label: t('Items'),
            href: `${nftsBaseUrl}/collections/${collectionAddress}`,
        },
        {
            label: t('Traits'),
            href: `${nftsBaseUrl}/collections/${collectionAddress}#traits`,
        },
        {
            label: t('Activity'),
            href: `${nftsBaseUrl}/collections/${collectionAddress}#activity`,
        },
    ];

    return (
        <>
            <MarketPageHeader>
                <TopBar />
                <MarketPageTitle
                    address={collection.address}
                    title={collection.name}
                    description={
                        collection.description ? (
                            <Text color="textSubtle">{t(collection.description)}</Text>
                        ) : null
                    }
                >
                    <StatBox>
                        <StatBoxItem
                            title={t('Items')}
                            stat={formatNumber(Number(totalSupply), 0, 0)}
                        />
                        <StatBoxItem
                            title={t('Items listed')}
                            stat={
                                numberTokensListed
                                    ? formatNumber(Number(numberTokensListed), 0, 0)
                                    : '0'
                            }
                        />
                        <LowestPriceStatBoxItem collectionAddress={collection.address} />
                        <StatBoxItem
                            title={t('Vol. (%symbol%)', { symbol: 'BNB' })}
                            stat={volume}
                        />
                    </StatBox>
                </MarketPageTitle>
            </MarketPageHeader>
            <Container>
                <BaseSubMenu items={itemsConfig} activeItem={router.asPath} mt="24px" mb="8px" />
            </Container>
        </>
    );
};

export default Header;
