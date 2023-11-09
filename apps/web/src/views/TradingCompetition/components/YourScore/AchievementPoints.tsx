import { useTranslation } from '@pancakeswap/localization';
import { Flex } from '@pancakeswap/uikit';

interface AchievementPointsProps {
    achievement: {
        image?: string;
    };
    userPointReward: number | string;
}

const AchievementPoints: React.FC<React.PropsWithChildren<AchievementPointsProps>> = () => {
    const { t } = useTranslation();

    return <Flex alignItems="center" flexWrap="wrap" justifyContent="center" width="100%" />;
};

export default AchievementPoints;
