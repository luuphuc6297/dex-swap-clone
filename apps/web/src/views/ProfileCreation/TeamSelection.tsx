/* eslint-disable @typescript-eslint/no-unused-vars */
import { useTranslation } from '@pancakeswap/localization';
import { Card, CardBody, Heading, Text } from '@pancakeswap/uikit';
import shuffle from 'lodash/shuffle';
import { useMemo } from 'react';
import { getTeams } from 'state/teams/helpers';
import useSWR from 'swr';
import NextStepButton from './NextStepButton';
import useProfileCreation from './contexts/hook';

const Team: React.FC<React.PropsWithChildren> = () => {
    const { teamId: currentTeamId, actions } = useProfileCreation();
    const { t } = useTranslation();
    const { data: teams } = useSWR('teams', async () => getTeams());
    // @ts-ignore
    const teamValues = useMemo(() => (teams ? shuffle(Object.values(teams)) : []), [teams]);
    // @ts-ignore
    const handleTeamSelection = (value: string) => actions.setTeamId(parseInt(value, 10));

    return (
        <>
            <Text fontSize="20px" color="textSubtle" bold>
                {t('Step %num%', { num: 3 })}
            </Text>
            <Heading as="h3" scale="xl" mb="24px">
                {t('Join a Team')}
            </Heading>
            <Text as="p" mb="24px">
                {t('It won’t be possible to undo the choice you make for the foreseeable future!')}
            </Text>
            <Card mb="24px">
                <CardBody>
                    <Heading as="h4" scale="lg" mb="8px">
                        {t('Join a Team')}
                    </Heading>
                    <Text as="p" color="textSubtle" mb="24px">
                        {t(
                            'There’s currently no big difference between teams, and no benefit of joining one team over another for now. So pick whichever one you like!'
                        )}
                    </Text>
                </CardBody>
            </Card>
            <NextStepButton onClick={actions.nextStep} disabled={currentTeamId === null}>
                {t('Next Step')}
            </NextStepButton>
        </>
    );
};

export default Team;
