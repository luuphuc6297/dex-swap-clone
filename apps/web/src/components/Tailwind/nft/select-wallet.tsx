import { Typography } from '@mui/material';
import metamaskLogo from 'assets/images/metamask.svg';
import { useModal } from 'components/Tailwind/modal-views/context';
import Image from 'components/Tailwind/ui/image';
import { useEffect } from 'react';
import { useAccount } from 'wagmi';

export default function SelectWallet({ ...props }) {
    // const { address, connectToWallet, error } = useContext(WalletContext);
    const { address } = useAccount();
    const { closeModal } = useModal();
    useEffect(() => {
        if (address) closeModal();
    }, [address, closeModal]);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function connectToWallet(event: any): void {
        throw new Error('Function not implemented.');
    }

    return (
        <div
            className="relative z-50 mx-auto w-[440px] max-w-full rounded-lg bg-white px-9 py-16 dark:bg-light-dark"
            {...props}
        >
            <Typography
                variant="h2"
                className="mb-4 text-center text-2xl font-medium uppercase text-gray-900 dark:text-white"
            >
                Connect Wallet
            </Typography>
            <Typography
                variant="body1"
                className="text-center text-sm leading-loose tracking-tight text-gray-600 dark:text-gray-400"
            >
                By connecting your wallet, you agree to our Terms of Service and our Privacy Policy.
            </Typography>

            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
            <div
                className="mt-12 flex h-14 w-full cursor-pointer items-center justify-between rounded-lg bg-gradient-to-l from-[#ffdc24] to-[#ff5c00] px-4 text-base text-white transition-all hover:-translate-y-0.5"
                onClick={connectToWallet}
            >
                <span>MetaMask</span>
                <span className="h-auto w-9">
                    <Image src={metamaskLogo} alt="metamask" />
                </span>
            </div>

            {props?.error && (
                <p className="mt-3 text-center text-xs text-red-500">
                    Please install Metamask plugin in your browser in order to connect wallet.
                </p>
            )}
        </div>
    );
}
