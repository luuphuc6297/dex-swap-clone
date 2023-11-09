import { AtomBox } from "@pancakeswap/ui";
import { ReactNode, memo } from "react";

interface Props {
    title: ReactNode;
    subtitle: ReactNode;
}

export const CurrencyInputHeader = memo(({ title, subtitle }: Props) => {
    return (
        <AtomBox width="100%" alignItems="center" flexDirection="column" padding="24px" borderBottom="1">
            <AtomBox display="flex" width="100%" alignItems="center" justifyContent="space-between">
                {title}
            </AtomBox>
            {subtitle}
        </AtomBox>
    );
});

// TODO: Change
export const CurrencyInputHeaderTitle = memo(({ children }: { children: ReactNode }) => (
    <h2 className="mb-4 text-left text-2xl font-bold uppercase text-gray-900 dark:text-white" style={{ fontSize: 28 }}>{children}</h2>
));

export const CurrencyInputHeaderSubTitle = memo(({ children }: { children: ReactNode }) => (
    <p className='text-center text-sm leading-loose tracking-tight text-gray-600 dark:text-gray-400'>
        {children}
    </p>
));
