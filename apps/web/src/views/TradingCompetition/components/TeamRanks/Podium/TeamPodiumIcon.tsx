import { Flex } from '@pancakeswap/uikit';
import { memo } from 'react';
import styled from 'styled-components';

const Wrapper = styled(Flex)<{ imageSize?: number }>`
    align-items: center;
    justify-content: center;

    img {
        border-radius: 50%;
    }

    /* Podium is about 66% of initial size on xs devices  */
    width: ${({ imageSize }) => imageSize * 0.66 + 4}px;
    height: ${({ imageSize }) => imageSize * 0.66 + 4}px;

    /* Podium is about 80% of initial size on sm devices  */
    ${({ theme }) => theme.mediaQueries.xs} {
        width: ${({ imageSize }) => imageSize * 0.8 + 4}px;
        height: ${({ imageSize }) => imageSize * 0.8 + 4}px;
    }

    ${({ theme }) => theme.mediaQueries.sm} {
        width: ${({ imageSize }) => imageSize + 4}px;
        height: ${({ imageSize }) => imageSize + 4}px;
    }
`;

interface PodiumIconProps {
    teamId?: number;
    teamPosition?: number;
}

const TeamPodiumIcon: React.FC<React.PropsWithChildren<PodiumIconProps>> = ({ teamPosition }) => {
    const imageSize = teamPosition === 1 ? 128 : 113;

    return <Wrapper imageSize={imageSize} />;
};

export default memo(TeamPodiumIcon);
