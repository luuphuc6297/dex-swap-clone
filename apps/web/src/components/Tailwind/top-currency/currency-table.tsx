/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/no-shadow */
import { Typography } from '@mui/material';
import { ChevronDown } from 'components/Tailwind/icons/chevron-down';
import Loader from 'components/Tailwind/ui/loader';
import Scrollbar from 'components/Tailwind/ui/scrollbar';
import React from 'react';
import { useFlexLayout, usePagination, useResizeColumns, useSortBy, useTable } from 'react-table';
import { useCoinListById } from 'services/top-coin';
import { COLUMNS } from './columns';

export default function TopCurrencyTable() {
    const { topCoins } = useCoinListById();

    return (
        <>
            {topCoins?.length > 3 ? (
                <Table topCoins={topCoins} />
            ) : (
                <div className="fixed z-50 grid h-full w-full place-content-center">
                    <Loader variant="blink" />
                </div>
            )}
        </>
    );
}

const Table = ({ topCoins }: any) => {
    const columns = React.useMemo(() => COLUMNS, []);
    const data = React.useMemo(() => topCoins, [topCoins]);

    const initialState = {
        pageSize: 15,
        pageIndex: 0,
    };

    const { getTableProps, getTableBodyProps, headerGroups, page, prepareRow } = useTable(
        {
            // @ts-ignore
            columns,
            // @ts-ignore
            data,
            initialState,
        },
        useSortBy,
        useResizeColumns,
        useFlexLayout,
        usePagination
    );
    return (
        <div className="">
            <div className="rounded-tl-lg rounded-tr-lg bg-white px-4 pt-6 dark:bg-light-dark md:px-8 md:pt-8">
                <div className="flex flex-col items-center justify-between border-b border-dashed border-gray-200 pb-5 dark:border-gray-700 md:flex-row">
                    <Typography
                        variant="h6"
                        className="mb-3 shrink-0 text-lg font-bold uppercase text-black dark:text-white sm:text-xl md:mb-0 md:text-2xl"
                        sx={{ fontWeight: 600 }}
                    >
                        Top BNB Chain Tokens
                    </Typography>
                </div>
            </div>
            <div className="-mx-0.5 dark:[&_.os-scrollbar_.os-scrollbar-track_.os-scrollbar-handle:before]:!bg-white/50">
                <Scrollbar style={{ width: '100%' }} autoHide="never">
                    <div className="px-0.5">
                        <table
                            {...getTableProps()}
                            className="transaction-table w-full border-separate border-0"
                        >
                            <thead className="text-sm text-gray-500 dark:text-gray-300">
                                {headerGroups.map((headerGroup, idx) => (
                                    <tr {...headerGroup.getHeaderGroupProps()} key={idx}>
                                        {headerGroup.headers.map((column, idx) => (
                                            <th
                                                {...column.getHeaderProps(
                                                    column.getSortByToggleProps()
                                                )}
                                                // eslint-disable-next-line react/no-array-index-key
                                                key={idx}
                                                className="group bg-white px-2 py-5 font-normal first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4"
                                            >
                                                <div className="flex items-center">
                                                    {column.render('Header')}
                                                    {column.canResize && (
                                                        <div
                                                            {...column.getResizerProps()}
                                                            className={`resizer ${
                                                                column.isResizing
                                                                    ? 'isResizing'
                                                                    : ''
                                                            }`}
                                                        />
                                                    )}
                                                    <span className="ltr:ml-1 rtl:mr-1">
                                                        {column.isSorted ? (
                                                            column.isSortedDesc ? (
                                                                <ChevronDown />
                                                            ) : (
                                                                <ChevronDown className="rotate-180" />
                                                            )
                                                        ) : (
                                                            <ChevronDown className="rotate-180 opacity-0 transition group-hover:opacity-50" />
                                                        )}
                                                    </span>
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody
                                {...getTableBodyProps()}
                                className="text-xs font-medium text-gray-900 dark:text-white 3xl:text-sm"
                            >
                                {page.map((row, idx) => {
                                    prepareRow(row);
                                    return (
                                        <tr
                                            {...row.getRowProps()}
                                            // eslint-disable-next-line react/no-array-index-key
                                            key={idx}
                                            className="mb-3 items-center rounded-lg bg-white uppercase shadow-card last:mb-0 dark:bg-light-dark"
                                        >
                                            {row.cells.map((cell, idx) => {
                                                return (
                                                    <td
                                                        {...cell.getCellProps()}
                                                        key={idx}
                                                        className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8 3xl:py-5"
                                                    >
                                                        {cell.render('Cell')}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </Scrollbar>
            </div>
        </div>
    );
};
