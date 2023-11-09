import { AutoColumn, Text } from '@pancakeswap/uikit';
import { useEffect, useMemo, useState } from 'react';

import { Currency } from '@pancakeswap/sdk';
import { FeeAmount } from '@pancakeswap/v3-sdk';
import { EvenWidthAutoRow } from 'components/Layout/EvenWidthAutoRow';
import { SelectButton } from 'components/SelectButton';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import { PoolState } from 'hooks/v3/types';
import { useFeeTierDistribution } from 'hooks/v3/useFeeTierDistribution';
import { usePools } from 'hooks/v3/usePools';

import { FeeOption } from '../formViews/V3FormView/components/FeeOption';
import { FEE_AMOUNT_DETAIL, SelectContainer } from '../formViews/V3FormView/components/shared';
import { HandleFeePoolSelectFn, SELECTOR_TYPE } from '../types';
import HideShowSelectorSection from './HideShowSelectorSection';

export function StableV3Selector({
    handleFeePoolSelect,
    selectorType,
    feeAmount,
    currencyA,
    currencyB,
}: {
    selectorType: SELECTOR_TYPE;
    feeAmount?: FeeAmount;
    currencyA: Currency;
    currencyB: Currency;
    handleFeePoolSelect: HandleFeePoolSelectFn;
}) {
    const [showOptions, setShowOptions] = useState(false);
    const { chainId } = useActiveWeb3React();

    const { isLoading, isError, largestUsageFeeTier, distributions } = useFeeTierDistribution(
        currencyA,
        currencyB
    );

    const pools = usePools([
        [currencyA, currencyB, FeeAmount.LOWEST],
        [currencyA, currencyB, FeeAmount.LOW],
        [currencyA, currencyB, FeeAmount.MEDIUM],
        [currencyA, currencyB, FeeAmount.HIGH],
    ]);

    const poolsByFeeTier: Record<FeeAmount, PoolState> = useMemo(
        () =>
            pools.reduce(
                (acc, [curPoolState, curPool]) => {
                    return {
                        ...acc,
                        ...{ [curPool?.fee as FeeAmount]: curPoolState },
                    };
                },
                {
                    // default all states to NOT_EXISTS
                    [FeeAmount.LOWEST]: PoolState.NOT_EXISTS,
                    [FeeAmount.LOW]: PoolState.NOT_EXISTS,
                    [FeeAmount.MEDIUM]: PoolState.NOT_EXISTS,
                    [FeeAmount.HIGH]: PoolState.NOT_EXISTS,
                }
            ),
        [pools]
    );

    useEffect(() => {
        if (feeAmount || isLoading || isError) {
            return;
        }

        if (!largestUsageFeeTier) {
            // cannot recommend, open options
            setShowOptions(true);
        } else {
            setShowOptions(false);

            handleFeePoolSelect({
                type: SELECTOR_TYPE.V3,
                feeAmount: largestUsageFeeTier,
            });
        }
    }, [feeAmount, isLoading, isError, largestUsageFeeTier, handleFeePoolSelect]);

    return (
        <HideShowSelectorSection
            showOptions={showOptions}
            setShowOptions={setShowOptions}
            heading={
                selectorType === SELECTOR_TYPE.STABLE ? (
                    <AutoColumn>
                        <Text>StableSwap LP</Text>
                    </AutoColumn>
                ) : (
                    FEE_AMOUNT_DETAIL[FeeAmount.LOWEST]?.supportedChains.includes(chainId) && (
                        <AutoColumn>
                            <p className="leading-6 tracking-tighter text-gray-600 dark:text-gray-400">
                                LP{' '}
                                {FEE_AMOUNT_DETAIL[feeAmount]?.label
                                    ? `- ${FEE_AMOUNT_DETAIL[feeAmount]?.label}% fee tier`
                                    : ''}
                            </p>
                        </AutoColumn>
                    )
                )
            }
            content={
                <AutoColumn gap="8px">
                    <EvenWidthAutoRow gap="8px">
                        <SelectButton
                            isActive={selectorType === SELECTOR_TYPE.STABLE}
                            onClick={() => handleFeePoolSelect({ type: SELECTOR_TYPE.STABLE })}
                        >
                            StableSwap LP
                        </SelectButton>
                        {FEE_AMOUNT_DETAIL[FeeAmount.LOWEST]?.supportedChains.includes(chainId) && (
                            <SelectButton
                                isActive={selectorType === SELECTOR_TYPE.V3}
                                onClick={() => handleFeePoolSelect({ type: SELECTOR_TYPE.V3 })}
                            >
                                LP
                            </SelectButton>
                        )}
                    </EvenWidthAutoRow>
                    {selectorType === SELECTOR_TYPE.V3 && (
                        <SelectContainer>
                            {[
                                FeeAmount.LOWEST,
                                FeeAmount.LOW,
                                FeeAmount.MEDIUM,
                                FeeAmount.HIGH,
                            ].map((_feeAmount) => {
                                const { supportedChains } = FEE_AMOUNT_DETAIL[_feeAmount];
                                if (supportedChains.includes(chainId)) {
                                    return (
                                        <FeeOption
                                            feeAmount={_feeAmount}
                                            active={feeAmount === _feeAmount}
                                            onClick={() =>
                                                handleFeePoolSelect({
                                                    type: SELECTOR_TYPE.V3,
                                                    feeAmount: _feeAmount,
                                                })
                                            }
                                            distributions={distributions}
                                            poolState={poolsByFeeTier[_feeAmount]}
                                            key={_feeAmount}
                                        />
                                    );
                                }
                                return null;
                            })}
                        </SelectContainer>
                    )}
                </AutoColumn>
            }
        />
    );
}
