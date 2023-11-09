import { useTranslation } from '@pancakeswap/localization';
import { Button, Link, Text } from '@pancakeswap/uikit';
import useActiveWeb3React from 'hooks/useActiveWeb3React';

const NoProfile = () => {
    const { t } = useTranslation();
    const { account } = useActiveWeb3React();

    return (
        <>
            <Text bold mb="8px">
                {t('You have no CAKE profile.')}
            </Text>
            <Text mb="32px">{t('Create a Pancake Profile to start earning from trades')}</Text>
            <Link mt="32px" external href={`/profile/${account}`}>
                <Button>{t('Create Profile')}</Button>
            </Link>
        </>
    );
};

export default NoProfile;
