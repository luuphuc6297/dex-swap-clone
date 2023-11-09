import { CommonBasesType } from 'components/SearchModal/types';

import { AutoColumn, Box, Button, Dots, DynamicSection, RowBetween } from '@pancakeswap/uikit';

import { CommitButton } from 'components/CommitButton';
import CurrencyInputPanel from 'components/CurrencyInputPanel';

import { ApprovalState } from 'hooks/useApproveCallback';
import { Field } from 'state/mint/actions';

import { useIsExpertMode } from '@pancakeswap/utils/user';

import { useTranslation } from '@pancakeswap/localization';
import { Percent } from '@pancakeswap/sdk';
import ConnectWalletButton from 'components/ConnectWalletButton';
import { InfoBox } from 'components/InfoBox';
import { Bound } from 'config/constants/types';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import { useCallback } from 'react';
import { LP2ChildrenProps } from 'views/AddLiquidity';

import { HideMedium, MediumOnly, RightContainer } from './V3FormView';
import RangeSelector from './V3FormView/components/RangeSelector';

export default function V2FormView({
    formattedAmounts,
    addIsUnsupported,
    addIsWarning,
    shouldShowApprovalGroup,
    approveACallback,
    approvalA,
    approvalB,
    approveBCallback,
    showFieldBApproval,
    showFieldAApproval,
    currencies,
    buttonDisabled,
    onAdd,
    onPresentAddLiquidityModal,
    errorText,
    onFieldAInput,
    onFieldBInput,
    maxAmounts,
}: LP2ChildrenProps) {
    const mockFn = useCallback(() => '', []);

    const { account, isWrongNetwork } = useActiveWeb3React();
    const { t } = useTranslation();
    const expertMode = useIsExpertMode();

    let buttons = null;
    if (addIsUnsupported || addIsWarning) {
        buttons = (
            <Button disabled mb="4px">
                {t('Unsupported Asset')}
            </Button>
        );
    } else if (!account) {
        buttons = <ConnectWalletButton width="100%" />;
    } else if (isWrongNetwork) {
        buttons = <CommitButton />;
    } else {
        buttons = (
            <AutoColumn gap="md">
                {shouldShowApprovalGroup && (
                    <RowBetween style={{ gap: '8px' }}>
                        {showFieldAApproval && (
                            <Button
                                onClick={approveACallback}
                                disabled={approvalA === ApprovalState.PENDING}
                                width="100%"
                            >
                                {approvalA === ApprovalState.PENDING ? (
                                    <Dots>
                                        {t('Enabling %asset%', {
                                            asset: currencies[Field.CURRENCY_A]?.symbol,
                                        })}
                                    </Dots>
                                ) : (
                                    t('Enable %asset%', {
                                        asset: currencies[Field.CURRENCY_A]?.symbol,
                                    })
                                )}
                            </Button>
                        )}
                        {showFieldBApproval && (
                            <Button
                                onClick={approveBCallback}
                                disabled={approvalB === ApprovalState.PENDING}
                                width="100%"
                            >
                                {approvalB === ApprovalState.PENDING ? (
                                    <Dots>
                                        {t('Enabling %asset%', {
                                            asset: currencies[Field.CURRENCY_B]?.symbol,
                                        })}
                                    </Dots>
                                ) : (
                                    t('Enable %asset%', {
                                        asset: currencies[Field.CURRENCY_B]?.symbol,
                                    })
                                )}
                            </Button>
                        )}
                    </RowBetween>
                )}
                <CommitButton
                    variant={buttonDisabled ? 'danger' : 'primary'}
                    onClick={() => (expertMode ? onAdd() : onPresentAddLiquidityModal())}
                    disabled={buttonDisabled}
                    style={{ color: 'white' }}
                >
                    {errorText || t('Add')}
                </CommitButton>
            </AutoColumn>
        );
    }

    return (
        <>
            <AutoColumn>
                <p className="mb-8 mt-4 text-left font-medium tracking-tighter text-gray-900 dark:text-white xl:text-2xl 3xl:mb-8 3xl:text-[32px]">
                    Deposit Amount
                </p>

                <Box mb="8px">
                    <CurrencyInputPanel
                        maxAmount={maxAmounts[Field.CURRENCY_A]}
                        showUSDPrice
                        onMax={() => {
                            onFieldAInput(maxAmounts[Field.CURRENCY_A]?.toExact() ?? '');
                        }}
                        onPercentInput={(percent) => {
                            if (maxAmounts[Field.CURRENCY_A]) {
                                onFieldAInput(
                                    maxAmounts[Field.CURRENCY_A]
                                        ?.multiply(new Percent(percent, 100))
                                        .toExact() ?? ''
                                );
                            }
                        }}
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

                <CurrencyInputPanel
                    showUSDPrice
                    onPercentInput={(percent) => {
                        if (maxAmounts[Field.CURRENCY_B]) {
                            onFieldBInput(
                                maxAmounts[Field.CURRENCY_B]
                                    ?.multiply(new Percent(percent, 100))
                                    .toExact() ?? ''
                            );
                        }
                    }}
                    onMax={() => {
                        onFieldBInput(maxAmounts[Field.CURRENCY_B]?.toExact() ?? '');
                    }}
                    maxAmount={maxAmounts[Field.CURRENCY_B]}
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
            </AutoColumn>
            <HideMedium>{buttons}</HideMedium>

            <RightContainer>
                <AutoColumn pt="12px" gap="24px">
                    <MediumOnly>{buttons}</MediumOnly>
                </AutoColumn>
            </RightContainer>
        </>
    );
}
