import Loader from 'components/Tailwind/ui/loader';
import dynamic from 'next/dynamic';

const MinimalLayout = dynamic(() => import('tailwind-layouts/_minimal'), {
    loading: () => <FallbackLoader />,
});

function FallbackLoader() {
    return (
        <div className="fixed z-50 grid h-full w-full place-content-center">
            <Loader variant="blink" />
        </div>
    );
}

export default function RootLayout({
    children,
}: React.PropsWithChildren<{ contentClassName?: string }>) {
    return <MinimalLayout>{children}</MinimalLayout>;
}
