import RootLayout from 'tailwind-layouts/_root-layout';
import { CHAIN_IDS } from 'utils/wagmi';
import SwapV2 from 'views/SwapV2';
import { SwapFeaturesProvider } from '../views/Swap/SwapFeaturesContext';

const SwapPage = () => {
    return (
        <SwapFeaturesProvider>
            <SwapV2 />
        </SwapFeaturesProvider>
    );
};

SwapPage.getLayout = function getLayout(page) {
    return <RootLayout>{page}</RootLayout>;
};
SwapPage.chains = CHAIN_IDS;

export default SwapPage;
