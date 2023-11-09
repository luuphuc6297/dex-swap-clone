/* eslint-disable @typescript-eslint/no-unused-vars */
import darkLogo from 'assets/images/logo-white.svg';
import lightLogo from 'assets/images/logo.png';
import Image from 'components/Tailwind/ui/image';
import AnchorLink from 'components/Tailwind/ui/links/anchor-link';
import routes from 'config/routes';
import { useIsDarkMode } from 'hooks/tailwind-hooks/use-is-dark-mode';
import { useIsMounted } from 'hooks/tailwind-hooks/use-is-mounted';
import { useRouter } from 'next/router';

export default function Logo() {
    const router = useRouter();
    const {
        query: { layout },
    } = router;
    const isMounted = useIsMounted();
    const { isDarkMode } = useIsDarkMode();
    return (
        <AnchorLink href={routes.home} className="flex w-28 outline-none sm:w-32 4xl:w-36">
            <span className="relative flex overflow-hidden">
                {isMounted && isDarkMode && <Image src={darkLogo} alt="Criptic" priority />}
                {isMounted && !isDarkMode && <Image src={lightLogo} alt="Criptic" priority />}
            </span>
        </AnchorLink>
    );
}
