import { useTranslation } from '@pancakeswap/localization';
import { ChainId, Currency, Token } from '@pancakeswap/sdk';
import { WrappedTokenInfo } from '@pancakeswap/token-lists';
import {
    AutoColumn,
    BscScanIcon,
    Checkbox,
    ErrorIcon,
    Flex,
    Grid,
    HelpIcon,
    Link,
    ListLogo,
    Message,
    Tag,
    Text,
    useTooltip,
} from '@pancakeswap/uikit';
import truncateHash from '@pancakeswap/utils/truncateHash';
import Button from 'components/Tailwind/ui/button';
import { SUPPORT_ONLY_BSC } from 'config/constants/supportChains';
import { useActiveChainId } from 'hooks/useActiveChainId';
import { useState } from 'react';
import { useCombinedInactiveList } from 'state/lists/hooks';
import { useAddUserToken } from 'state/user/hooks';
import useSWRImmutable from 'swr/immutable';
import { getBlockExploreLink, getBlockExploreName } from 'utils';
import { chains } from 'utils/wagmi';
import AccessRisk from 'views/Swap/components/AccessRisk';
import { TOKEN_RISK, fetchRiskToken } from 'views/Swap/hooks/fetchTokenRisk';

interface ImportProps {
    tokens: Token[];
    handleCurrencySelect?: (currency: Currency) => void;
}

const getStandard = (chainId: ChainId) =>
    chainId !== ChainId.BSC && chainId !== ChainId.BSC_TESTNET ? 'ERC20' : 'BEP20';

function ImportToken({ tokens, handleCurrencySelect }: ImportProps) {
    const { chainId } = useActiveChainId();

    const { t } = useTranslation();

    const [confirmed, setConfirmed] = useState(false);

    const addToken = useAddUserToken();

    // use for showing import source on inactive tokens
    const inactiveTokenList = useCombinedInactiveList();

    const { data: hasRiskToken } = useSWRImmutable(tokens && ['has-risks', tokens], async () => {
        const result = await Promise.all(
            tokens.map((token) => fetchRiskToken(token.address, token.chainId))
        );
        return result.some((r) => r.riskLevel > TOKEN_RISK.MEDIUM);
    });

    const { targetRef, tooltip, tooltipVisible } = useTooltip(
        t(
            'I have read the scanning result, understood the risk and want to proceed with token importing.'
        )
    );

    return (
        <AutoColumn gap="lg">
            <Message variant="warning">
                <Text>
                    {t(
                        'Anyone can create a %standard% token on %network% with any name, including creating fake versions of existing tokens and tokens that claim to represent projects that do not have a token.',
                        {
                            standard: getStandard(chainId),
                            network: chains.find((c) => c.id === chainId)?.name,
                        }
                    )}
                    <br />
                    <br />
                    {t('If you purchase an arbitrary token, you may be unable to sell it back.')}
                </Text>
            </Message>

            {tokens.map((token) => {
                const list =
                    token.chainId && inactiveTokenList?.[token.chainId]?.[token.address]?.list;
                const address = token.address ? `${truncateHash(token.address)}` : null;
                return (
                    <Flex key={token.address} alignItems="center" justifyContent="space-between">
                        <Grid gridTemplateRows="1fr 1fr 1fr 1fr" gridGap="4px">
                            {list !== undefined ? (
                                <Tag
                                    variant="success"
                                    outline
                                    scale="sm"
                                    startIcon={
                                        list.logoURI && (
                                            <ListLogo logoURI={list.logoURI} size="12px" />
                                        )
                                    }
                                >
                                    {t('via')} {list.name}
                                </Tag>
                            ) : (
                                <Tag
                                    variant="failure"
                                    outline
                                    scale="sm"
                                    startIcon={<ErrorIcon color="failure" />}
                                >
                                    {t('Unknown Source')}
                                </Tag>
                            )}
                            <Flex alignItems="center">
                                <Text mr="8px">{token.name}</Text>
                                <Text>({token.symbol})</Text>
                            </Flex>
                            {!!token.chainId && (
                                <>
                                    <Text mr="4px">{address}</Text>
                                    <Link
                                        href={getBlockExploreLink(
                                            token.address,
                                            'address',
                                            token.chainId
                                        )}
                                        external
                                    >
                                        (
                                        {t('View on %site%', {
                                            site: getBlockExploreName(token.chainId),
                                        })}
                                        {token.chainId === ChainId.BSC && (
                                            <BscScanIcon color="primary" ml="4px" />
                                        )}
                                        )
                                    </Link>
                                </>
                            )}
                        </Grid>
                        {token && SUPPORT_ONLY_BSC.includes(token.chainId) && (
                            <AccessRisk token={token} />
                        )}
                    </Flex>
                );
            })}

            <Grid gridTemplateRows="1fr 1fr" gridGap="4px">
                <Flex alignItems="center" onClick={() => setConfirmed(!confirmed)}>
                    <Checkbox
                        scale="sm"
                        name="confirmed"
                        type="checkbox"
                        checked={confirmed}
                        onChange={() => setConfirmed(!confirmed)}
                    />
                    <Text ml="8px" style={{ userSelect: 'none' }}>
                        {hasRiskToken ? t('I acknowledge the risk') : t('I understand')}
                    </Text>
                    {hasRiskToken && (
                        <div ref={targetRef}>
                            <HelpIcon color="textSubtle" />
                            {tooltipVisible && tooltip}
                        </div>
                    )}
                </Flex>
                <Button
                    // @ts-ignore
                    disabled={!confirmed}
                    onClick={() => {
                        tokens.forEach((token) => {
                            const inactiveToken =
                                chainId && inactiveTokenList?.[token.chainId]?.[token.address];
                            let tokenToAdd = token;
                            if (inactiveToken) {
                                tokenToAdd = new WrappedTokenInfo({
                                    ...token,
                                    logoURI: inactiveToken.token.logoURI,
                                    name: token.name || inactiveToken.token.name,
                                });
                            }
                            addToken(tokenToAdd);
                        });
                        if (handleCurrencySelect) {
                            handleCurrencySelect(tokens[0]);
                        }
                    }}
                    className=".token-dismiss-button"
                >
                    {hasRiskToken ? t('Proceed') : t('Import')}
                </Button>
            </Grid>
        </AutoColumn>
    );
}

export default ImportToken;
