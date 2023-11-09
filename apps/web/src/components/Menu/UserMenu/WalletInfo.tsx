import { useTranslation } from '@pancakeswap/localization';
import { ChainId, WNATIVE } from '@pancakeswap/sdk';
import {
    Box,
    CopyAddress,
    Flex,
    FlexGap,
    InjectedModalProps,
    LinkExternal,
    Message,
    Skeleton,
    Text,
} from '@pancakeswap/uikit';
import { formatBigNumber, getFullDisplayBalance } from '@pancakeswap/utils/formatBalance';
import { ChainLogo } from 'components/Logo/ChainLogo';
import Button from 'components/Tailwind/ui/button';
import { FetchStatus } from 'config/constants/types';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import useAuth from 'hooks/useAuth';
import useNativeCurrency from 'hooks/useNativeCurrency';
import { useSidNameForAddress } from 'hooks/useSid';
import useTokenBalance, { useGetCakeBalance } from 'hooks/useTokenBalance';
import { getBlockExploreLink, getBlockExploreName } from 'utils';
import { useBalance } from 'wagmi';

interface WalletInfoProps {
    hasLowNativeBalance: boolean;
    switchView: (newIndex: number) => void;
    onDismiss: InjectedModalProps['onDismiss'];
}

const WalletInfo: React.FC<WalletInfoProps> = ({ hasLowNativeBalance, onDismiss }) => {
    const { t } = useTranslation();
    const { account, chainId, chain } = useActiveWeb3React();
    const { sidName } = useSidNameForAddress(account);
    const isBSC = chainId === ChainId.BSC;
    const bnbBalance = useBalance({ address: account, chainId: ChainId.BSC });
    const nativeBalance = useBalance({ address: account, enabled: !isBSC });
    const native = useNativeCurrency();
    const wNativeToken = !isBSC ? WNATIVE[chainId] : null;
    const wBNBToken = WNATIVE[ChainId.BSC];
    const { balance: wNativeBalance, fetchStatus: wNativeFetchStatus } = useTokenBalance(
        wNativeToken?.address
    );
    const { balance: wBNBBalance, fetchStatus: wBNBFetchStatus } = useTokenBalance(
        wBNBToken?.address,
        true
    );
    const { balance: cakeBalance, fetchStatus: cakeFetchStatus } = useGetCakeBalance();
    const { logout } = useAuth();

    const handleLogout = () => {
        onDismiss?.();
        logout();
    };

    return (
        <>
            <p className="text-xs font-medium text-gray-900 dark:text-white sm:text-sm">
                {t('Your Address')}
            </p>
            <FlexGap flexDirection="column" mb="24px" gap="8px">
                <CopyAddress tooltipMessage={t('Copied')} account={account} />
                {sidName ? (
                    <p className="text truncate text-ellipsis bg-center text-xs text-gray-500 ltr:pl-4 rtl:pr-4 dark:text-gray-300 sm:text-sm">
                        {sidName}
                    </p>
                ) : null}
            </FlexGap>
            {hasLowNativeBalance && (
                <Message variant="warning" mb="24px">
                    <Box>
                        <p className="text-medium font-bold text-gray-900 dark:text-white">
                            {t('%currency% Balance Low', {
                                currency: native.symbol,
                            })}
                        </p>
                        <p className="text-sm leading-6 tracking-tighter text-gray-600 dark:text-gray-400">
                            {t('You need %currency% for transaction fees.', {
                                currency: native.symbol,
                            })}
                        </p>
                    </Box>
                </Message>
            )}
            {!isBSC && chain && (
                <div>
                    <div className="mb-2å flex" style={{ justifyContent: 'space-between' }}>
                        <div
                            className="flex"
                            style={{
                                alignItems: 'center',
                            }}
                        >
                            <ChainLogo chainId={chain.id} />
                            <p
                                className="text-sm tracking-tighter text-gray-600 dark:text-gray-400"
                                style={{
                                    width: 168,
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                }}
                            >
                                {chain.name}
                            </p>
                        </div>
                        <LinkExternal href={getBlockExploreLink(account, 'address', chainId)}>
                            {getBlockExploreName(chainId)}
                        </LinkExternal>
                    </div>
                    <Flex alignItems="center" justifyContent="space-between">
                        <Text color="textSubtle">
                            {native.symbol} {t('Balance')}
                        </Text>
                        {!nativeBalance.isFetched ? (
                            <Skeleton height="22px" width="60px" />
                        ) : (
                            <Text>{formatBigNumber(nativeBalance.data.value, 6)}</Text>
                        )}
                    </Flex>
                    {wNativeBalance.gt(0) && (
                        <Flex alignItems="center" justifyContent="space-between">
                            <Text color="textSubtle">
                                {wNativeToken.symbol} {t('Balance')}
                            </Text>
                            {wNativeFetchStatus !== FetchStatus.Fetched ? (
                                <Skeleton height="22px" width="60px" />
                            ) : (
                                <Text>
                                    {getFullDisplayBalance(
                                        wNativeBalance,
                                        wNativeToken.decimals,
                                        6
                                    )}
                                </Text>
                            )}
                        </Flex>
                    )}
                </div>
            )}
            <Box mb="24px">
                <Flex justifyContent="space-between" alignItems="center" mb="16px">
                    <div className="flex items-center rounded-lg bg-white p-1 shadow-card last:mb-0 dark:bg-light-dark">
                        <ChainLogo chainId={ChainId.BSC} />
                        <Text color="white" ml="4px">
                            BNB Smart Chain
                        </Text>
                    </div>
                    <LinkExternal
                        isBscScan
                        href={getBlockExploreLink(account, 'address', ChainId.BSC)}
                    >
                        {getBlockExploreName(ChainId.BSC)}
                    </LinkExternal>
                </Flex>
                <Flex alignItems="center" justifyContent="space-between">
                    <p className="text-sm leading-6 -tracking-wider text-gray-600 dark:text-gray-400">
                        BNB {t('Balance')}
                    </p>
                    {!bnbBalance.isFetched ? (
                        <Skeleton height="22px" width="60px" />
                    ) : (
                        <p className="text-sm leading-6 -tracking-wider text-gray-600 dark:text-gray-400">
                            {formatBigNumber(bnbBalance.data.value, 6)}
                        </p>
                    )}
                </Flex>
                {wBNBBalance.gt(0) && (
                    <Flex alignItems="center" justifyContent="space-between">
                        <p className="text-sm leading-6 -tracking-wider text-gray-600 dark:text-gray-400">
                            WBNB {t('Balance')}
                        </p>
                        {wBNBFetchStatus !== FetchStatus.Fetched ? (
                            <Skeleton height="22px" width="60px" />
                        ) : (
                            <p className="text-sm leading-6 -tracking-wider text-gray-600 dark:text-gray-400">
                                {getFullDisplayBalance(wBNBBalance, wBNBToken.decimals, 6)}
                            </p>
                        )}
                    </Flex>
                )}
                <Flex alignItems="center" justifyContent="space-between">
                    <p className="text-sm leading-6 -tracking-wider text-gray-600 dark:text-gray-400">
                        {t('CAKE Balance')}
                    </p>
                    {cakeFetchStatus !== FetchStatus.Fetched ? (
                        <Skeleton height="22px" width="60px" />
                    ) : (
                        <p className="text-sm leading-6 -tracking-wider text-gray-600 dark:text-gray-400">
                            {formatBigNumber(cakeBalance, 3)}
                        </p>
                    )}
                </Flex>
            </Box>
            {/* <CakeBenefitsCard onDismiss={onDismiss} /> */}
            <Button
                shape="rounded"
                variant="solid"
                color="gray"
                className="dark:bg-gray-800"
                onClick={handleLogout}
            >
                {t('Disconnect Wallet')}
            </Button>
        </>
    );
};

export default WalletInfo;
