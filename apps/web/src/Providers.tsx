import { LanguageProvider } from '@pancakeswap/localization';
import { ModalProvider, UIKitProvider, light } from '@pancakeswap/uikit';
import { WagmiProvider } from '@pancakeswap/wagmi';
import { Store } from '@reduxjs/toolkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HistoryManagerProvider } from 'contexts/HistoryContext';
import { fetchStatusMiddleware } from 'hooks/useSWRContract';
import { ThemeProvider as NextThemeProvider } from 'next-themes';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { SWRConfig } from 'swr';
import { client } from 'utils/wagmi';

// Create a client
const queryClient = new QueryClient();

const StyledUIKitProvider: React.FC<React.PropsWithChildren> = ({ children, ...props }) => {
    return <UIKitProvider theme={light}>{children}</UIKitProvider>;
};

const Providers: React.FC<React.PropsWithChildren<{ store: Store; children: React.ReactNode }>> = ({
    children,
    store,
}) => {
    return (
        <QueryClientProvider client={queryClient}>
            <WagmiProvider client={client}>
                <Provider store={store}>
                    <NextThemeProvider attribute="class" enableSystem={false} defaultTheme="light">
                        <StyledUIKitProvider>
                            <LanguageProvider>
                                <SWRConfig
                                    value={{
                                        use: [fetchStatusMiddleware],
                                    }}
                                >
                                    <IntlProvider locale="en">
                                        <HistoryManagerProvider>
                                            <ModalProvider>{children}</ModalProvider>
                                        </HistoryManagerProvider>
                                    </IntlProvider>
                                </SWRConfig>
                            </LanguageProvider>
                        </StyledUIKitProvider>
                    </NextThemeProvider>
                </Provider>
            </WagmiProvider>
        </QueryClientProvider>
    );
};

export default Providers;
