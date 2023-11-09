import darkLogo from 'assets/images/logo-icon-white.png';
import lightLogo from 'assets/images/logo-icon.svg';
import Image from 'components/Tailwind/ui/image';
import { useIsDarkMode } from 'hooks/tailwind-hooks/use-is-dark-mode';
import { useIsMounted } from 'hooks/tailwind-hooks/use-is-mounted';

// eslint-disable-next-line @typescript-eslint/ban-types
const Logo: React.FC<React.SVGAttributes<{}>> = (props) => {
    const isMounted = useIsMounted();
    const { isDarkMode } = useIsDarkMode();

    return (
        <div className="flex cursor-pointer outline-none" {...props}>
            <span className="relative flex overflow-hidden">
                {isMounted && isDarkMode && <Image src={darkLogo} alt="Itemswap" priority />}
                {isMounted && !isDarkMode && <Image src={lightLogo} alt="Itemswap" priority />}
            </span>
        </div>
    );
};

export default Logo;
