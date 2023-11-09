import { PositionDetails } from '@pancakeswap/farms';
import { useTranslation } from '@pancakeswap/localization';
import { Pair } from '@pancakeswap/sdk';
import {
    ButtonMenu,
    CardBody,
    CardFooter,
    Checkbox,
    Dots,
    Flex,
    HistoryIcon,
    IconButton,
    Tag,
    Text,
    useModal,
} from '@pancakeswap/uikit';
import { FindOtherLP } from '@pancakeswap/uikit/src/widgets/Liquidity';
import { useWeb3React } from '@pancakeswap/wagmi';
import { AppBody, AppHeader } from 'components/App';
import TransactionsModal from 'components/App/Transactions/TransactionsModal';
import { LiquidityCardRow } from 'components/LiquidityCardRow';
import { RangeTag } from 'components/RangeTag';
import Button from 'components/Tailwind/ui/button';
import useV2PairsByAccount from 'hooks/useV2Pairs';
import { useV3Positions } from 'hooks/v3/useV3Positions';
import { useAtom } from 'jotai';
import NextLink from 'next/link';
import { useMemo, useState } from 'react';
import styled from 'styled-components';
import RootLayout from 'tailwind-layouts/_root-layout';
import atomWithStorageWithErrorCatch from 'utils/atomWithStorageWithErrorCatch';
import { CHAIN_IDS } from 'utils/wagmi';
import { StablePairCard } from 'views/AddLiquidityV3/components/StablePairCard';
import { V2PairCard } from 'views/AddLiquidityV3/components/V2PairCard';
import PositionListItem from 'views/AddLiquidityV3/formViews/V3FormView/components/PoolListItem';
import useStableConfig, {
    LPStablePair,
    StableConfigContext,
    useLPTokensWithBalanceByAccount,
} from 'views/Swap/StableSwap/hooks/useStableConfig';

const Body = styled(CardBody)`
    background-color: ${({ theme }) => theme.colors.dropdownDeep};
`;

export const StableContextProvider = (props: { pair: LPStablePair; account: string }) => {
    const stableConfig = useStableConfig({
        tokenA: props.pair?.token0,
        tokenB: props.pair?.token1,
    });

    if (!stableConfig.stableSwapConfig) return null;

    return (
        <StableConfigContext.Provider value={stableConfig}>
            <StablePairCard {...props} />
        </StableConfigContext.Provider>
    );
};

enum FILTER {
    ALL = 0,
    V3 = 1,
    STABLE = 2,
    V2 = 3,
}

const hideClosePositionAtom = atomWithStorageWithErrorCatch('pcs:hide-close-position', false);

function useHideClosePosition() {
    return useAtom(hideClosePositionAtom);
}

export default function PoolListPage() {
    const { account } = useWeb3React();
    const { t } = useTranslation();

    const [selectedTypeIndex, setSelectedTypeIndex] = useState(FILTER.ALL);
    const [hideClosedPositions, setHideClosedPositions] = useHideClosePosition();

    const { positions, loading: v3Loading } = useV3Positions(account);

    const { data: v2Pairs, loading: v2Loading } = useV2PairsByAccount(account);

    const stablePairs = useLPTokensWithBalanceByAccount(account);

    let v2PairsSection = null;

    if (v2Pairs?.length) {
        v2PairsSection = v2Pairs.map((pair) => (
            <V2PairCard
                key={Pair.getAddress(pair.token0, pair.token1)}
                pair={pair}
                account={account}
            />
        ));
    }

    let stablePairsSection = null;

    if (stablePairs?.length) {
        stablePairsSection = stablePairs.map((pair) => (
            <StableContextProvider key={pair.lpAddress} pair={pair} account={account} />
        ));
    }

    let v3PairsSection = null;

    if (positions?.length) {
        const [openPositions, closedPositions] = positions?.reduce<
            [PositionDetails[], PositionDetails[]]
        >(
            (acc, p) => {
                acc[p.liquidity?.isZero() ? 1 : 0].push(p);
                return acc;
            },
            [[], []]
        ) ?? [[], []];

        const filteredPositions = [
            ...openPositions,
            ...(hideClosedPositions ? [] : closedPositions),
        ];

        v3PairsSection = filteredPositions.map((p) => {
            return (
                <PositionListItem key={p.tokenId.toString()} positionDetails={p}>
                    {({
                        currencyBase,
                        currencyQuote,
                        removed,
                        outOfRange,
                        feeAmount,
                        positionSummaryLink,
                        subtitle,
                        setInverted,
                    }) => (
                        <LiquidityCardRow
                            feeAmount={feeAmount}
                            link={positionSummaryLink}
                            currency0={currencyQuote}
                            currency1={currencyBase}
                            tokenId={p.tokenId}
                            pairText={
                                !currencyQuote || !currencyBase ? (
                                    <Dots>{t('Loading')}</Dots>
                                ) : (
                                    `${currencyQuote.symbol}-${currencyBase.symbol} LP`
                                )
                            }
                            tags={
                                <>
                                    {p.isStaked && (
                                        <Tag outline variant="warning" mr="8px">
                                            Farming
                                        </Tag>
                                    )}
                                    <RangeTag removed={removed} outOfRange={outOfRange} />
                                </>
                            }
                            subtitle={subtitle}
                            onSwitch={() => setInverted((prev) => !prev)}
                        />
                    )}
                </PositionListItem>
            );
        });
    }

    const mainSection = useMemo(() => {
        let resultSection = null;
        if (v3Loading || v2Loading) {
            resultSection = (
                <p className="mb-1 mt-2 text-xs font-medium text-gray-400 sm:text-sm">
                    <Dots>{t('Loading')}</Dots>
                </p>
            );
        } else if (!v2PairsSection && !stablePairsSection && !v3PairsSection) {
            resultSection = (
                <Text
                    className="mb-1 mt-2 text-xs font-medium text-gray-400 sm:text-sm"
                    color="textSubtle"
                    textAlign="center"
                >
                    {t('No liquidity found.')}
                </Text>
            );
        } else {
            // Order should be v3, stable, v2
            const sections = [v3PairsSection, stablePairsSection, v2PairsSection];

            resultSection = selectedTypeIndex
                ? sections.filter((_, index) => selectedTypeIndex === index + 1)
                : sections;
        }

        return resultSection;
    }, [
        selectedTypeIndex,
        stablePairsSection,
        t,
        v2Loading,
        v2PairsSection,
        v3Loading,
        v3PairsSection,
    ]);

    const [onPresentTransactionsModal] = useModal(<TransactionsModal />);

    return (
        <>
            <AppBody
                className="rounded-lg bg-white p-6 shadow-card dark:bg-light-dark"
                style={{
                    maxWidth: '854px',
                    margin: '64px auto auto auto',
                }}
            >
                <AppHeader
                    title={t('Your Liquidity')}
                    subtitle={t('List of your liquidity positions')}
                    IconSlot={
                        <IconButton onClick={onPresentTransactionsModal} variant="text" scale="sm">
                            <HistoryIcon color="textSubtle" width="24px" />
                        </IconButton>
                    }
                    filter={
                        <>
                            <Flex as="label" htmlFor="hide-close-positions" alignItems="center">
                                <Checkbox
                                    id="hide-close-positions"
                                    scale="sm"
                                    name="confirmed"
                                    type="checkbox"
                                    checked={hideClosedPositions}
                                    onChange={() => setHideClosedPositions((prev) => !prev)}
                                />
                                <Text ml="8px" color="textSubtle" fontSize="14px">
                                    {t('Hide closed positions')}
                                </Text>
                            </Flex>

                            <ButtonMenu
                                scale="sm"
                                activeIndex={selectedTypeIndex}
                                onItemClick={(index) => setSelectedTypeIndex(index)}
                                variant="primary"
                            >
                                {/* <ButtonMenuItem>{t('All')}</ButtonMenuItem> */}
                                {/* <ButtonMenuItem>V3</ButtonMenuItem> */}

                                {/* <ButtonMenuItem>V2</ButtonMenuItem> */}
                            </ButtonMenu>
                        </>
                    }
                />
                <Body>
                    {mainSection}

                    {selectedTypeIndex === FILTER.V2 ? <FindOtherLP /> : null}
                </Body>
                <CardFooter style={{ textAlign: 'center' }}>
                    <NextLink href="/add" passHref>
                        <Button
                            id="join-pool-button"
                            fullWidth
                            style={{ display: 'flex', alignItems: 'center' }}
                        >
                            {t('Add Liquidity')}
                        </Button>
                    </NextLink>
                </CardFooter>
            </AppBody>
        </>
    );
}

PoolListPage.getLayout = function getLayout(page) {
    return <RootLayout>{page}</RootLayout>;
};

PoolListPage.chains = CHAIN_IDS;
