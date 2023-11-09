/* eslint-disable react/button-has-type */
import cn from 'classnames';
import { useDrawer } from 'components/Tailwind/drawer-views/context';
import { CompactGridIcon } from 'components/Tailwind/icons/compact-grid';
import { NormalGridIcon } from 'components/Tailwind/icons/normal-grid';
import { OptionIcon } from 'components/Tailwind/icons/option';
import { SortList } from 'components/Tailwind/search/filters';
import Button from 'components/Tailwind/ui/button';
import { motion } from 'framer-motion';
import { useGridSwitcher } from 'hooks/tailwind-hooks/use-grid-switcher';

function GridSwitcher() {
    const { isGridCompact, setIsGridCompact } = useGridSwitcher();
    const { openDrawer, isOpen } = useDrawer();
    return (
        <div className="flex overflow-hidden rounded-lg">
            <button
                className={cn(
                    'relative flex h-11 w-11 items-center justify-center bg-gray-100 transition dark:bg-gray-800',
                    {
                        'z-10 text-white': !isGridCompact,
                        'text-brand dark:text-white': isGridCompact,
                    }
                )}
                onClick={() => setIsGridCompact(!isGridCompact)}
                aria-label="Normal Grid"
            >
                {!isGridCompact && (
                    <motion.span
                        className="absolute bottom-0 left-0 right-0 h-full w-full bg-brand shadow-large"
                        layoutId="gridSwitchIndicator"
                    />
                )}
                <NormalGridIcon className="relative" />
            </button>
            <button
                className={cn(
                    'relative flex h-11 w-11 items-center justify-center bg-gray-100 transition dark:bg-gray-800',
                    {
                        'z-10 text-white': isGridCompact,
                        'text-brand dark:text-white': !isGridCompact,
                    }
                )}
                onClick={() => setIsGridCompact(!isGridCompact)}
                aria-label="Normal Grid"
            >
                {isGridCompact && (
                    <motion.span
                        className="absolute bottom-0 left-0 right-0 h-full w-full  bg-brand shadow-large"
                        layoutId="gridSwitchIndicator"
                    />
                )}
                <CompactGridIcon className="relative" />
            </button>
            <button
                className={cn(
                    'relative flex h-11 w-11 items-center justify-center bg-gray-100 transition dark:bg-gray-800',
                    { 'z-10 text-white': isOpen, 'text-brand dark:text-white': !isOpen }
                )}
                onClick={() => openDrawer('DRAWER_SEARCH')}
                aria-label="Filter"
            >
                {isOpen && (
                    <motion.span
                        className="absolute bottom-0 left-0 right-0 h-full w-full  bg-brand shadow-large"
                        layoutId="gridSwitchIndicator"
                    />
                )}
                <OptionIcon className="relative h-auto w-5" />
            </button>
        </div>
    );
}

export default function RetroSearch() {
    const { openDrawer } = useDrawer();
    return (
        <>
            <div className="grid sm:pt-5">
                <div className="relative z-10 mb-6 flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-900 dark:text-white sm:text-sm">
                        5,686,066 items
                    </span>
                    <div className="flex gap-6 3xl:gap-8">
                        <SortList />
                        <div className="hidden 3xl:block">
                            <GridSwitcher />
                        </div>
                        <div className="hidden sm:flex sm:items-center sm:justify-center 3xl:hidden">
                            <button
                                type="button"
                                onClick={() => openDrawer('DRAWER_SEARCH')}
                                className="hover:opacity-90 focus:opacity-90"
                            >
                                <OptionIcon className="relative h-auto w-4" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="fixed bottom-6 left-1/2 z-10 w-full -translate-x-1/2 px-9 sm:hidden">
                    <Button onClick={() => openDrawer('DRAWER_SEARCH')} fullWidth>
                        Filters
                    </Button>
                </div>
            </div>
        </>
    );
}
