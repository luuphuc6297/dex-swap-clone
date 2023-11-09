import { useTheme } from '@pancakeswap/hooks';
import { useTranslation } from '@pancakeswap/localization';
import { Box, Button, Flex, Text } from '@pancakeswap/uikit';
import styled from 'styled-components';

const Container = styled(Box)<{ backgroundColor: string }>`
    padding: 47px 16px 38px 16px;
    background: ${({ backgroundColor }) => backgroundColor};
`;

const TradingRewardBanner = () => {
    const { t } = useTranslation();
    const { isDark } = useTheme();

    return (
        <Container
            position="relative"
            backgroundColor={
                isDark
                    ? 'radial-gradient(103.12% 50% at 50% 50%, #21193a 0%, #191326 100%)'
                    : 'linear-gradient(340.33deg, #c1edf0 -11.09%, #eafbf7 32.51%, #ece4fb 96.59%)'
            }
        >
            <Flex
                position="relative"
                zIndex="1"
                margin="auto"
                justifyContent="space-between"
                width={['100%', '100%', '100%', '100%', '100%', '100%', '1140px']}
                flexDirection={[
                    'column-reverse',
                    'column-reverse',
                    'column-reverse',
                    'column-reverse',
                    'column-reverse',
                    'row',
                ]}
            >
                <Flex flexDirection="column" alignSelf="center">
                    <Text
                        bold
                        fontSize={['40px', '40px', '40px', '60px']}
                        color="secondary"
                        lineHeight="110%"
                    >
                        {t('Trading Reward')}
                    </Text>
                    <Text bold fontSize="40px" color="secondary" mb="16px" lineHeight="110%">
                        $42,000
                        <Text
                            bold
                            fontSize="40px"
                            color="secondary"
                            as="span"
                            ml="4px"
                            lineHeight="110%"
                        >
                            {t('in total to be earn!')}
                        </Text>
                    </Text>
                    <Text
                        bold
                        mb="32px"
                        maxWidth="404px"
                        lineHeight="26.4px"
                        fontSize={['16px', '16px', '16px', '24px']}
                    >
                        {t('Earn CAKE while trading your favorite tokens on PancakeSwap.')}
                    </Text>
                    <Flex>
                        <Button>{t('Start Trading')}</Button>
                        <Button ml="12px" variant="secondary">
                            {`${t('How to Earn')}?`}
                        </Button>
                    </Flex>
                </Flex>
                <Box
                    width={['320px', '320px', '320px', '420px', '420px', '554px']}
                    height={['339px', '339px', '339px', '439px', '439px', '573px']}
                    m={['auto']}
                >
                    {/* <Image src={bunnyImage} alt="banner-image" /> */}
                </Box>
            </Flex>
        </Container>
    );
};

export default TradingRewardBanner;
