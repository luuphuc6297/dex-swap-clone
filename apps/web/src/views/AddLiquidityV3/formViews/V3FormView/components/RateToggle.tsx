import { useTranslation } from '@pancakeswap/localization';
import { Currency } from '@pancakeswap/sdk';
import { Button, Flex, SyncAltIcon, Text } from '@pancakeswap/uikit';
import styled from 'styled-components';

const RateToggleButton = styled(Button)`
    border-radius: 8px;
    padding-left: 4px;
    padding-right: 4px;
`;

export default function RateToggle({
    currencyA,
    handleRateToggle,
}: {
    currencyA: Currency;
    handleRateToggle: () => void;
}) {
    const { t } = useTranslation();

    return currencyA ? (
        <Flex justifyContent="center" alignItems="center">
            <p className="mr-2 text-base font-medium">{t('View prices in')}</p>
            <RateToggleButton
                variant="secondary"
                scale="sm"
                onClick={handleRateToggle}
                startIcon={<SyncAltIcon color="primary" />}
            >
                {currencyA?.symbol}
            </RateToggleButton>
        </Flex>
    ) : null;
}
