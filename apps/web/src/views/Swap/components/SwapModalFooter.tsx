import { useTranslation } from '@pancakeswap/localization';
import { Currency, CurrencyAmount, Trade, TradeType } from '@pancakeswap/sdk';
import { AutoColumn, AutoRenewIcon, QuestionHelper, Text } from '@pancakeswap/uikit';
import { formatAmount } from '@pancakeswap/utils/formatFractions';
import { AutoRow, RowBetween, RowFixed } from 'components/Layout/Row';
import Button from 'components/Tailwind/ui/button';
import { BUYBACK_FEE, LP_HOLDERS_FEE, TOTAL_FEE, TREASURY_FEE } from 'config/constants/info';
import { useMemo, useState } from 'react';
import { Field } from 'state/swap/actions';
import styled from 'styled-components';
import { computeTradePriceBreakdown, formatExecutionPrice, warningSeverity } from 'utils/exchange';
import FormattedPriceImpact from './FormattedPriceImpact';
import { StyledBalanceMaxMini, SwapCallbackError } from './styleds';

const SwapModalFooterContainer = styled(AutoColumn)`
    margin-top: 24px;
    padding: 16px;
    border-radius: ${({ theme }) => theme.radii.default};
    border: 1px solid ${({ theme }) => theme.colors.cardBorder};
    background-color: ${({ theme }) => theme.colors.background};
`;

export default function SwapModalFooter({
    trade,
    slippageAdjustedAmounts,
    isEnoughInputBalance,
    onConfirm,
    swapErrorMessage,
    disabledConfirm,
}: {
    trade: Trade<Currency, Currency, TradeType>;
    slippageAdjustedAmounts: { [field in Field]?: CurrencyAmount<Currency> };
    isEnoughInputBalance: boolean;
    onConfirm: () => void;
    swapErrorMessage?: string | undefined;
    disabledConfirm: boolean;
}) {
    const { t } = useTranslation();
    const [showInverted, setShowInverted] = useState<boolean>(false);
    const { priceImpactWithoutFee, realizedLPFee } = useMemo(
        () => computeTradePriceBreakdown(trade),
        [trade]
    );
    const severity = warningSeverity(priceImpactWithoutFee);

    const totalFeePercent = `${(TOTAL_FEE * 100).toFixed(2)}%`;
    const lpHoldersFeePercent = `${(LP_HOLDERS_FEE * 100).toFixed(2)}%`;
    const treasuryFeePercent = `${(TREASURY_FEE * 100).toFixed(4)}%`;
    const buyBackFeePercent = `${(BUYBACK_FEE * 100).toFixed(4)}%`;

    return (
        <>
            <SwapModalFooterContainer>
                <RowBetween align="center">
                    <Text fontSize="14px">{t('Price')}</Text>
                    <Text
                        fontSize="14px"
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            display: 'flex',
                            textAlign: 'right',
                            paddingLeft: '10px',
                        }}
                    >
                        {formatExecutionPrice(trade, showInverted)}
                        <StyledBalanceMaxMini onClick={() => setShowInverted(!showInverted)}>
                            <AutoRenewIcon width="14px" />
                        </StyledBalanceMaxMini>
                    </Text>
                </RowBetween>

                <RowBetween>
                    <RowFixed>
                        <Text fontSize="14px">
                            {trade.tradeType === TradeType.EXACT_INPUT
                                ? t('Minimum received')
                                : t('Maximum sold')}
                        </Text>
                        <QuestionHelper
                            className="text-sm leading-6 tracking-tighter text-gray-600 dark:text-gray-400"
                            text={t(
                                'Your transaction will revert if there is a large, unfavorable price movement before it is confirmed.'
                            )}
                            ml="4px"
                            placement="top"
                        />
                    </RowFixed>
                    <RowFixed>
                        <Text fontSize="14px">
                            {trade.tradeType === TradeType.EXACT_INPUT
                                ? formatAmount(slippageAdjustedAmounts[Field.OUTPUT], 4) ?? '-'
                                : formatAmount(slippageAdjustedAmounts[Field.INPUT], 4) ?? '-'}
                        </Text>
                        <Text fontSize="14px" marginLeft="4px">
                            {trade.tradeType === TradeType.EXACT_INPUT
                                ? trade.outputAmount.currency.symbol
                                : trade.inputAmount.currency.symbol}
                        </Text>
                    </RowFixed>
                </RowBetween>
                <RowBetween>
                    <RowFixed>
                        <Text fontSize="14px">{t('Price Impact')}</Text>
                        <QuestionHelper
                            text={t(
                                'The difference between the market price and your price due to trade size.'
                            )}
                            ml="4px"
                            placement="top"
                            className="text-sm leading-6 tracking-tighter text-gray-600 dark:text-gray-400"
                        />
                    </RowFixed>
                    <FormattedPriceImpact priceImpact={priceImpactWithoutFee} />
                </RowBetween>
                <RowBetween>
                    <RowFixed>
                        <Text fontSize="14px">{t('Liquidity Provider Fee')}</Text>
                        <QuestionHelper
                            text={
                                <>
                                    <Text mb="12px">
                                        {t('For each trade a %amount% fee is paid', {
                                            amount: totalFeePercent,
                                        })}
                                    </Text>
                                    <Text>
                                        -{' '}
                                        {t('%amount% to LP token holders', {
                                            amount: lpHoldersFeePercent,
                                        })}
                                    </Text>
                                    <Text>
                                        -{' '}
                                        {t('%amount% to the Treasury', {
                                            amount: treasuryFeePercent,
                                        })}
                                    </Text>
                                    <Text>
                                        -{' '}
                                        {t('%amount% towards CAKE buyback and burn', {
                                            amount: buyBackFeePercent,
                                        })}
                                    </Text>
                                </>
                            }
                            ml="4px"
                            placement="top"
                        />
                    </RowFixed>
                    <Text fontSize="14px">
                        {realizedLPFee
                            ? `${formatAmount(realizedLPFee, 6)} ${
                                  trade.inputAmount.currency.symbol
                              }`
                            : '-'}
                    </Text>
                </RowBetween>
            </SwapModalFooterContainer>

            <AutoRow>
                <Button
                    onClick={onConfirm}
                    disabled={disabledConfirm}
                    id="confirm-swap-or-send"
                    className="mt-4 w-full"
                >
                    {severity > 2 ||
                    (trade.tradeType === TradeType.EXACT_OUTPUT && !isEnoughInputBalance)
                        ? t('Swap Anyway')
                        : t('Confirm Swap')}
                </Button>

                {swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
            </AutoRow>
        </>
    );
}
