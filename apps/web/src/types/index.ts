import { ChainId, Token } from '@pancakeswap/sdk';
import type { NextPage } from 'next';
import type { ReactElement, ReactNode } from 'react';

export * from './common';
export * from './top-coin';

// eslint-disable-next-line @typescript-eslint/ban-types
export type NextPageWithLayout<P = {}> = NextPage<P> & {
    authorization?: boolean;
    getLayout?: (page: ReactElement) => ReactNode;
    mp?: boolean;
    pure?: true;
    chains?: number[];
    /**
     * allow chain per page, empty array bypass chain block modal
     * @default [ChainId.BSC]
     * */
    /**
     * Meta component for page, hacky solution for static build page to avoid `PersistGate` which blocks the page from rendering
     */
    Meta?: React.FC<React.PropsWithChildren<unknown>>;
};

export type CoinTypes = {
    icon: JSX.Element;
    code: string;
    name: string;
    price: number;
};

export interface Attachment {
    id: string;
    original: string;
    thumbnail: string;
}

export type ChainTokenList = ChainMap<Token[]>;

export type ChainMap<T> = {
    readonly [chainId in ChainId]: T;
};
