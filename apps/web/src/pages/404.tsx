import ErrorDarkImage from 'assets/images/404-dark.svg';
import ErrorLightImage from 'assets/images/404-light.svg';
import Button from 'components/Tailwind/ui/button';
import Image from 'components/Tailwind/ui/image';
import AnchorLink from 'components/Tailwind/ui/links/anchor-link';
import routes from 'config/routes';
import { useIsDarkMode } from 'hooks/tailwind-hooks/use-is-dark-mode';
import { useIsMounted } from 'hooks/tailwind-hooks/use-is-mounted';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import RootLayout from 'tailwind-layouts/_root-layout';
import type { NextPageWithLayout } from 'types';

const ErrorPage: NextPageWithLayout = () => {
    const router = useRouter();
    const {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        query: { layout },
    } = router;
    const isMounted = useIsMounted();
    const { isDarkMode } = useIsDarkMode();
    return (
        <>
            <NextSeo title="404 Error! No Result Found" description="Itemswap Error" />

            <div className="flex max-w-full flex-col items-center justify-center text-center">
                <div className="relative w-52 max-w-full sm:w-[400px] xl:w-[450px] 3xl:w-[500px]">
                    {isMounted && !isDarkMode && <Image src={ErrorLightImage} alt="404 Error" />}
                    {isMounted && isDarkMode && <Image src={ErrorDarkImage} alt="404 Error" />}
                </div>

                <h2 className="mb-2 mt-5 text-base font-medium uppercase tracking-wide text-gray-900 dark:text-white sm:mb-4 sm:mt-10 sm:text-xl 3xl:mt-12 3xl:text-2xl">
                    Error! No Result Found
                </h2>
                <p className="mb-4 max-w-full text-xs leading-loose tracking-tight text-gray-600 dark:text-gray-400 sm:mb-6 sm:w-[430px] sm:text-sm sm:leading-loose">
                    Sorry, the page you are looking for might be renamed, removed, or might never
                    exist.
                </p>
                <AnchorLink href={routes.home}>
                    <Button shape="rounded">Back to Home</Button>
                </AnchorLink>
            </div>
        </>
    );
};

ErrorPage.getLayout = function getLayout(page) {
    return <RootLayout contentClassName="flex items-center justify-center">{page}</RootLayout>;
};

export default ErrorPage;
