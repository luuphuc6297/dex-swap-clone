import { Typography } from '@mui/material';
import Avatar from 'components/Tailwind/ui//avatar';
import { StaticImageData } from 'next/image';

type AuthorCardProps = {
    image: StaticImageData;
    name?: string;
    role?: string;
};

export default function AuthorCard({ image, name, role }: AuthorCardProps) {
    return (
        <div
            className={`flex items-center rounded-lg  ${
                name
                    ? 'bg-gray-100  p-5  dark:bg-light-dark'
                    : 'ml-3 justify-center bg-none p-5 dark:mr-3 dark:bg-none'
            }`}
        >
            {/* ts-ignore */}
            <Avatar image={image} alt={name || ''} className="dark:border-gray-400" />
            <div className="ltr:pl-3 rtl:pr-3">
                <Typography variant="h4">{name}</Typography>
                <span className="mt-1 block text-xs text-gray-600 dark:text-gray-400">{role}</span>
            </div>
        </div>
    );
}
