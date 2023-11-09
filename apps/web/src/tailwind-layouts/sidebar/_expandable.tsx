/* eslint-disable no-console */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import AuthorImage from 'assets/images/author.jpg';
import cn from 'classnames';
import { useDrawer } from 'components/Tailwind/drawer-views/context';
import { Close } from 'components/Tailwind/icons/close';
import AuthorCard from 'components/Tailwind/ui/author-card';
import Button from 'components/Tailwind/ui/button';
import { MenuItem } from 'components/Tailwind/ui/collapsible-menu';
import Logo from 'components/Tailwind/ui/logo';
import LogoIcon from 'components/Tailwind/ui/logo-icon';
import Scrollbar from 'components/Tailwind/ui/scrollbar';
import { motion } from 'framer-motion';
import { useClickAway } from 'hooks/tailwind-hooks/use-click-away';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import { menuItems } from 'tailwind-layouts/sidebar/_menu-items';

export default function Sidebar({ className }: { className?: string }) {
    const router = useRouter();
    const {
        query: { ...restQuery },
    } = router;
    const { closeDrawer } = useDrawer();
    const [open, setOpen] = useState(false);

    const ref = useRef<HTMLElement>(null);
    useClickAway(ref, () => {
        setOpen(false);
    });

    function isSubMenuActive(sm: any) {
        const t = [];
        for (let i = 0; i < sm?.length; i++) {
            t.push(sm[i].href);
        }
        return t.includes(router.pathname);
    }

    return (
        <aside
            ref={ref}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
            className={cn(
                open
                    ? 'border-0 shadow-expand xs:w-80 xl:w-72 2xl:w-80 '
                    : 'w-24 border-dashed border-gray-200 ltr:border-r rtl:border-l 2xl:w-28',
                'top-0 z-40 h-full w-full max-w-full  bg-body duration-200 ltr:left-0 rtl:right-0  dark:border-gray-700 dark:bg-dark xl:fixed',
                className
            )}
        >
            <div
                className={cn(
                    'relative flex h-24 items-center  overflow-hidden px-6 py-4 pt-0 2xl:px-8 3xl:pt-6',
                    open ? 'flex-start' : 'justify-center'
                )}
            >
                {!open ? (
                    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
                    <div onClick={() => setOpen(!open)}>
                        <LogoIcon />
                    </div>
                ) : (
                    <Logo />
                )}

                <div className="md:hidden">
                    <Button
                        title="Close"
                        color="white"
                        shape="circle"
                        variant="transparent"
                        size="small"
                        onClick={closeDrawer}
                    >
                        <Close className="h-auto w-2.5" />
                    </Button>
                </div>
            </div>

            <Scrollbar
                style={{
                    height: `calc(100% - ${!open ? '170px' : '225px'})`,
                    // marginTop: '-28px',
                }}
                className="-mt-4 2xl:-mt-7"
            >
                <div className="px-6 pb-5 2xl:px-8">
                    {!open ? (
                        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
                        <div className="mt-5 2xl:mt-8" onClick={() => setOpen(!open)}>
                            {menuItems.map((item, index) => (
                                <MenuItem
                                    isActive={
                                        item.href === router.pathname ||
                                        // @ts-ignore
                                        isSubMenuActive(item.dropdownItems)
                                    }
                                    // eslint-disable-next-line react/no-array-index-key
                                    key={index}
                                    href=""
                                    icon={item.icon}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="mt-5 2xl:mt-8">
                            {menuItems.map((item, index) => (
                                <MenuItem
                                    // eslint-disable-next-line react/no-array-index-key
                                    key={index}
                                    name={item.name}
                                    href={item.href}
                                    icon={item.icon}
                                    // @ts-ignore
                                    dropdownItems={item.dropdownItems}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </Scrollbar>
            <div className={cn('sticky bottom-0 mt-3 px-8 2xl:mt-12')}>
                {!open ? (
                    <motion.div
                        initial={{ x: 50, y: -5 }}
                        animate={{
                            x: 0,
                            y: 0,
                        }}
                        className="cursor-pointer pb-2"
                        onClick={
                            () => console.log('clicked')
                            // router.push({ pathname: routes.profile, query: { ...restQuery } })
                        }
                    >
                        <AuthorCard image={AuthorImage} />
                    </motion.div>
                ) : (
                    <div>
                        <motion.div
                            initial={{ y: '80%' }}
                            animate={{
                                y: 0,
                                transition: {
                                    delay: 0.1,
                                },
                            }}
                            onClick={() =>
                                router.push({
                                    // pathname: routes.profile,
                                    query: { ...restQuery },
                                })
                            }
                        >
                            <AuthorCard
                                image={AuthorImage}
                                name="Cameron Williamson"
                                // eslint-disable-next-line jsx-a11y/aria-role
                                role="admin"
                            />
                        </motion.div>
                    </div>
                )}
            </div>
        </aside>
    );
}
