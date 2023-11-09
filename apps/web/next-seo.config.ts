import { DefaultSeoProps } from 'next-seo';

export const SEO: DefaultSeoProps = {
    titleTemplate: '%s | Itemswap',
    defaultTitle: 'Itemswap',
    description: 'Itemswap demo',
    twitter: {
        cardType: 'summary_large_image',
        handle: '@Itemswap',
        site: '@Itemswap',
    },
    openGraph: {
        title: '🥞 Itemswap - A next evolution DeFi exchange on BNB Smart Chain (BSC)',
        description: 'Itemswap demo',
        images: [{ url: '' }],
    },
};
