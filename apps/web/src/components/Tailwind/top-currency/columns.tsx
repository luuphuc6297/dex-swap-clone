/* eslint-disable react/style-prop-object */

import isString from 'lodash/isString';
import Image from 'next/image';
import { FormattedNumber } from 'react-intl';
import { pickSvgUrl } from 'utils/top-coin';

export const COLUMNS = [
    {
        Header: '#',
        accessor: 'id',
        minWidth: 60,
        maxWidth: 80,
    },
    {
        Header: 'Name',
        accessor: 'coin',
        // @ts-ignore
        Cell: ({ cell: { value } }) => (
            // <div className="ltr:text-right rtl:text-left">{value}</div>
            <div className="mb-5 grid grid-cols-3 gap-4 text-sm text-gray-900 last:mb-0 dark:text-white">
                <div className="col-span-2 flex items-center gap-2">
                    <Image
                        src={pickSvgUrl(value.symbol)}
                        alt={`Logo ${value.name}`}
                        width={28}
                        height={28}
                        className="w-6 shrink-0"
                    />
                    <span className="w-6 shrink-0">{value.icon}</span>
                    <span className="flex flex-col gap-0.5">
                        <span className="whitespace-nowrap text-xs font-medium capitalize">
                            {/* {console.log('value___name', value.name)} */}
                            {value.name}
                        </span>
                        <span className="text-xs font-normal text-gray-500 dark:text-gray-400">
                            {value.symbol}
                        </span>
                    </span>
                </div>
            </div>
        ),
        minWidth: 140,
        maxWidth: 260,
    },
    {
        Header: () => (
            <div className="ltr:ml-auto ltr:text-right rtl:mr-auto rtl:text-left">Price</div>
        ),
        accessor: 'usd_price',
        // @ts-ignore
        Cell: ({ cell: { value } }) => (
            <div className="ltr:text-right rtl:text-left">
                {!isString(value) ? (
                    <>
                        $<FormattedNumber value={value} />
                    </>
                ) : (
                    <div className="text-grey-500 ltr:text-right rtl:text-left">-</div>
                )}
            </div>
        ),
        minWidth: 100,
        maxWidth: 140,
    },
    {
        Header: () => (
            <div className="ltr:ml-auto ltr:text-right rtl:mr-auto rtl:text-left">24H Change</div>
        ),
        accessor: 'usd_price_change_24h',
        // @ts-ignore
        Cell: ({ cell: { value } }) => (
            <div
                className={`ltr:text-right rtl:text-left ${
                    value > 0 ? 'text-green-500' : 'text-red-500'
                }`}
            >
                {!isString(value) ? (
                    <>
                        %<FormattedNumber value={value} />
                    </>
                ) : (
                    <div className="text-grey-500 ltr:text-right rtl:text-left">-</div>
                )}
            </div>
        ),
        minWidth: 100,
        maxWidth: 140,
    },
    {
        Header: () => (
            <div className="ltr:ml-auto ltr:text-right rtl:mr-auto rtl:text-left">24H Volume</div>
        ),
        accessor: 'usd_volume_24h',
        // @ts-ignore
        Cell: ({ cell: { value } }) => (
            <div className="truncate ltr:text-right rtl:text-left">
                {!isString(value) ? (
                    <>
                        <FormattedNumber
                            value={value}
                            style="currency"
                            currency="USD"
                            maximumFractionDigits={2}
                            minimumFractionDigits={2}
                        />
                    </>
                ) : (
                    <div className="text-grey-500 ltr:text-right rtl:text-left">-</div>
                )}
            </div>
        ),
        minWidth: 100,
        maxWidth: 140,
    },
    {
        Header: () => (
            <div className="ltr:ml-auto ltr:text-right rtl:mr-auto rtl:text-left">Market Cap</div>
        ),
        accessor: 'usd_marketcap',
        // @ts-ignore
        Cell: ({ cell: { value } }) => (
            <div className="... flex items-center truncate 2xl:justify-end 3xl:justify-start">
                {!isString(value) ? (
                    <FormattedNumber
                        value={value}
                        style="currency"
                        currency="USD"
                        maximumFractionDigits={2}
                        minimumFractionDigits={2}
                    />
                ) : (
                    <div className="text-grey-500 ltr:text-right rtl:text-left">-</div>
                )}
            </div>
        ),
        minWidth: 100,
        maxWidth: 140,
    },
];
