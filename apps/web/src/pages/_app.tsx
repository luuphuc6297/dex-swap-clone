import '@pancakeswap/ui/css/reset.css';
import { ScrollToTopButtonV2, ToastListener } from '@pancakeswap/uikit';
import { Analytics } from '@vercel/analytics/react';
import BigNumber from 'bignumber.js';
import GlobalCheckClaimStatus from 'components/GlobalCheckClaimStatus';
import { PageMeta } from 'components/Layout/Page';
import { NetworkModal } from 'components/NetworkModal';
import { FixedSubgraphHealthIndicator } from 'components/SubgraphHealthIndicator/FixedSubgraphHealthIndicator';
import DrawersContainer from 'components/Tailwind/drawer-views/container';
import ModalContainer from 'components/Tailwind/modal-views/container';
import SettingsButton from 'components/Tailwind/settings/settings-button';
import SettingsDrawer from 'components/Tailwind/settings/settings-drawer';
import TransactionsDetailModal from 'components/TransactionDetailModal';
import { useAccountEventListener } from 'hooks/useAccountEventListener';
import useEagerConnect from 'hooks/useEagerConnect';
// @ts-ignore
import useEagerConnectMP from 'hooks/useEagerConnect.bmp';
import useLockedEndNotification from 'hooks/useLockedEndNotification';
import useSentryUser from 'hooks/useSentryUser';
import useThemeCookie from 'hooks/useThemeCookie';
import useUserAgent from 'hooks/useUserAgent';
import { NextPage } from 'next';
import { DefaultSeo } from 'next-seo';
import type { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import 'overlayscrollbars/overlayscrollbars.css';
import { Fragment, ReactElement, ReactNode } from 'react';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, useStore } from 'state';
import { usePollBlockNumber } from 'state/block/hooks';
import 'style/range-slider.css';
import 'style/scrollbar.css';
import 'style/tailwind-globals.css';
import { Blocklist, Updaters } from '..';
import { SEO } from '../../next-seo.config';
import Providers from '../Providers';
import { SentryErrorBoundary } from '../components/ErrorBoundary';
// import Menu from '../components/Menu'

const EasterEgg = dynamic(() => import('components/EasterEgg'), { ssr: false });

// This config is required for number formatting
BigNumber.config({
    EXPONENTIAL_AT: 1000,
    DECIMAL_PLACES: 80,
});

function GlobalHooks() {
    usePollBlockNumber();
    useEagerConnect();
    useUserAgent();
    useAccountEventListener();
    useSentryUser();
    useThemeCookie();
    useLockedEndNotification();
    return null;
}

function MPGlobalHooks() {
    usePollBlockNumber();
    useEagerConnectMP();
    useUserAgent();
    useAccountEventListener();
    useSentryUser();
    useLockedEndNotification();
    return null;
}

function MyApp(props: AppProps<{ initialReduxState: any }>) {
    const { pageProps, Component } = props;
    const store = useStore(pageProps.initialReduxState);

    return (
        <>
            <Head>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1, maximum-scale=5, minimum-scale=1, viewport-fit=cover"
                />
                <meta name="description" />
                <meta name="theme-color" content="" />
                {(Component as NextPageWithLayout).mp && (
                    // eslint-disable-next-line @next/next/no-sync-scripts
                    <script
                        src="https://public.bnbstatic.com/static/js/mp-webview-sdk/webview-v1.0.0.min.js"
                        id="mp-webview"
                    />
                )}
            </Head>
            <DefaultSeo {...SEO} />
            <Providers store={store}>
                <PageMeta />
                {(Component as NextPageWithLayout).Meta && (
                    // @ts-ignore
                    <Component.Meta {...pageProps} />
                )}
                <Blocklist>
                    {(Component as NextPageWithLayout).mp ? <MPGlobalHooks /> : <GlobalHooks />}
                    {/* <ResetCSS /> */}
                    {/* <GlobalStyle /> */}
                    <GlobalCheckClaimStatus excludeLocations={[]} />
                    <PersistGate loading={null} persistor={persistor}>
                        <Updaters />
                        <App {...props} />
                    </PersistGate>
                </Blocklist>
            </Providers>
            <Analytics />
        </>
    );
}

type NextPageWithLayout = NextPage & {
    Layout?: React.FC<React.PropsWithChildren<unknown>>;
    /** render component without all layouts */
    pure?: true;
    /** is mini program */
    mp?: boolean;
    /**
     * allow chain per page, empty array bypass chain block modal
     * @default [ChainId.BSC]
     * */
    chains?: number[];
    isShowScrollToTopButton?: true;
    /**
     * Meta component for page, hacky solution for static build page to avoid `PersistGate` which blocks the page from rendering
     */
    Meta?: React.FC<React.PropsWithChildren<unknown>>;
    getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout;
};

const ProductionErrorBoundary =
    process.env.NODE_ENV === 'production' ? SentryErrorBoundary : Fragment;

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
    const getLayout = Component.getLayout ?? ((page) => page);
    if (Component.pure) {
        return <Component {...pageProps} />;
    }

    // Use the layout defined at the page level, if available
    // const Layout = Component.Layout || Fragment
    const isShowScrollToTopButton = Component.isShowScrollToTopButton || true;

    return (
        <ProductionErrorBoundary>
            {getLayout(<Component {...pageProps} />)}
            <SettingsButton />
            <SettingsDrawer />
            <DrawersContainer />
            <ModalContainer />
            <EasterEgg iterations={2} />
            <ToastListener />
            <FixedSubgraphHealthIndicator />
            <NetworkModal pageSupportedChains={Component.chains} />
            <TransactionsDetailModal />
            {isShowScrollToTopButton && <ScrollToTopButtonV2 />}
        </ProductionErrorBoundary>
    );
};

export default MyApp;
