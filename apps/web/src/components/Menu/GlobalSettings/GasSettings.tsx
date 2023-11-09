import { Flex, Button, Text, QuestionHelper } from '@pancakeswap/uikit';
import { useTranslation } from '@pancakeswap/localization';
import { useGasPriceManager } from 'state/user/hooks';
import { GAS_PRICE_GWEI, GAS_PRICE } from 'state/types';
import styled from 'styled-components';

const StyledButton = styled(Button)`
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
    margin-right: 8px;
    margin-top: 8px;
`;
const GasSettings = () => {
    const { t } = useTranslation();
    const [gasPrice, setGasPrice] = useGasPriceManager();

    return (
        <Flex flexDirection="column">
            <Flex mb="12px" alignItems="center">
                <p className="text-sm leading-6 -tracking-wider text-gray-600 dark:text-gray-400">
                    {t('Default Transaction Speed (GWEI)')}
                </p>
                <QuestionHelper
                    text={
                        <Flex flexDirection="column">
                            <Text>
                                {t(
                                    'Adjusts the gas price (transaction fee) for your transaction. Higher GWEI = higher speed = higher fees.'
                                )}
                            </Text>
                            <Text mt="8px">
                                {t(
                                    'Choose “Default” to use the settings from your current blockchain RPC node.'
                                )}
                            </Text>
                        </Flex>
                    }
                    placement="top"
                    ml="4px"
                />
            </Flex>
            <Flex flexWrap="wrap">
                <StyledButton
                    mt="4px"
                    mr="4px"
                    scale="sm"
                    onClick={() => {
                        setGasPrice(GAS_PRICE_GWEI.rpcDefault);
                    }}
                    variant={gasPrice === GAS_PRICE_GWEI.rpcDefault ? 'primary' : 'tertiary'}
                >
                    {t('Default')}
                </StyledButton>
                <StyledButton
                    mt="4px"
                    mr="4px"
                    scale="sm"
                    onClick={() => {
                        setGasPrice(GAS_PRICE_GWEI.default);
                    }}
                    variant={gasPrice === GAS_PRICE_GWEI.default ? 'primary' : 'tertiary'}
                >
                    {t('Standard (%gasPrice%)', { gasPrice: GAS_PRICE.default })}
                </StyledButton>
                <StyledButton
                    mt="4px"
                    mr="4px"
                    scale="sm"
                    onClick={() => {
                        setGasPrice(GAS_PRICE_GWEI.fast);
                    }}
                    variant={gasPrice === GAS_PRICE_GWEI.fast ? 'primary' : 'tertiary'}
                >
                    {t('Fast (%gasPrice%)', { gasPrice: GAS_PRICE.fast })}
                </StyledButton>
                <StyledButton
                    mr="4px"
                    mt="4px"
                    scale="sm"
                    onClick={() => {
                        setGasPrice(GAS_PRICE_GWEI.instant);
                    }}
                    variant={gasPrice === GAS_PRICE_GWEI.instant ? 'primary' : 'tertiary'}
                >
                    {t('Instant (%gasPrice%)', { gasPrice: GAS_PRICE.instant })}
                </StyledButton>
            </Flex>
        </Flex>
    );
};

export default GasSettings;
