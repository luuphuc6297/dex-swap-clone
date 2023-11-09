import { LAYOUT_OPTIONS } from 'libs/constants';
import { atom, useAtom } from 'jotai';

// 1. set initial atom for criptic layout
const cripticLayoutAtom = atom(
    typeof window !== 'undefined'
        ? localStorage.getItem('dex-swap-layout')
        : LAYOUT_OPTIONS.MODERN
);

const cripticLayoutAtomWithPersistence = atom(
    (get) => get(cripticLayoutAtom),
    (get, set, newStorage: any) => {
        set(cripticLayoutAtom, newStorage);
        localStorage.setItem('dex-swap-layout', newStorage);
    }
);

// 2. useLayout hook to check which layout is available
export function useLayout() {
    const [layout, setLayout] = useAtom(cripticLayoutAtomWithPersistence);
    return {
        layout,
        setLayout,
    };
}
