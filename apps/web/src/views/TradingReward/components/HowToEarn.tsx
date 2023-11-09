import { useTranslation } from '@pancakeswap/localization';
import { Box, Card, Flex, Text, TwitterIcon } from '@pancakeswap/uikit';
import styled from 'styled-components';

const StyledCard = styled(Card)`
    width: 100%;
    background: transparent;
    > div {
        background: transparent;
    }

    ${({ theme }) => theme.mediaQueries.lg} {
        background: ${({ theme }) => theme.colors.cardBorder};
        > div {
            background: ${({ theme }) => theme.colors.backgroundAlt};
        }
    }
`;

const HowToEarn = () => {
    const { t } = useTranslation();

    return (
        <Box padding="0 16px" mt={['72px', '72px', '72px', '143px']}>
            <Box
                margin={['auto']}
                width={['100%', '100%', '100%', '100%', '100%', '100%', '1140px']}
            >
                <StyledCard>
                    <Flex
                        flexDirection="column"
                        padding={['50px 0 0 0', '50px 0 0 0', '50px 0 0 0', '50px 0']}
                    >
                        <Text
                            bold
                            mb={['24px']}
                            color="secondary"
                            textAlign="center"
                            fontSize={['40px']}
                        >
                            {t('How to Earn')}
                        </Text>
                    </Flex>
                </StyledCard>
            </Box>
            <Flex
                justifyContent="center"
                width={['226px', '226px', '226px', '100%']}
                margin={['auto', 'auto', 'auto', '42px 0 0 0 ']}
            >
                <TwitterIcon width={24} height={24} color="primary" />
                <Text
                    textAlign={['center', 'center', 'center', 'left']}
                    bold
                    color="primary"
                    ml="4px"
                >
                    {t('+Follow For New Pairs and Reward Pool Updates')}
                </Text>
            </Flex>
        </Box>
    );
};

export default HowToEarn;
