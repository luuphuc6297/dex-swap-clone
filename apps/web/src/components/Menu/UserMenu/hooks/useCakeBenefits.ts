import { useTranslation } from '@pancakeswap/localization';
import { ChainId } from '@pancakeswap/sdk';
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber';
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance';
import BigNumber from 'bignumber.js';
import cakeVaultAbi from 'config/abi/cakeVaultV2.json';
import { useIfoCreditAddressContract } from 'hooks/useContract';
import { useChainCurrentBlock } from 'state/block/hooks';
import useSWR from 'swr';
import { getAddress, getCakeVaultAddress } from 'utils/addressHelpers';
import { VaultPosition, getVaultPosition } from 'utils/cakePool';
import { getActivePools } from 'utils/calls';
import { multicallv2 } from 'utils/multicall';
import { useAccount } from 'wagmi';
import { convertSharesToCake } from '../../../../views/Pools/helpers';

const useCakeBenefits = () => {
    const { address: account } = useAccount();
    const {
        currentLanguage: { locale },
    } = useTranslation();
    const ifoCreditAddressContract = useIfoCreditAddressContract();
    const cakeVaultAddress = getCakeVaultAddress();
    const currentBscBlock = useChainCurrentBlock(ChainId.BSC);

    const { data, status } = useSWR(
        account && currentBscBlock && ['cakeBenefits', account],
        async () => {
            const userVaultCalls = [
                'userInfo',
                'calculatePerformanceFee',
                'calculateOverdueFee',
            ].map((method) => ({
                address: cakeVaultAddress,
                name: method,
                params: [account],
            }));

            const pricePerFullShareCall = [
                {
                    address: cakeVaultAddress,
                    name: 'getPricePerFullShare',
                },
            ];

            const [userContractResponse, [currentPerformanceFee], [currentOverdueFee], sharePrice] =
                await multicallv2({
                    abi: cakeVaultAbi,
                    calls: [...userVaultCalls, ...pricePerFullShareCall],
                });
            const currentPerformanceFeeAsBigNumber = new BigNumber(
                currentPerformanceFee.toString()
            );
            const currentOverdueFeeAsBigNumber = new BigNumber(currentOverdueFee.toString());
            const sharePriceAsBigNumber = sharePrice
                ? new BigNumber(sharePrice.toString())
                : BIG_ZERO;
            const userBoostedSharesAsBignumber = new BigNumber(
                userContractResponse.userBoostedShare.toString()
            );
            const userSharesAsBignumber = new BigNumber(userContractResponse.shares.toString());
            const lockPosition = getVaultPosition({
                userShares: userSharesAsBignumber,
                locked: userContractResponse.locked,
                lockEndTime: userContractResponse.lockEndTime.toString(),
            });
            const lockedCake = [VaultPosition.None, VaultPosition.Flexible].includes(lockPosition)
                ? '0.00'
                : convertSharesToCake(
                      userSharesAsBignumber,
                      sharePriceAsBigNumber,
                      undefined,
                      undefined,
                      currentOverdueFeeAsBigNumber
                          .plus(currentPerformanceFeeAsBigNumber)
                          .plus(userBoostedSharesAsBignumber)
                  ).cakeAsNumberBalance.toLocaleString('en', { maximumFractionDigits: 3 });

            let iCake = '';
            // let vCake = { vaultScore: '0', totalScore: '0' }
            if (lockPosition === VaultPosition.Locked) {
                const credit = await ifoCreditAddressContract.getUserCredit(account);
                iCake = getBalanceNumber(new BigNumber(credit.toString())).toLocaleString('en', {
                    maximumFractionDigits: 3,
                });

                const eligiblePools = await getActivePools(currentBscBlock);
                const poolAddresses = eligiblePools.map(({ contractAddress }) =>
                    getAddress(contractAddress, ChainId.BSC)
                );

                // vCake = {
                //   vaultScore: cakeVaultBalance[account]
                //     ? cakeVaultBalance[account].toLocaleString('en', { maximumFractionDigits: 3 })
                //     : '0',
                //   totalScore: total[account] ? total[account].toLocaleString('en', { maximumFractionDigits: 3 }) : '0',
                // }
            }

            return {
                lockedCake,
                lockPosition,
                lockedEndTime: new Date(
                    parseInt(userContractResponse.lockEndTime.toString()) * 1000
                ).toLocaleString(locale, {
                    month: 'short',
                    year: 'numeric',
                    day: 'numeric',
                }),
                iCake,
                // vCake,
            };
        }
    );

    return { data, status };
};

export default useCakeBenefits;
