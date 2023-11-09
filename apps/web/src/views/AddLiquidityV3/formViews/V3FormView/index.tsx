import { CommonBasesType } from 'components/SearchModal/types';

import { Currency, CurrencyAmount, Percent } from '@pancakeswap/sdk';
import {
    AutoColumn,
    AutoRow,
    Box,
    Card,
    ConfirmationModalContent,
    DynamicSection,
    Message,
    MessageText,
    NumericalInput,
    PreTitle,
    RowBetween,
    Text,
    useModal,
} from '@pancakeswap/uikit';
import { useIsExpertMode, useUserSlippage } from '@pancakeswap/utils/user';
import { NonfungiblePositionManager } from '@pancakeswap/v3-sdk';
import CurrencyInputPanel from 'components/CurrencyInputPanel';
import useTransactionDeadline from 'hooks/useTransactionDeadline';
import { useDerivedPositionInfo } from 'hooks/v3/useDerivedPositionInfo';
import useV3DerivedInfo from 'hooks/v3/useV3DerivedInfo';
import { useCallback, useEffect, useState } from 'react';

import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback';
import { Field } from 'state/mint/actions';
import { basisPointsToPercent } from 'utils/exchange';
import { maxAmountSpend } from 'utils/maxAmountSpend';

import { TransactionResponse } from '@ethersproject/providers';
import { useTranslation } from '@pancakeswap/localization';
import LiquidityChartRangeInput from 'components/LiquidityChartRangeInput';
import TransactionConfirmationModal from 'components/TransactionConfirmationModal';
import { Bound } from 'config/constants/types';
import { useIsTransactionUnsupported, useIsTransactionWarning } from 'hooks/Trades';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import { useV3NFTPositionManagerContract } from 'hooks/useContract';
import { useRouter } from 'next/router';
import { useTransactionAdder } from 'state/transactions/hooks';
import styled from 'styled-components';
import { calculateGasMargin } from 'utils';
import { formatCurrencyAmount, formatRawAmount } from 'utils/formatCurrencyAmount';
import { isUserRejected } from 'utils/sentry';
import { V3SubmitButton } from 'views/AddLiquidityV3/components/V3SubmitButton';
import { useSigner } from 'wagmi';

import Button from 'components/Tailwind/ui/button';
import LockedDeposit from './components/LockedDeposit';
import { PositionPreview } from './components/PositionPreview';
import RangeSelector from './components/RangeSelector';
import RateToggle from './components/RateToggle';
import { useRangeHopCallbacks } from './form/hooks/useRangeHopCallbacks';
import { useV3MintActionHandlers } from './form/hooks/useV3MintActionHandlers';
import { useV3FormAddLiquidityCallback, useV3FormState } from './form/reducer';

export const BodyWrapper = styled(Card)`
    border-radius: 24px;
    max-width: 858px;
    width: 100%;
    z-index: 1;
`;

const StyledInput = styled(NumericalInput)`
    background-color: ${({ theme }) => theme.colors.input};
    box-shadow: ${({ theme, error }) => theme.shadows[error ? 'warning' : 'inset']};
    border-radius: 16px;
    padding: 8px 16px;
    font-size: 16px;
    width: 100%;
    margin-bottom: 16px;
`;

/* two-column layout where DepositAmount is moved at the very end on mobile. */
export const ResponsiveTwoColumns = styled.div`
    display: grid;
    grid-column-gap: 32px;
    grid-row-gap: 16px;
    grid-template-columns: 1fr;

    grid-template-rows: max-content;
    grid-auto-flow: row;

    padding-top: 20px;

    ${({ theme }) => theme.mediaQueries.md} {
        grid-template-columns: 1fr 1fr;
    }
`;

export const HideMedium = styled.div`
    ${({ theme }) => theme.mediaQueries.md} {
        display: none;
    }
`;

export const MediumOnly = styled.div`
    display: none;
    ${({ theme }) => theme.mediaQueries.md} {
        display: initial;
    }
`;

export const RightContainer = styled(AutoColumn)`
    height: fit-content;

    grid-row: 2 / 3;
    grid-column: 1;

    ${({ theme }) => theme.mediaQueries.md} {
        grid-row: 1 / 3;
        grid-column: 2;
    }
`;

interface V3FormViewPropsType {
    baseCurrency: Currency;
    quoteCurrency: Currency;
    currencyIdA: string;
    currencyIdB: string;
    feeAmount: number;
}

export default function V3FormView({
    feeAmount,
    baseCurrency,
    quoteCurrency,
    currencyIdA,
    currencyIdB,
}: V3FormViewPropsType) {
    const router = useRouter();
    const { data: signer } = useSigner();
    const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false); // clicked confirm

    const {
        t,
        currentLanguage: { locale },
    } = useTranslation();
    const expertMode = useIsExpertMode();

    const positionManager = useV3NFTPositionManagerContract();
    const { account, chainId, isWrongNetwork } = useActiveWeb3React();
    const addTransaction = useTransactionAdder();

    const { position: existingPosition } = useDerivedPositionInfo(undefined);

    // mint state
    const formState = useV3FormState();
    const { independentField, typedValue, startPriceTypedValue } = formState;

    const {
        pool,
        ticks,
        dependentField,
        price,
        pricesAtTicks,
        parsedAmounts,
        currencyBalances,
        position,
        noLiquidity,
        currencies,
        errorMessage,
        invalidPool,
        invalidRange,
        outOfRange,
        depositADisabled,
        depositBDisabled,
        invertPrice,
        ticksAtLimit,
    } = useV3DerivedInfo(
        baseCurrency ?? undefined,
        quoteCurrency ?? undefined,
        feeAmount,
        baseCurrency ?? undefined,
        existingPosition,
        formState
    );
    const {
        onFieldAInput,
        onFieldBInput,
        onLeftRangeInput,
        onRightRangeInput,
        onStartPriceInput,
        onBothRangeInput,
    } = useV3MintActionHandlers(noLiquidity);

    const isValid = !errorMessage && !invalidRange;

    // modal and loading
    // capital efficiency warning
    const [showCapitalEfficiencyWarning, setShowCapitalEfficiencyWarning] =
        useState<boolean>(false);

    useEffect(() => {
        setShowCapitalEfficiencyWarning(false);
    }, [baseCurrency, quoteCurrency, feeAmount]);

    useEffect(() => {
        if (feeAmount) {
            onBothRangeInput({
                leftTypedValue: '',
                rightTypedValue: '',
            });
        }
        // NOTE: ignore exhaustive-deps to avoid infinite re-render
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [feeAmount]);

    const onAddLiquidityCallback = useV3FormAddLiquidityCallback();

    // txn values
    const deadline = useTransactionDeadline(); // custom from users settings
    const [txHash, setTxHash] = useState<string>('');
    // get formatted amounts
    const formattedAmounts = {
        [independentField]: typedValue,
        [dependentField]: parsedAmounts[dependentField]?.toSignificant(6) ?? '',
    };

    //   // get the max amounts user can add
    const maxAmounts: { [field in Field]?: CurrencyAmount<Currency> } = [
        Field.CURRENCY_A,
        Field.CURRENCY_B,
    ].reduce((accumulator, field) => {
        return {
            ...accumulator,
            [field]: maxAmountSpend(currencyBalances[field]),
        };
    }, {});

    const nftPositionManagerAddress = useV3NFTPositionManagerContract()?.address;
    // check whether the user has approved the router on the tokens
    const [approvalA, approveACallback] = useApproveCallback(
        parsedAmounts[Field.CURRENCY_A],
        nftPositionManagerAddress
    );
    const [approvalB, approveBCallback] = useApproveCallback(
        parsedAmounts[Field.CURRENCY_B],
        nftPositionManagerAddress
    );

    const [allowedSlippage] = useUserSlippage(); // custom from users

    const onAdd = useCallback(async () => {
        if (!chainId || !signer || !account || !nftPositionManagerAddress) return;

        if (!positionManager || !baseCurrency || !quoteCurrency) {
            return;
        }

        if (position && account && deadline) {
            const useNative = baseCurrency.isNative
                ? baseCurrency
                : quoteCurrency.isNative
                ? quoteCurrency
                : undefined;

            const { calldata, value } = NonfungiblePositionManager.addCallParameters(position, {
                slippageTolerance: basisPointsToPercent(allowedSlippage),
                recipient: account,
                deadline: deadline.toString(),
                useNative,
                createPool: noLiquidity,
            });

            const txn: { to: string; data: string; value: string } = {
                to: nftPositionManagerAddress,
                data: calldata,
                value,
            };

            setAttemptingTxn(true);

            signer
                .estimateGas(txn)
                .then((estimate) => {
                    const newTxn = {
                        ...txn,
                        gasLimit: calculateGasMargin(estimate),
                    };

                    return signer.sendTransaction(newTxn).then((response: TransactionResponse) => {
                        const baseAmount = formatRawAmount(
                            parsedAmounts[Field.CURRENCY_A]?.quotient?.toString() ?? '0',
                            baseCurrency.decimals,
                            4
                        );
                        const quoteAmount = formatRawAmount(
                            parsedAmounts[Field.CURRENCY_B]?.quotient?.toString() ?? '0',
                            quoteCurrency.decimals,
                            4
                        );

                        setAttemptingTxn(false);
                        addTransaction(response, {
                            type: 'add-liquidity-v3',
                            summary: `Add ${baseAmount} ${baseCurrency?.symbol} and ${quoteAmount} ${quoteCurrency?.symbol}`,
                        });
                        setTxHash(response.hash);
                        onAddLiquidityCallback(response.hash);
                    });
                })
                .catch((error) => {
                    console.error('Failed to send transaction', error);
                    setAttemptingTxn(false);
                    // we only care if the error is something _other_ than the user rejected the tx
                    if (!isUserRejected(error)) {
                        console.error(error);
                    }
                });
        }
    }, [
        account,
        addTransaction,
        allowedSlippage,
        baseCurrency,
        chainId,
        deadline,
        nftPositionManagerAddress,
        noLiquidity,
        onAddLiquidityCallback,
        parsedAmounts,
        position,
        positionManager,
        quoteCurrency,
        signer,
    ]);

    const handleDismissConfirmation = useCallback(() => {
        // if there was a tx hash, we want to clear the input
        if (txHash) {
            onFieldAInput('');
        }
        setTxHash('');
    }, [onFieldAInput, txHash]);
    const addIsUnsupported = useIsTransactionUnsupported(
        currencies?.CURRENCY_A,
        currencies?.CURRENCY_B
    );

    // get value and prices at ticks
    const { [Bound.LOWER]: tickLower, [Bound.UPPER]: tickUpper } = ticks;
    const { [Bound.LOWER]: priceLower, [Bound.UPPER]: priceUpper } = pricesAtTicks;
    const {
        getDecrementLower,
        getIncrementLower,
        getDecrementUpper,
        getIncrementUpper,
        getSetFullRange,
    } = useRangeHopCallbacks(
        baseCurrency ?? undefined,
        quoteCurrency ?? undefined,
        feeAmount,
        tickLower,
        tickUpper,
        pool
    );
    // we need an existence check on parsed amounts for single-asset deposits
    const showApprovalA = approvalA !== ApprovalState.APPROVED && !!parsedAmounts[Field.CURRENCY_A];
    const showApprovalB = approvalB !== ApprovalState.APPROVED && !!parsedAmounts[Field.CURRENCY_B];

    const pendingText = `Supplying ${
        !depositADisabled ? formatCurrencyAmount(parsedAmounts[Field.CURRENCY_A], 4, locale) : ''
    } ${!depositADisabled ? currencies[Field.CURRENCY_A]?.symbol : ''} ${
        !outOfRange ? 'and' : ''
    } ${
        !depositBDisabled ? formatCurrencyAmount(parsedAmounts[Field.CURRENCY_B], 4, locale) : ''
    } ${!depositBDisabled ? currencies[Field.CURRENCY_B]?.symbol : ''}`;

    const [onPresentAddLiquidityModal] = useModal(
        <TransactionConfirmationModal
            minWidth={['100%', , '420px']}
            title={t('Add Liquidity')}
            customOnDismiss={handleDismissConfirmation}
            attemptingTxn={attemptingTxn}
            hash={txHash}
            content={() => (
                <ConfirmationModalContent
                    topContent={() =>
                        position ? (
                            <PositionPreview
                                position={position}
                                inRange={!outOfRange}
                                ticksAtLimit={ticksAtLimit}
                                baseCurrencyDefault={baseCurrency}
                            />
                        ) : null
                    }
                    bottomContent={() => (
                        <Button className="mt-2 w-full" onClick={onAdd}>
                            {t('Add')}
                        </Button>
                    )}
                />
            )}
            pendingText={pendingText}
        />,
        true,
        true,
        'TransactionConfirmationModal'
    );

    const addIsWarning = useIsTransactionWarning(currencies?.CURRENCY_A, currencies?.CURRENCY_B);

    const handleButtonSubmit = useCallback(
        () => (expertMode ? onAdd() : onPresentAddLiquidityModal()),
        [expertMode, onAdd, onPresentAddLiquidityModal]
    );

    const buttons = (
        <V3SubmitButton
            addIsUnsupported={addIsUnsupported}
            addIsWarning={addIsWarning}
            account={account}
            isWrongNetwork={isWrongNetwork}
            approvalA={approvalA}
            approvalB={approvalB}
            isValid={isValid}
            showApprovalA={showApprovalA}
            approveACallback={approveACallback}
            currencies={currencies}
            approveBCallback={approveBCallback}
            showApprovalB={showApprovalB}
            parsedAmounts={parsedAmounts}
            onClick={handleButtonSubmit}
            attemptingTxn={attemptingTxn}
            errorMessage={errorMessage}
            buttonText={t('Add')}
            depositADisabled={depositADisabled}
            depositBDisabled={depositBDisabled}
        />
    );

    return (
        <>
            <DynamicSection
                style={{
                    gridAutoRows: 'max-content',
                    gridAutoColumns: '100%',
                }}
                disabled={
                    !feeAmount ||
                    invalidPool ||
                    (noLiquidity && !startPriceTypedValue) ||
                    (!priceLower && !priceUpper)
                }
            >
                <p className="mb-8 mt-4 text-left font-medium tracking-tighter text-gray-900 dark:text-white xl:text-2xl 3xl:mb-8 3xl:text-[32px]">
                    {t('Deposit Amount')}
                </p>
                <LockedDeposit locked={depositADisabled} mb="8px">
                    <Box mb="8px">
                        <CurrencyInputPanel
                            showUSDPrice
                            maxAmount={maxAmounts[Field.CURRENCY_A]}
                            onMax={() =>
                                onFieldAInput(maxAmounts[Field.CURRENCY_A]?.toExact() ?? '')
                            }
                            onPercentInput={(percent) =>
                                onFieldAInput(
                                    maxAmounts[Field.CURRENCY_A]
                                        ?.multiply(new Percent(percent, 100))
                                        .toExact() ?? ''
                                )
                            }
                            disableCurrencySelect
                            value={formattedAmounts[Field.CURRENCY_A]}
                            onUserInput={onFieldAInput}
                            showQuickInputButton
                            showMaxButton
                            currency={currencies[Field.CURRENCY_A]}
                            id="add-liquidity-input-tokena"
                            showCommonBases
                            commonBasesType={CommonBasesType.LIQUIDITY}
                        />
                    </Box>
                </LockedDeposit>

                <LockedDeposit locked={depositBDisabled} mb="8px">
                    <CurrencyInputPanel
                        showUSDPrice
                        maxAmount={maxAmounts[Field.CURRENCY_B]}
                        onMax={() => onFieldBInput(maxAmounts[Field.CURRENCY_B]?.toExact() ?? '')}
                        onPercentInput={(percent) =>
                            onFieldBInput(
                                maxAmounts[Field.CURRENCY_B]
                                    ?.multiply(new Percent(percent, 100))
                                    .toExact() ?? ''
                            )
                        }
                        disableCurrencySelect
                        value={formattedAmounts[Field.CURRENCY_B]}
                        onUserInput={onFieldBInput}
                        showQuickInputButton
                        showMaxButton
                        currency={currencies[Field.CURRENCY_B]}
                        id="add-liquidity-input-tokenb"
                        showCommonBases
                        commonBasesType={CommonBasesType.LIQUIDITY}
                    />
                </LockedDeposit>
            </DynamicSection>
            <HideMedium>{buttons}</HideMedium>

            <RightContainer>
                <AutoColumn gap="16px">
                    {noLiquidity && (
                        <Box>
                            <PreTitle mb="8px">{t('Set Starting Price')}</PreTitle>
                            <Message variant="warning" mb="8px">
                                <MessageText>
                                    {t(
                                        'This pool must be initialized before you can add liquidity. To initialize, select a starting price for the pool. Then, enter your liquidity price range and deposit amount. Gas fees will be higher than usual due to the initialization transaction.'
                                    )}
                                    <br />
                                    <br />
                                </MessageText>
                            </Message>
                            <StyledInput
                                className="start-price-input"
                                value={startPriceTypedValue}
                                onUserInput={onStartPriceInput}
                            />
                            <AutoRow justifyContent="space-between" mb="24px">
                                <Text>Current {baseCurrency?.symbol} Price:</Text>
                                <Text>
                                    {price
                                        ? invertPrice
                                            ? price?.invert()?.toSignificant(5)
                                            : price?.toSignificant(5)
                                        : '-'}
                                    <span style={{ marginLeft: '4px' }}>
                                        {quoteCurrency?.symbol}
                                    </span>
                                </Text>
                            </AutoRow>
                        </Box>
                    )}
                    {/* <DynamicSection disabled={!feeAmount || invalidPool}>
                        <RowBetween mb="8px">
                            <p className='dark:text-white" text-sm font-bold uppercase tracking-wider text-gray-900'>
                                {t('Set Price Range')}
                            </p>
                            <RateToggle
                                currencyA={baseCurrency}
                                handleRateToggle={() => {
                                    if (!ticksAtLimit[Bound.LOWER] && !ticksAtLimit[Bound.UPPER]) {
                                        onLeftRangeInput(
                                            (invertPrice
                                                ? priceLower
                                                : priceUpper?.invert()
                                            )?.toSignificant(6) ?? ''
                                        );
                                        onRightRangeInput(
                                            (invertPrice
                                                ? priceUpper
                                                : priceLower?.invert()
                                            )?.toSignificant(6) ?? ''
                                        );
                                        onFieldAInput(formattedAmounts[Field.CURRENCY_B] ?? '');
                                    }

                                    router.replace(
                                        {
                                            pathname: router.pathname,
                                            query: {
                                                ...router.query,
                                                currency: [
                                                    currencyIdB,
                                                    currencyIdA,
                                                    feeAmount ? feeAmount.toString() : '',
                                                ],
                                            },
                                        },
                                        undefined,
                                        {
                                            shallow: true,
                                        }
                                    );
                                }}
                            />
                        </RowBetween>

                        {!noLiquidity && (
                            <>
                                {price && baseCurrency && quoteCurrency && !noLiquidity && (
                                    <AutoRow
                                        gap="4px"
                                        marginBottom={['24px', '0px']}
                                        justifyContent="center"
                                        style={{ marginTop: '0.5rem' }}
                                    >
                                        <p className="text-center text-sm leading-loose tracking-tight text-gray-600 dark:text-gray-400">
                                            {t('Current Price')}:
                                        </p>
                                        <p className="text-center text-sm leading-loose tracking-tight text-gray-600 dark:text-gray-400">
                                            {invertPrice
                                                ? price.invert().toSignificant(6)
                                                : price.toSignificant(6)}
                                        </p>
                                        <p className="text-center text-sm leading-loose tracking-tight text-gray-600 dark:text-gray-400">
                                            <strong>{quoteCurrency?.symbol}</strong> per{' '}
                                            <strong>{baseCurrency.symbol}</strong>
                                        </p>
                                    </AutoRow>
                                )}
                                <LiquidityChartRangeInput
                                    onBothRangeInput={onBothRangeInput}
                                    key={baseCurrency?.wrapped?.address}
                                    currencyA={baseCurrency ?? undefined}
                                    currencyB={quoteCurrency ?? undefined}
                                    feeAmount={feeAmount}
                                    ticksAtLimit={ticksAtLimit}
                                    price={
                                        price
                                            ? parseFloat(
                                                (invertPrice
                                                    ? price.invert()
                                                    : price
                                                ).toSignificant(8)
                                            )
                                            : undefined
                                    }
                                    priceLower={priceLower}
                                    priceUpper={priceUpper}
                                    onLeftRangeInput={onLeftRangeInput}
                                    onRightRangeInput={onRightRangeInput}
                                    interactive
                                />
                            </>
                        )}
                    </DynamicSection>

                    <DynamicSection
                        disabled={
                            !feeAmount || invalidPool || (noLiquidity && !startPriceTypedValue)
                        }
                        gap="16px"
                    >
                        <RangeSelector
                            priceLower={priceLower}
                            priceUpper={priceUpper}
                            getDecrementLower={getDecrementLower}
                            getIncrementLower={getIncrementLower}
                            getDecrementUpper={getDecrementUpper}
                            getIncrementUpper={getIncrementUpper}
                            onLeftRangeInput={onLeftRangeInput}
                            onRightRangeInput={onRightRangeInput}
                            currencyA={baseCurrency}
                            currencyB={quoteCurrency}
                            feeAmount={feeAmount}
                            ticksAtLimit={ticksAtLimit}
                        />
                        {showCapitalEfficiencyWarning ? (
                            <Message variant="warning">
                                <Box>
                                    <Text fontSize="16px">{t('Efficiency Comparison')}</Text>
                                    <Text color="textSubtle">
                                        {t(
                                            'Full range positions may earn less fees than concentrated positions.'
                                        )}
                                    </Text>
                                    <Button
                                        className="mt-2"
                                        onClick={() => {
                                            setShowCapitalEfficiencyWarning(false);
                                            getSetFullRange();
                                        }}
                                    >
                                        {t('I understand')}
                                    </Button>
                                </Box>
                            </Message>
                        ) : (
                            <Button
                                color="white"
                                className="shadow-card dark:bg-light-dark"
                                onClick={() => {
                                    setShowCapitalEfficiencyWarning(true);
                                }}
                            >
                                {t('Full Range')}
                            </Button>
                        )}

                        {outOfRange ? (
                            <Message variant="warning">
                                <RowBetween>
                                    <Text ml="12px" fontSize="12px">
                                        {t(
                                            'Your position will not earn fees or be used in trades until the market price moves into your range.'
                                        )}
                                    </Text>
                                </RowBetween>
                            </Message>
                        ) : null}
                        {invalidRange ? (
                            <Message variant="warning">
                                <MessageText>
                                    {t(
                                        'Invalid range selected. The min price must be lower than the max price.'
                                    )}
                                </MessageText>
                            </Message>
                        ) : null}
                    </DynamicSection> */}
                    <MediumOnly>{buttons}</MediumOnly>
                </AutoColumn>
            </RightContainer>
        </>
    );
}
