import { useTranslation } from '@pancakeswap/localization';
import {
    Box,
    Button,
    Flex,
    Grid,
    Heading,
    IconButton,
    LinkExternal,
    NextLinkFromReactRouter as ReactRouterLink,
    VisibilityOff,
    VisibilityOn,
    useModal,
} from '@pancakeswap/uikit';
import { formatNumber } from '@pancakeswap/utils/formatBalance';
import truncateHash from '@pancakeswap/utils/truncateHash';
import { useSidNameForAddress } from 'hooks/useSid';
import useGetUsernameWithVisibility from 'hooks/useUsernameWithVisibility';
import { useMemo } from 'react';
import { Achievement, Profile } from 'state/types';
import { getBlockExploreLink, isAddress } from 'utils';
import { useAccount } from 'wagmi';
import BannerHeader from '../../Nft/market/components/BannerHeader';
import AvatarImage from '../../Nft/market/components/BannerHeader/AvatarImage';
import StatBox, { StatBoxItem } from '../../Nft/market/components/StatBox';
import EditProfileAvatar from './EditProfileAvatar';
import EditProfileModal from './EditProfileModal';

interface HeaderProps {
    accountPath: string;
    profile: Profile;
    achievements: Achievement[];
    nftCollected: number;
    isAchievementsLoading: boolean;
    isNftLoading: boolean;
    isProfileLoading: boolean;
    onSuccess?: () => void;
}

// Account and profile passed down as the profile could be used to render _other_ users' profiles.
const ProfileHeader: React.FC<React.PropsWithChildren<HeaderProps>> = ({
    accountPath,
    profile,
    achievements,
    nftCollected,
    isAchievementsLoading,
    isNftLoading,
    isProfileLoading,
    onSuccess,
}) => {
    const { t } = useTranslation();
    const { address: account } = useAccount();
    const { sidName } = useSidNameForAddress(accountPath);
    const { usernameWithVisibility, userUsernameVisibility, setUserUsernameVisibility } =
        useGetUsernameWithVisibility(profile?.username);
    const [onEditProfileModal] = useModal(
        <EditProfileModal
            onSuccess={() => {
                onSuccess?.();
            }}
        />,
        false
    );

    const isConnectedAccount = isAddress(account) === isAddress(accountPath);
    const numNftCollected = !isNftLoading
        ? nftCollected
            ? formatNumber(nftCollected, 0, 0)
            : '-'
        : null;
    const numPoints = !isProfileLoading
        ? profile?.points
            ? formatNumber(profile.points, 0, 0)
            : '-'
        : null;
    const numAchievements = !isAchievementsLoading
        ? achievements?.length
            ? formatNumber(achievements.length, 0, 0)
            : '-'
        : null;

    const avatarImage = profile?.nft?.image?.thumbnail || '/images/nfts/no-profile-md.png';
    // @ts-ignore
    const profileUsername = isConnectedAccount ? usernameWithVisibility : profile?.username;
    const hasProfile = !!profile;

    const toggleUsernameVisibility = () => {
        setUserUsernameVisibility(!userUsernameVisibility);
    };

    const Icon = userUsernameVisibility ? VisibilityOff : VisibilityOn;

    const avatar = useMemo(() => {
        const getIconButtons = () => {
            return (
                // TODO: Share functionality once user profiles routed by ID
                <Flex display="inline-flex">
                    {accountPath && (
                        <IconButton
                            as="a"
                            target="_blank"
                            style={{
                                width: 'fit-content',
                            }}
                            href={getBlockExploreLink(accountPath, 'address') || ''}
                            // @ts-ignore
                            alt={t('View BscScan for user address')}
                        />
                    )}
                </Flex>
            );
        };

        const getImage = () => {
            return (
                <>
                    {hasProfile && accountPath && isConnectedAccount ? (
                        <EditProfileAvatar
                            src={avatarImage}
                            alt={t('User profile picture')}
                            onSuccess={() => {
                                onSuccess?.();
                            }}
                        />
                    ) : (
                        <AvatarImage src={avatarImage} alt={t('User profile picture')} />
                    )}
                </>
            );
        };
        return (
            <>
                {getImage()}
                {getIconButtons()}
            </>
        );
    }, [accountPath, avatarImage, isConnectedAccount, onSuccess, hasProfile, t]);

    const title = useMemo(() => {
        if (profileUsername) {
            return `@${profileUsername}`;
        }

        if (accountPath) {
            return sidName || truncateHash(accountPath, 5, 3);
        }

        return null;
    }, [sidName, profileUsername, accountPath]);

    const description = useMemo(() => {
        const getActivateButton = () => {
            if (!profile) {
                return (
                    <ReactRouterLink to="/create-profile">
                        <Button mt="16px">{t('Activate Profile')}</Button>
                    </ReactRouterLink>
                );
            }
            return (
                <Button width="fit-content" mt="16px" onClick={onEditProfileModal}>
                    {t('Reactivate Profile')}
                </Button>
            );
        };

        return (
            <Flex flexDirection="column" mb={[16, null, 0]} mr={[0, null, 16]}>
                {accountPath && profile?.username && (
                    <LinkExternal
                        isBscScan
                        href={getBlockExploreLink(accountPath, 'address')}
                        external
                        bold
                        color="primary"
                    >
                        {sidName || truncateHash(accountPath)}
                    </LinkExternal>
                )}
                {accountPath &&
                    isConnectedAccount &&
                    (!profile || !profile?.nft) &&
                    getActivateButton()}
            </Flex>
        );
    }, [sidName, accountPath, isConnectedAccount, onEditProfileModal, profile, t]);

    return (
        <>
            <BannerHeader bannerAlt={t('User team banner')} avatar={avatar} />
            <Grid
                pb="48px"
                gridGap="16px"
                alignItems="center"
                gridTemplateColumns={['1fr', null, null, null, 'repeat(2, 1fr)']}
            >
                <Box>
                    <Heading as="h1" scale="xl" color="secondary" mb="16px">
                        {title}
                        {isConnectedAccount && profile?.username ? (
                            <Icon ml="4px" onClick={toggleUsernameVisibility} cursor="pointer" />
                        ) : null}
                    </Heading>
                    {description}
                </Box>
                <Box>
                    <StatBox>
                        <StatBoxItem title={t('NFT Collected')} stat={numNftCollected} />
                        <StatBoxItem title={t('Points')} stat={numPoints} />
                        <StatBoxItem title={t('Achievements')} stat={numAchievements} />
                    </StatBox>
                </Box>
            </Grid>
        </>
    );
};

export default ProfileHeader;
