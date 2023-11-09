import { useTranslation } from '@pancakeswap/localization';
import { Box, Flex, Text } from '@pancakeswap/uikit';
import useTheme from 'hooks/useTheme';
import { useMemo } from 'react';
import { useProfile } from 'state/profile/hooks';
import styled from 'styled-components';
import NoConnected from 'views/TradingReward/components/YourTradingReward/NoConnected';
import { useAccount } from 'wagmi';
// import ViewEligiblePairs from 'views/TradingReward/components/YourTradingReward/ViewEligiblePairs'
import NoProfile from 'views/TradingReward/components/YourTradingReward/NoProfile';
// import NoCakeLockedOrExtendLock from 'views/TradingReward/components/YourTradingReward/NoCakeLockedOrExtendLock'
// import NotQualified from 'views/TradingReward/components/YourTradingReward/NotQualified'
import ExpiringUnclaim from 'views/TradingReward/components/YourTradingReward/ExpiringUnclaim';

const BACKGROUND_COLOR =
    'radial-gradient(55.22% 134.13% at 57.59% 0%, #F5DF8E 0%, #FCC631 33.21%, #FF9D00 79.02%)';

const StyledBackground = styled(Flex)<{ showBackgroundColor: boolean }>`
    position: relative;
    flex-direction: column;
    padding-top: 48px;
    background: ${({ showBackgroundColor }) => (showBackgroundColor ? BACKGROUND_COLOR : '')};
    z-index: 0;

    ${({ theme }) => theme.mediaQueries.lg} {
        padding-top: 88px;
    }
`;

const StyledHeading = styled(Text)`
    position: relative;
    font-size: 40px;
    font-weight: 900;
    line-height: 98%;
    letter-spacing: 0.01em;
    background: linear-gradient(166.02deg, #ffb237 -5.1%, #ffeb37 75.24%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin: auto;
    padding: 0 16px;
    text-align: center;

    &::after {
        content: attr(data-text);
        position: absolute;
        left: 0;
        top: 0;
        padding: 0 16px;
        z-index: -1;
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        -webkit-text-stroke: 8px rgb(101, 50, 205, 1);
    }

    ${({ theme }) => theme.mediaQueries.lg} {
        font-size: 56px;
        padding: 0;

        &::after {
            padding: 0;
            -webkit-text-stroke: 10px rgb(101, 50, 205, 1);
        }
    }
`;

const Container = styled(Box)<{ showBackgroundColor: boolean }>`
    position: relative;
    z-index: 1;
    margin: 48px auto;
    width: 100%;
    padding: 0 16px;

    ${({ theme }) => theme.mediaQueries.lg} {
        width: ${({ showBackgroundColor }) => (showBackgroundColor ? '760px' : '1140px')};
    }
`;

const YourTradingReward = () => {
    const { t } = useTranslation();
    const { address: account } = useAccount();
    const { profile } = useProfile();
    const { theme } = useTheme();

    const showBackgroundColor = useMemo(() => !account, [account]);
    const isClaimable = useMemo(() => account && profile?.isActive && false, [account, profile]);

    return (
        <StyledBackground showBackgroundColor={showBackgroundColor}>
            <StyledHeading data-text={t('Your Trading Reward')}>
                {t('Your Trading Reward')}
            </StyledHeading>
            {isClaimable ? (
                <ExpiringUnclaim />
            ) : (
                <Container showBackgroundColor={showBackgroundColor}>
                    <Flex
                        width="100%"
                        borderRadius={32}
                        padding={['24px', '24px', '24px', '48px 0']}
                        flexDirection="column"
                        alignItems={['center']}
                        style={{
                            background: showBackgroundColor
                                ? theme.card.background
                                : BACKGROUND_COLOR,
                        }}
                    >
                        {!account && <NoConnected />}
                        {account && !profile?.isActive && <NoProfile />}
                        {/* <ViewEligiblePairs /> */}
                        {/* <NoCakeLockedOrExtendLock /> */}
                        {/* <NotQualified /> */}
                    </Flex>
                </Container>
            )}
        </StyledBackground>
    );
};

export default YourTradingReward;
