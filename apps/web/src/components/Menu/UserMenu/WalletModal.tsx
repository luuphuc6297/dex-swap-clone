import { parseUnits } from '@ethersproject/units';
import { useTranslation } from '@pancakeswap/localization';
import {
    ButtonMenu,
    ButtonMenuItem,
    CloseIcon,
    Heading,
    IconButton,
    InjectedModalProps,
    ModalBody,
    ModalContainer,
    ModalTitle,
    ModalHeader as UIKitModalHeader,
} from '@pancakeswap/uikit';
import { useCallback, useState } from 'react';
import styled from 'styled-components';
import { useAccount, useBalance } from 'wagmi';
import WalletInfo from './WalletInfo';
import WalletTransactions from './WalletTransactions';
import WalletWrongNetwork from './WalletWrongNetwork';

export enum WalletView {
    WALLET_INFO,
    TRANSACTIONS,
    WRONG_NETWORK,
}

interface WalletModalProps extends InjectedModalProps {
    initialView?: WalletView;
}

export const LOW_NATIVE_BALANCE = parseUnits('0.002', 'ether');

const ModalHeader = styled(UIKitModalHeader)`
    background: ${({ theme }) => theme.colors.gradientBubblegum};
`;

const Tabs = styled.div`
    background-color: ${({ theme }) => (theme.isDark ? '#1E1D20' : '#F6F6F6')};
    border-bottom: 1px solid ${({ theme }) => (theme.isDark ? '#383241' : '#E7E3EB')};
    padding: 16px 24px;
`;

interface TabsComponentProps {
    view: WalletView;
    handleClick: (newIndex: number) => void;
}

const TabsComponent: React.FC<React.PropsWithChildren<TabsComponentProps>> = ({
    view,
    handleClick,
}) => {
    const { t } = useTranslation();
    return (
        <Tabs>
            <ButtonMenu
                scale="sm"
                variant="primary"
                onItemClick={handleClick}
                activeIndex={view}
                fullWidth
            >
                <ButtonMenuItem>{t('Wallet')}</ButtonMenuItem>
                <ButtonMenuItem>{t('Transactions')}</ButtonMenuItem>
                {/* <Button className="flex h-10 w-auto items-center justify-center rounded-lg bg-gray-100 px-4 text-xs text-gray-900 dark:bg-gray-800 dark:text-white sm:w-56 sm:text-sm lg:h-11">
                    {t('Wallet')}
                </Button>
                <Button className="flex h-10 w-auto items-center justify-center rounded-lg bg-gray-100 px-4 text-xs text-gray-900 dark:bg-gray-800 dark:text-white sm:w-56 sm:text-sm lg:h-11">
                    {t('Transactions')}
                </Button> */}
            </ButtonMenu>
        </Tabs>
    );
};

const WalletModal: React.FC<React.PropsWithChildren<WalletModalProps>> = ({
    initialView = WalletView.WALLET_INFO,
    onDismiss,
}) => {
    const [view, setView] = useState(initialView);
    const { t } = useTranslation();
    const { address: account } = useAccount();
    const { data, isFetched } = useBalance({ address: account });
    const hasLowNativeBalance = isFetched && data && data.value.lte(LOW_NATIVE_BALANCE);

    const handleClick = useCallback((newIndex: number) => {
        setView(newIndex);
    }, []);

    return (
        <ModalContainer
            minWidth="360px"
            className="translate-y-0 rounded-lg opacity-100"
            style={{ border: 'none', boxShadow: '0px 2px 6px rgba(0,0,0,0.06)' }}
        >
            <ModalHeader>
                <ModalTitle>
                    <Heading>{t('Your Wallet')}</Heading>
                </ModalTitle>
                <IconButton variant="text" onClick={onDismiss}>
                    <CloseIcon width="24px" color="text" />
                </IconButton>
            </ModalHeader>
            {view !== WalletView.WRONG_NETWORK && (
                <TabsComponent view={view} handleClick={handleClick} />
            )}
            <ModalBody p="24px" width="100%">
                {view === WalletView.WALLET_INFO && (
                    <WalletInfo
                        hasLowNativeBalance={hasLowNativeBalance}
                        switchView={handleClick}
                        onDismiss={onDismiss}
                    />
                )}
                {view === WalletView.TRANSACTIONS && <WalletTransactions onDismiss={onDismiss} />}
                {view === WalletView.WRONG_NETWORK && <WalletWrongNetwork onDismiss={onDismiss} />}
            </ModalBody>
        </ModalContainer>
    );
};

export default WalletModal;
