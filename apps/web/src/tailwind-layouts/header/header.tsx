import cn from 'classnames';
import UserMenu from 'components/Menu/UserMenu';
import { NetworkSwitcher } from 'components/NetworkSwitcher';
import { useDrawer } from 'components/Tailwind/drawer-views/context';
import Hamburger from 'components/Tailwind/ui/hamburger';
import LogoIcon from 'components/Tailwind/ui/logo-icon';
import routes from 'config/routes';
import { useIsMounted } from 'hooks/tailwind-hooks/use-is-mounted';
import { useWindowScroll } from 'hooks/tailwind-hooks/use-window-scroll';
import { useRouter } from 'next/router';

function HeaderRightArea() {
    return (
        <div className="relative order-last flex shrink-0 items-center gap-4 sm:gap-6 lg:gap-8">
            <NetworkSwitcher />
            <UserMenu />
        </div>
    );
}

export default function Header({ className }: { className?: string }) {
    const router = useRouter();
    const isMounted = useIsMounted();
    const { openDrawer } = useDrawer();
    const windowScroll = useWindowScroll();
    return (
        <nav
            className={cn(
                'sticky top-0 z-30 h-16 w-full transition-all duration-300 ltr:right-0 rtl:left-0 sm:h-20 3xl:h-24',
                (isMounted && windowScroll.y) > 2
                    ? 'bg-gradient-to-b from-white to-white/80 shadow-card backdrop-blur dark:from-dark dark:to-dark/80'
                    : '',
                className
            )}
        >
            <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8 3xl:px-10">
                <div className="flex items-center">
                    {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
                    <div
                        onClick={() => router.push(routes.home)}
                        className="flex items-center xl:hidden"
                    >
                        <LogoIcon />
                    </div>
                    <div className="mx-2 block sm:mx-4 xl:hidden">
                        <Hamburger
                            isOpen={false}
                            variant="transparent"
                            onClick={() => openDrawer('DASHBOARD_SIDEBAR')}
                            className="dark:text-white"
                        />
                    </div>
                    {/* <SearchButton
                        variant="transparent"
                        className="ltr:-ml-[17px] rtl:-mr-[17px] dark:text-white"
                    /> */}
                </div>
                <HeaderRightArea />
            </div>
        </nav>
    );
}
