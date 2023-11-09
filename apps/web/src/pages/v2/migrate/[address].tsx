import { AppHeader } from 'components/App';
import { BodyWrapper } from 'components/App/AppBody';
import { useRouter } from 'next/router';
import { isAddress } from 'utils';
import { CHAIN_IDS } from 'utils/wagmi';
import LiquidityFormProvider from 'views/AddLiquidityV3/formViews/V3FormView/form/LiquidityFormProvider';
import { Migrate } from 'views/AddLiquidityV3/Migrate';

function MigratePage() {
    // const { t } = useTranslation()

    const router = useRouter();

    const address = isAddress(router.query.address);

    return (
        <LiquidityFormProvider>
            <BodyWrapper style={{ maxWidth: '858px' }}>
                <AppHeader title="Migrate Liquidity" />
                {address && <Migrate v2PairAddress={address} />}
            </BodyWrapper>
        </LiquidityFormProvider>
    );
}

export default MigratePage;

MigratePage.chains = CHAIN_IDS;
