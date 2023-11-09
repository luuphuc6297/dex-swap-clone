import { useTranslation } from '@pancakeswap/localization'
import { Box, BoxProps, Flex, Text, useModal } from '@pancakeswap/uikit'
import { formatNumber } from '@pancakeswap/utils/formatBalance'
import { formatAmount } from '@pancakeswap/utils/formatFractions'
import CurrencySearchModal, { CurrencySearchModalProps } from 'components/SearchModal/CurrencySearchModal'
import { ChevronDown } from 'components/Tailwind/icons/chevron-down'
import Button from 'components/Tailwind/ui/button'
import useBUSDPrice from 'hooks/useBUSDPrice'
import { useCurrencyBalance } from 'state/wallet/hooks'
import styled from 'styled-components'
import { useAccount } from 'wagmi'
import { AutoRow, RowBetween } from '../Layout/Row'
import { CurrencyLogo } from '../Logo'

const DropDownHeader = styled.div`
  // width: 100%;
  // height: 40px;
  // display: flex;
  // align-items: center;
  // justify-content: space-between;
  // padding: 0px 16px;
  // box-shadow: ${({ theme }) => theme.shadows.inset};
  // border: 1px solid ${({ theme }) => theme.colors.inputSecondary};
  // border-radius: 16px;
  // background: ${({ theme }) => theme.colors.input};
  // transition: border-radius 0.15s;
`

const DropDownContainer = styled(Button)`
  cursor: pointer;
  
  ${({ theme }) => theme.mediaQueries.sm} {
    min-width: 168px;
  }

  .down-icon {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
  }
`

// relative inline-flex shrink-0 items-center justify-center overflow-hidden text-center text-xs font-medium tracking-wider outline-none transition-all sm:text-sm bg-brand border-brand hover:-translate-y-0.5 hover:shadow-large focus:-translate-y-0.5 focus:shadow-large focus:outline-none rounded-full px-5 sm:px-8 h-10 sm:h-12 relative inline-flex shrink-0 items-center justify-center overflow-hidden text-center text-xs font-medium tracking-wider outline-none transition-all sm:text-sm bg-white border-white hover:-translate-y-0.5 hover:shadow-large focus:-translate-y-0.5 focus:shadow-large focus:outline-none text-gray-900 dark:text-white rounded-full px-5 sm:px-8 h-10 sm:h-12 shadow-card dark:bg-light-dark md:h-10 md:px-5 xl:h-12 xl:px-7

interface CurrencySelectProps extends CurrencySearchModalProps, BoxProps {
  hideBalance?: boolean
}

export const CurrencySelect = ({
  onCurrencySelect,
  selectedCurrency,
  otherSelectedCurrency,
  showCommonBases,
  commonBasesType,
  hideBalance,
  ...props
}: CurrencySelectProps) => {
  const { address: account } = useAccount()

  const selectedCurrencyBalance = useCurrencyBalance(
    account ?? undefined,
    !hideBalance && selectedCurrency ? selectedCurrency : undefined,
  )

  const { t } = useTranslation()

  const [onPresentCurrencyModal] = useModal(
    <CurrencySearchModal
      onCurrencySelect={onCurrencySelect}
      selectedCurrency={selectedCurrency}
      otherSelectedCurrency={otherSelectedCurrency}
      showCommonBases={showCommonBases}
      commonBasesType={commonBasesType}
    />,
  )

  const price = useBUSDPrice(selectedCurrencyBalance && selectedCurrency ? selectedCurrency : undefined)
  const quoted = selectedCurrencyBalance && price?.quote(selectedCurrencyBalance)

  return (
    <Box width="100%" {...props}>
      <Button onClick={onPresentCurrencyModal} className="relative font-medium inline-flex shrink-0 items-center justify-center overflow-hidden text-center text-xs font-medium tracking-wider outline-none transition-all sm:text-sm bg-brand border-brand hover:-translate-y-0.5 hover:shadow-large focus:-translate-y-0.5 focus:shadow-large focus:outline-none rounded-full px-5 sm:px-8 h-10 sm:h-12 relative inline-flex shrink-0 items-center justify-center overflow-hidden text-center text-xs font-medium tracking-wider outline-none transition-all sm:text-sm bg-white border-white hover:-translate-y-0.5 hover:shadow-large focus:-translate-y-0.5 focus:shadow-large focus:outline-none text-gray-900 dark:text-white rounded-full px-5 sm:px-8 h-10 sm:h-12 shadow-card dark:bg-light-dark md:h-10 md:px-5 xl:h-12 xl:px-7" fullWidth>
        <div>
          <p className='font-medium' id="pair" color={!selectedCurrency ? 'text' : undefined}>
            {!selectedCurrency ? (
              <>{t('Select')}</>
            ) : (
              <div className='flex items-center justify-between text-gray-900 ltr:rounded-tl-lg ltr:rounded-bl-lg  rtl:border-l dark:border-gray-700 dark:bg-light-dark dark:text-white sm:h-13 sm:pl-4'>

                <CurrencyLogo currency={selectedCurrency} size="24px" style={{ marginRight: '8px' }} />

                <p className='text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white' id="pair">
                  {selectedCurrency && selectedCurrency.symbol && selectedCurrency.symbol.length > 20
                    ? `${selectedCurrency.symbol.slice(0, 4)}...${selectedCurrency.symbol.slice(
                      selectedCurrency.symbol.length - 5,
                      selectedCurrency.symbol.length,
                    )}`
                    : selectedCurrency?.symbol}
                </p>
                <ChevronDown width={12} height={6} style={{ marginLeft: 8 }} />
              </div>
            )}
          </p>

        </div>
      </Button>
      {account && !!selectedCurrency && !hideBalance && (
        <Box>
          <AutoRow justify="space-between" gap="2px">
            <Text color="textSubtle" fontSize="12px">
              {t('Balance')}:
            </Text>
            <Text fontSize="12px">{formatAmount(selectedCurrencyBalance, 6) ?? t('Loading')}</Text>
          </AutoRow>
          <RowBetween>
            <div />
            {Number.isFinite(+quoted?.toExact()) && (
              <Text fontSize="12px" color="textSubtle">
                ~${formatNumber(+quoted.toExact())}
              </Text>
            )}
          </RowBetween>
        </Box>
      )}
    </Box>
  )
}
