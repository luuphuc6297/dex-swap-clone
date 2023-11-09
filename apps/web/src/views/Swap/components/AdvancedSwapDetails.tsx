import { useTranslation } from '@pancakeswap/localization';
import { Currency, CurrencyAmount, Percent, TradeType } from '@pancakeswap/sdk';
import { LegacyPair as Pair } from '@pancakeswap/smart-router/evm';
import {
    AutoColumn,
    Flex,
    Link,
    Modal,
    ModalV2,
    QuestionHelper,
    SearchIcon,
    Text,
} from '@pancakeswap/uikit';
import { formatAmount } from '@pancakeswap/utils/formatFractions';
import { memo, useState } from 'react';

import { RowBetween, RowFixed } from 'components/Layout/Row';
import { RoutingSettingsButton } from 'components/Menu/GlobalSettings/SettingsModal';
import { Field } from 'state/swap/actions';
import FormattedPriceImpact from './FormattedPriceImpact';
import { RouterViewer } from './RouterViewer';
import SwapRoute from './SwapRoute';

export const TradeSummary = memo(function TradeSummary({
    inputAmount,
    outputAmount,
    tradeType,
    slippageAdjustedAmounts,
    priceImpactWithoutFee,
    realizedLPFee,
    isMM = false,
}: {
    hasStablePair?: boolean;
    inputAmount?: CurrencyAmount<Currency>;
    outputAmount?: CurrencyAmount<Currency>;
    tradeType?: TradeType;
    slippageAdjustedAmounts: {
        INPUT?: CurrencyAmount<Currency>;
        OUTPUT?: CurrencyAmount<Currency>;
    };
    priceImpactWithoutFee?: Percent;
    realizedLPFee?: CurrencyAmount<Currency>;
    isMM?: boolean;
}) {
    const { t } = useTranslation();
    const isExactIn = tradeType === TradeType.EXACT_INPUT;

    return (
        <AutoColumn style={{ padding: '0 24px' }}>
            <RowBetween>
                <RowFixed>
                    <Text fontSize="14px" color="textSubtle" fontFamily="Be Vietnam Pro">
                        {isExactIn ? t('Minimum received') : t('Maximum sold')}
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
                        {isExactIn
                            ? `${formatAmount(slippageAdjustedAmounts[Field.OUTPUT], 4)} ${
                                  outputAmount.currency.symbol
                              }` ?? '-'
                            : `${formatAmount(slippageAdjustedAmounts[Field.INPUT], 4)} ${
                                  inputAmount.currency.symbol
                              }` ?? '-'}
                    </Text>
                </RowFixed>
            </RowBetween>
            {priceImpactWithoutFee && (
                <RowBetween style={{ padding: '4px 0 0 0' }}>
                    <RowFixed>
                        <Text fontSize="14px" color="textSubtle">
                            {t('Price Impact')}
                        </Text>
                        <QuestionHelper
                            className="text-sm leading-6 tracking-tighter text-gray-600 dark:text-gray-400"
                            text={
                                <>
                                    <p className="text-sm leading-6 tracking-tighter text-gray-600 dark:text-gray-400">
                                        <p className="text-sm leading-6 tracking-tighter text-gray-900 dark:text-gray-400">
                                            {t('AMM')}:
                                        </p>
                                        {`${t(
                                            'The difference between the market price and estimated price due to trade size.'
                                        )}`}
                                    </p>
                                    <p className="text-sm leading-6 tracking-tighter text-gray-600 dark:text-gray-400">
                                        <p className="text-sm leading-6 tracking-tighter text-gray-900 dark:text-gray-400">
                                            {t('MM')}:
                                        </p>
                                        {`${t('No slippage against quote from market maker')}`}
                                    </p>
                                </>
                            }
                            ml="4px"
                            placement="top"
                        />
                    </RowFixed>

                    {isMM ? (
                        <Text color="textSubtle">--</Text>
                    ) : (
                        <FormattedPriceImpact priceImpact={priceImpactWithoutFee} />
                    )}
                </RowBetween>
            )}

            {realizedLPFee && (
                <RowBetween style={{ padding: '4px 0 0 0' }}>
                    <RowFixed>
                        <Text fontSize="14px" color="textSubtle">
                            {t('Trading Fee')}
                        </Text>
                        <QuestionHelper
                            text={
                                <>
                                    <p className="text-sm leading-6 -tracking-wider text-gray-600 dark:text-gray-400">
                                        <p className="text-heading-style uppercase text-gray-900 dark:text-white">
                                            {t('AMM')} :{' '}
                                        </p>
                                        {t(
                                            'Fee ranging from 0.1% to 0.01% depending on the pool fee tier. You can check the fee tier by clicking the magnifier icon under the “Route” section.'
                                        )}
                                    </p>
                                    <p className="text-sm leading-6 -tracking-wider text-gray-600 dark:text-gray-400">
                                        <p className="text-heading-style uppercase text-gray-900 dark:text-white">
                                            {t('MM')}:{' '}
                                        </p>
                                        {t(
                                            'Itemswap does not charge any fees for trades. However, the market makers charge an implied fee of 0.05% (non-stablecoin) / 0.01% (stablecoin) factored into the quotes provided by them.'
                                        )}
                                    </p>
                                </>
                            }
                            ml="4px"
                            placement="top"
                        />
                    </RowFixed>
                    <Text fontSize="14px">{`${formatAmount(realizedLPFee, 4)} ${
                        inputAmount.currency.symbol
                    }`}</Text>
                </RowBetween>
            )}
        </AutoColumn>
    );
});

export interface AdvancedSwapDetailsProps {
    hasStablePair?: boolean;
    pairs?: Pair[];
    path?: Currency[];
    priceImpactWithoutFee?: Percent;
    realizedLPFee?: CurrencyAmount<Currency>;
    slippageAdjustedAmounts?: {
        INPUT?: CurrencyAmount<Currency>;
        OUTPUT?: CurrencyAmount<Currency>;
    };
    inputAmount?: CurrencyAmount<Currency>;
    outputAmount?: CurrencyAmount<Currency>;
    tradeType?: TradeType;
    isMM?: boolean;
}

export const AdvancedSwapDetails = memo(function AdvancedSwapDetails({
    pairs,
    path,
    priceImpactWithoutFee,
    realizedLPFee,
    slippageAdjustedAmounts,
    inputAmount,
    outputAmount,
    tradeType,
    hasStablePair,
    isMM = false,
}: AdvancedSwapDetailsProps) {
    const { t } = useTranslation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showRoute = Boolean(path && path.length > 1);
    return (
        <AutoColumn gap="0px">
            {inputAmount && (
                <>
                    <TradeSummary
                        inputAmount={inputAmount}
                        outputAmount={outputAmount}
                        tradeType={tradeType}
                        slippageAdjustedAmounts={slippageAdjustedAmounts}
                        priceImpactWithoutFee={priceImpactWithoutFee}
                        realizedLPFee={realizedLPFee}
                        hasStablePair={hasStablePair}
                        isMM={isMM}
                    />
                    {showRoute && (
                        <>
                            <RowBetween style={{ padding: '0 24px' }}>
                                <span style={{ display: 'flex', alignItems: 'center' }}>
                                    <Text fontSize="14px" color="textSubtle">
                                        {t('Route')}
                                    </Text>
                                    <QuestionHelper
                                        text={t(
                                            'Routing through these tokens resulted in the best price for your trade.'
                                        )}
                                        ml="4px"
                                        placement="top"
                                    />
                                </span>
                                <SwapRoute path={path} />
                                <SearchIcon
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => setIsModalOpen(true)}
                                />
                                <ModalV2
                                    closeOnOverlayClick
                                    isOpen={isModalOpen}
                                    onDismiss={() => setIsModalOpen(false)}
                                >
                                    <Modal
                                        title={
                                            <Flex justifyContent="center">
                                                {t('Route')}{' '}
                                                <QuestionHelper
                                                    text={t(
                                                        'Route is automatically calculated based on your routing preference to achieve the best price for your trade.'
                                                    )}
                                                    ml="4px"
                                                    placement="top"
                                                />
                                            </Flex>
                                        }
                                        onDismiss={() => setIsModalOpen(false)}
                                    >
                                        <RouterViewer
                                            isMM={isMM}
                                            inputCurrency={inputAmount.currency}
                                            pairs={pairs}
                                            path={path}
                                            outputCurrency={outputAmount.currency}
                                        />
                                        <Flex mt="3em" width="100%" justifyContent="center">
                                            <RoutingSettingsButton />
                                        </Flex>
                                    </Modal>
                                </ModalV2>
                            </RowBetween>
                        </>
                    )}
                </>
            )}
        </AutoColumn>
    );
});
