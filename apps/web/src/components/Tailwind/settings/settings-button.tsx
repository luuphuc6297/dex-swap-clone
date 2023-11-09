// import { useSettingsDrawer } from 'components/Tailwind/settings/settings-context';
import { useDirection } from 'hooks/tailwind-hooks/use-direction';
import { useLayout } from 'hooks/tailwind-hooks/use-layout';
import { useLocalStorage } from 'hooks/tailwind-hooks/use-local-storage';
import { useThemeColor } from 'hooks/tailwind-hooks/use-theme-color';
import { LAYOUT_OPTIONS } from 'libs/constants';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function SettingsButton() {
    // const { opeSettings } = useSettingsDrawer();
    const [direction] = useLocalStorage<string>('dex-swap-direction');
    const [themeColor] = useLocalStorage<string>('dex-swap-color');
    useDirection(direction || 'ltr');
    useThemeColor(themeColor || '#14161a');
    // set layout based on query param
    const router = useRouter();
    const { query } = router;
    const selectedLayout = query?.layout && (query.layout as string);
    const { setLayout } = useLayout();
    useEffect(() => {
        setLayout(selectedLayout ?? LAYOUT_OPTIONS.MODERN);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query?.layout]);
    return (
        <>
            <div className="fixed top-1/2 z-40 -translate-y-1/2 ltr:right-0 rtl:left-0">
                {/* eslint-disable-next-line react/button-has-type */}
                {/* <button
                    className="flex h-12 w-12 items-center justify-center bg-white/80 text-gray-600 shadow-large backdrop-blur ltr:rounded-l-lg rtl:rounded-r-lg dark:bg-brand/80 dark:text-gray-200/70"
                    onClick={opeSettings}
                    title="Settings"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                    >
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M6.5565 2.10053C3.94225 2.2122 2 3.88336 2 6.5C2 9.11665 3.94225 10.7878 6.5565 10.8995C7.9246 10.9579 9.7062 11 12 11C14.2938 11 16.0754 10.9579 17.4435 10.8995C20.0578 10.7878 22 9.11665 22 6.5C22 3.88336 20.0578 2.2122 17.4435 2.10053C16.0754 2.04209 14.2938 2 12 2C9.7062 2 7.9246 2.04209 6.5565 2.10053ZM20 6.5C20 7.88071 18.8807 9 17.5 9C16.1193 9 15 7.88071 15 6.5C15 5.11929 16.1193 4 17.5 4C18.8807 4 20 5.11929 20 6.5Z"
                            fill="currentColor"
                        />
                        <path
                            opacity="0.4"
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M17.4435 13.1005C20.0578 13.2122 22 14.8833 22 17.5C22 20.1167 20.0578 21.7878 17.4435 21.8995C16.0754 21.9579 14.2938 22 12 22C9.7062 22 7.9246 21.9579 6.5565 21.8995C3.94225 21.7878 2 20.1167 2 17.5C2 14.8833 3.94225 13.2122 6.5565 13.1005C7.9246 13.0421 9.7062 13 12 13C14.2938 13 16.0754 13.0421 17.4435 13.1005ZM4 17.5C4 18.8807 5.11929 20 6.5 20C7.88071 20 9 18.8807 9 17.5C9 16.1193 7.88071 15 6.5 15C5.11929 15 4 16.1193 4 17.5Z"
                            fill="currentColor"
                        />
                        <path
                            opacity="0.4"
                            d="M17.5 9C18.8807 9 20 7.88071 20 6.5C20 5.11929 18.8807 4 17.5 4C16.1193 4 15 5.11929 15 6.5C15 7.88071 16.1193 9 17.5 9Z"
                            fill="currentColor"
                        />
                        <path
                            d="M6.5 20C5.11929 20 4 18.8807 4 17.5C4 16.1193 5.11929 15 6.5 15C7.88071 15 9 16.1193 9 17.5C9 18.8807 7.88071 20 6.5 20Z"
                            fill="currentColor"
                        />
                    </svg>
                    <span className="absolute top-1 right-1 flex h-3 w-3 items-center justify-center">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-80" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                    </span>
                </button> */}
            </div>
        </>
    );
}
