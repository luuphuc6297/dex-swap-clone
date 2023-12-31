import { Price, Currency } from "@pancakeswap/swap-sdk-core";
import { Loading, SyncAltIcon } from "@pancakeswap/uikit";
import { formatPrice } from "@pancakeswap/utils/formatFractions";
import { AtomBox } from "@pancakeswap/ui/components/AtomBox";
import { useState } from "react";
import { iconButtonClass } from "./SwapWidget.css";
import { AutoRenewIcon } from "../../components/Svg";
import { Text } from "../../components/Text";


interface TradePriceProps {
  price?: Price<Currency, Currency>;
  loading?: boolean;
}

export function TradePrice({ price, loading }: TradePriceProps) {
  const [showInverted, setShowInverted] = useState<boolean>(false);
  const formattedPrice = showInverted ? formatPrice(price, 6) : formatPrice(price?.invert(), 6);

  const show = Boolean(price?.baseCurrency && price?.quoteCurrency);

  return (
    <p
      className="text-center text-sm leading-loose tracking-tight text-gray-600 dark:text-gray-400"
    >
      {show ? (
        <>
          {`1 ${showInverted ? price?.baseCurrency?.symbol : price?.quoteCurrency?.symbol}`}
          <SyncAltIcon width="14px" height="14px" color="textSubtle" ml="4px" mr="4px" />
          {`${formattedPrice} ${showInverted ? price?.quoteCurrency?.symbol : price?.baseCurrency?.symbol}`}
          {loading ? (
            <AtomBox className={iconButtonClass}>
              <Loading width="12px" height="12px" />
            </AtomBox>
          ) : (
            <AtomBox role="button" className={iconButtonClass} onClick={() => setShowInverted(!showInverted)}>
              <AutoRenewIcon width="14px" />
            </AtomBox>
          )}
        </>
      ) : (
        "-"
      )}
    </p>
  );
}
