import { ContextApi } from '@pancakeswap/localization';
import memoize from 'lodash/memoize';
import { ASSET_CDN } from './endpoints';
import { PageMeta } from './types';

export const DEFAULT_META: PageMeta = {
    title: 'Itemswap',
    description: 'The new platform swap',
    image: `${ASSET_CDN}/web/og/hero.jpg`,
};

interface PathList {
    paths: {
        [path: string]: { title: string; basePath?: boolean; description?: string; image?: string };
    };
    defaultTitleSuffix: string;
}

const getPathList = (t: ContextApi['t']): PathList => {
    return {
        paths: {
            '/': { title: t('Home') },
            '/swap': {
                basePath: true,
                title: t('Exchange'),
                image: `${ASSET_CDN}`,
            },
            '/limit-orders': {
                basePath: true,
                title: t('Limit Orders'),
                image: `${ASSET_CDN}`,
            },
            '/add': {
                basePath: true,
                title: t('Add Liquidity'),
                image: `${ASSET_CDN}`,
            },
            '/remove': {
                basePath: true,
                title: t('Remove Liquidity'),
                image: `${ASSET_CDN}`,
            },
            '/liquidity': { title: t('Liquidity'), image: `${ASSET_CDN}` },
        },
        defaultTitleSuffix: t('Itemswap'),
    };
};

export const getCustomMeta = memoize(
    (path: string, t: ContextApi['t'], _: string): PageMeta => {
        const pathList = getPathList(t);
        const pathMetadata =
            pathList.paths[path] ??
            pathList.paths[
                Object.entries(pathList.paths).find(
                    ([url, data]) => data.basePath && path.startsWith(url)
                )?.[0]
            ];

        if (pathMetadata) {
            return {
                title: `${pathMetadata.title}`,
                ...(pathMetadata.description && { description: pathMetadata.description }),
                image: pathMetadata.image,
            };
        }
        return null;
    },
    (path, t, locale) => `${path}#${locale}`
);
