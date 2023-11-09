import { Button, Heading, Text } from '@pancakeswap/uikit';
import { useAccount } from 'wagmi';
import { useTranslation } from '@pancakeswap/localization';
import { CompetitionProps } from 'views/TradingCompetition/types';
import { useRouter } from 'next/router';

const MakeProfile: React.FC<React.PropsWithChildren<CompetitionProps>> = ({ onDismiss }) => {
    const { address: account } = useAccount();
    const { t } = useTranslation();
    const router = useRouter();

    const handleClick = () => {
        router.push(`/profile/${account.toLowerCase()}`);
        onDismiss();
    };

    return (
        <>
            <Heading scale="md" mb="24px">
                {t('Make a profile!')}
            </Heading>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
                {t(
                    'It looks like you’ve disabled your account by removing your Pancake Collectible (NFT) profile picture.'
                )}
            </p>
            <Button mt="24px" width="100%" onClick={handleClick}>
                {t('Make a profile!')}
            </Button>
        </>
    );
};

export default MakeProfile;
