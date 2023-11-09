import { useTranslation } from '@pancakeswap/localization';
import {
    Card,
    CardBody,
    CardHeader,
    CommunityIcon,
    Heading,
    PrizeIcon,
    Skeleton,
} from '@pancakeswap/uikit';
import { FetchStatus } from 'config/constants/types';
import { getTeam } from 'state/teams/helpers';
import styled from 'styled-components';
import useSWR from 'swr';
import ComingSoon from './ComingSoon';
import IconStatBox from './IconStatBox';

interface TeamCardProps {
    id: string;
}

const Wrapper = styled.div`
    padding-top: 16px;

    ${({ theme }) => theme.mediaQueries.md} {
        padding-top: 24px;
    }
`;

const StyledCard = styled(Card)`
    overflow: visible;
`;

const StatRow = styled.div`
    display: grid;
    grid-gap: 16px;
    grid-template-columns: 1fr;
    margin-bottom: 16px;

    ${({ theme }) => theme.mediaQueries.md} {
        grid-gap: 32px;
        grid-template-columns: repeat(2, 1fr);
        margin-bottom: 32px;
    }
`;

const TeamCard: React.FC<React.PropsWithChildren<TeamCardProps>> = ({ id }) => {
    const { t } = useTranslation();
    const idNumber = Number(id);
    const { data: team, status } = useSWR(['team', id], async () => getTeam(idNumber));

    return (
        <Wrapper>
            <StyledCard>
                <CardBody>
                    <StatRow>
                        {status !== FetchStatus.Fetched ? (
                            <Skeleton width="100px" />
                        ) : (
                            <IconStatBox
                                icon={CommunityIcon}
                                title={team.users}
                                subtitle={t('Active Members')}
                            />
                        )}
                        <IconStatBox
                            icon={PrizeIcon}
                            title={t('Coming Soon')}
                            subtitle={t('Team Points')}
                            isDisabled
                        />
                    </StatRow>
                    <Heading as="h3">{t('Team Achievements')}</Heading>
                    <ComingSoon />
                </CardBody>
            </StyledCard>
        </Wrapper>
    );
};

export default TeamCard;
