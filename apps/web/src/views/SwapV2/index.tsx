import { useTranslation } from '@pancakeswap/localization';
import { Currency } from '@pancakeswap/sdk';
import { useMatchBreakpoints } from '@pancakeswap/uikit';
import replaceBrowserHistory from '@pancakeswap/utils/replaceBrowserHistory';
// import cn from 'classnames';
// import { SwapIcon } from 'components/Tailwind/icons/swap-icon';
// import Button from 'components/Tailwind/ui/button';
// import CoinInput from 'components/Tailwind/ui/coin-input';
// import TransactionInfo from 'components/Tailwind/ui/transaction-info';
import { AppBody } from 'components/App';
import { useCurrency } from 'hooks/Tokens';
import { useSwapHotTokenDisplay } from 'hooks/useSwapHotTokenDisplay';
import React from 'react';
import { Field } from 'state/swap/actions';
import { useDefaultsFromURLSearch, useSingleTokenSwapInfo, useSwapState } from 'state/swap/hooks';
import { useSwapActionHandlers } from 'state/swap/useSwapActionHandlers';
import currencyId from 'utils/currencyId';
import { SwapFeaturesContext } from 'views/Swap/SwapFeaturesContext';
// import { V3SwapForm } from 'views/Swap/V3Swap';
import SwapForm from 'views/Swap/components/SwapForm';
// import ComparisonChart from 'components/Tailwind/ui/chats/retro-comparision-chart';
import PriceChartContainer from 'views/Swap/components/Chart/PriceChartContainer';
import useWarningImport from 'views/Swap/hooks/useWarningImport';
import { StyledInputCurrencyWrapper } from 'views/Swap/styles';

const SwapV2 = () => {
    const [toggleCoin, setToggleCoin] = React.useState(false);
    const { isDesktop } = useMatchBreakpoints();
    const [isSwapHotTokenDisplay, setIsSwapHotTokenDisplay] = useSwapHotTokenDisplay();
    const { t } = useTranslation();

    const {
        isChartExpanded,
        isChartDisplayed,
        setIsChartDisplayed,
        setIsChartExpanded,
        isChartSupported,
    } = React.useContext(SwapFeaturesContext);

    const {
        [Field.INPUT]: { currencyId: inputCurrencyId },
        [Field.OUTPUT]: { currencyId: outputCurrencyId },
    } = useSwapState();

    const inputCurrency = useCurrency(inputCurrencyId);
    const outputCurrency = useCurrency(outputCurrencyId);

    const currencies: { [field in Field]?: Currency } = {
        [Field.INPUT]: inputCurrency ?? undefined,
        [Field.OUTPUT]: outputCurrency ?? undefined,
    };

    const singleTokenPrice = useSingleTokenSwapInfo(
        inputCurrencyId,
        inputCurrency,
        outputCurrencyId,
        outputCurrency
    );

    const warningSwapHandler = useWarningImport();
    useDefaultsFromURLSearch();

    const { onCurrencySelection } = useSwapActionHandlers();

    const handleOutputSelect = React.useCallback(
        (newCurrencyOutput: Currency) => {
            onCurrencySelection(Field.OUTPUT, newCurrencyOutput);
            warningSwapHandler(newCurrencyOutput);

            const newCurrencyOutputId = currencyId(newCurrencyOutput);
            if (newCurrencyOutputId === inputCurrencyId) {
                replaceBrowserHistory('inputCurrency', outputCurrencyId);
            }
            replaceBrowserHistory('outputCurrency', newCurrencyOutputId);
        },

        [inputCurrencyId, outputCurrencyId, onCurrencySelection, warningSwapHandler]
    );

    return (
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-12">
            <div className="col-span-1  rounded-lg dark:bg-light-dark md:col-span-9 ">
                <PriceChartContainer
                    inputCurrencyId={inputCurrencyId}
                    inputCurrency={currencies[Field.INPUT]}
                    outputCurrencyId={outputCurrencyId}
                    outputCurrency={currencies[Field.OUTPUT]}
                    isChartExpanded
                    setIsChartExpanded={setIsChartExpanded}
                    isChartDisplayed
                    currentSwapPrice={singleTokenPrice}
                />
            </div>

            <div className="col-span-1 rounded-lg bg-white p-6 shadow-card dark:bg-light-dark md:col-span-3">
                <StyledInputCurrencyWrapper mt={isChartExpanded ? '24px' : '0'}>
                    <AppBody>
                        <SwapForm />
                    </AppBody>
                </StyledInputCurrencyWrapper>
            </div>
        </div>
    );
};

export default SwapV2;
