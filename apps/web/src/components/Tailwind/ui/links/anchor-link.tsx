import type { LinkProps } from 'next/link';
import NextLink from 'next/link';

const AnchorLink: React.FC<
    LinkProps & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>
> = ({ href, className, ...props }) => {
    return (
        <NextLink href={href} className={className}>
            <span {...props} />
        </NextLink>
    );
};

export default AnchorLink;
