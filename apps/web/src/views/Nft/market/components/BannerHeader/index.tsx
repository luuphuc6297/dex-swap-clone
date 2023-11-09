import { Box, Flex, FlexProps } from '@pancakeswap/uikit';
import { ReactNode } from 'react';

interface BannerHeaderProps extends FlexProps {
    bannerAlt?: string;
    avatar?: ReactNode;
}

const BannerHeader: React.FC<React.PropsWithChildren<BannerHeaderProps>> = ({
    avatar,
    children,
    ...props
}) => {
    return (
        <Flex flexDirection="column" mb="24px" {...props}>
            <Box position="relative" pb="56px">
                <Box position="absolute" bottom={0} left={-4}>
                    <Flex alignItems="flex-end">
                        {avatar}
                        {children}
                    </Flex>
                </Box>
            </Box>
        </Flex>
    );
};

export default BannerHeader;
