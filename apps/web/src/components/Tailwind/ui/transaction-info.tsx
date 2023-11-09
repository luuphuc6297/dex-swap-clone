import { Typography } from '@mui/material';
import cn from 'classnames';

interface TransactionInfoTypes {
    label: string;
    value?: string | number;
    className?: string;
}

export default function TransactionInfo({ label, value, className }: TransactionInfoTypes) {
    return (
        <div className={cn('flex items-center justify-between dark:text-gray-300', className)}>
            <Typography variant="body1" className="font-medium">
                {label}
            </Typography>
            <span>{value || '_ _'}</span>
        </div>
    );
}
