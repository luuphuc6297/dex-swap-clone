import { useTranslation } from '@pancakeswap/localization';
import { ChainId } from '@pancakeswap/sdk';
import { HelpIcon, Link, Message, MessageText, Text } from '@pancakeswap/uikit';
import Button from 'components/Tailwind/ui/button';
import { useSwitchNetwork } from 'hooks/useSwitchNetwork';
import styled from 'styled-components';

const StyledLink = styled(Link)`
    width: 100%;
    &:hover {
        text-decoration: initial;
    }
`;

interface WalletWrongNetworkProps {
    onDismiss: () => void;
}

const WalletWrongNetwork: React.FC<React.PropsWithChildren<WalletWrongNetworkProps>> = ({
    onDismiss,
}) => {
    const { t } = useTranslation();
    const { switchNetworkAsync, canSwitch } = useSwitchNetwork();

    const handleSwitchNetwork = async (): Promise<void> => {
        await switchNetworkAsync(ChainId.BSC);
        onDismiss?.();
    };

    return (
        <>
            <Text mb="24px">{t('You’re connected to the wrong network.')}</Text>
            {canSwitch ? (
                <Button onClick={handleSwitchNetwork}>{t('Switch Network')}</Button>
            ) : (
                <Message variant="danger">
                    <MessageText>
                        {t('Unable to switch network. Please try it on your wallet')}
                    </MessageText>
                </Message>
            )}
            <StyledLink
                href="https://docs.pancakeswap.finance/get-started/connection-guide"
                external
            >
                <Button>
                    {t('Learn How')}
                    <HelpIcon color="primary" ml="6px" />
                </Button>
            </StyledLink>
        </>
    );
};

export default WalletWrongNetwork;
