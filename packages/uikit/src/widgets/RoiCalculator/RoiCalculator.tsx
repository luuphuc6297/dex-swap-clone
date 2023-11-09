import { useTranslation } from "@pancakeswap/localization";
import { Currency, CurrencyAmount, JSBI, Percent, Price, Token, ZERO, ZERO_PERCENT } from "@pancakeswap/sdk";
import { BIG_ZERO } from "@pancakeswap/utils/bigNumber";
import { formatFraction, formatPercent, formatPrice } from "@pancakeswap/utils/formatFractions";
import { isPositionOutOfRange } from "@pancakeswap/utils/isPositionOutOfRange";
import { FeeAmount, FeeCalculator, Tick, TickMath, tickToPrice } from "@pancakeswap/v3-sdk";
import BigNumber from "bignumber.js";
import { useCallback, useMemo, useState } from "react";

import { Button, DynamicSection, Flex, LiquidityChartRangeInput, Message, MessageText } from "../../components";
import { ScrollableContainer } from "../../components/RoiCalculatorModal/RoiCalculatorModal";
import { AnimatedArrow } from "./AnimationArrow";
import { CompoundFrequency } from "./CompoundFrequency";
import { DepositAmountInput } from "./DepositAmount";
import { Details } from "./Details";
import { RangeSelector } from "./RangeSelector";
import { RoiRate } from "./RoiRate";
import { Section } from "./Section";
import { StakeSpan } from "./StakeSpan";
import { useAmountsByUsdValue, usePriceRange, useRangeHopCallbacks, useRoi } from "./hooks";
// import { ImpermanentLossCalculator } from "./ImpermanentLossCalculator";
import TailwindButton from "../../components/Tailwind/Button";
import { useMatchBreakpoints } from "../../contexts";
import { PriceChart } from "./PriceChart";
import { TwoColumns } from "./TwoColumns";
import { compoundingIndexToFrequency, spanIndexToSpan } from "./constants";
import { PriceData, TickData } from "./types";

export interface RoiCalculatorPositionInfo {
  priceLower?: Price<Currency, Currency>;
  priceUpper?: Price<Currency, Currency>;
  depositAmountInUsd?: number | string;
  currencyAUsdPrice?: number;
  currencyBUsdPrice?: number;
  amountA?: CurrencyAmount<Currency>;
  amountB?: CurrencyAmount<Currency>;
  fullRange?: boolean;
}

export type RoiCalculatorProps = {
  sqrtRatioX96?: JSBI;
  liquidity?: JSBI;
  independentAmount?: CurrencyAmount<Currency>;
  currencyA?: Currency;
  currencyB?: Currency;
  balanceA?: CurrencyAmount<Currency>;
  balanceB?: CurrencyAmount<Currency>;
  feeAmount?: FeeAmount;
  protocolFee?: Percent;
  prices?: PriceData[];
  ticks?: TickData[];
  price?: Price<Token, Token>;
  priceLower?: Price<Token, Token>;
  priceUpper?: Price<Token, Token>;
  currencyAUsdPrice?: number;
  currencyBUsdPrice?: number;
  depositAmountInUsd?: number | string;
  priceSpan?: number;
  onPriceSpanChange?: (spanIndex: number) => void;
  allowApply?: boolean;
  onApply?: (position: RoiCalculatorPositionInfo) => void;

  // Average 24h historical trading volume in USD
  volume24H?: number;
  max?: string;
  maxLabel?: string;
} & (RoiCalculatorFarmProps | RoiCalculatorLPProps);

type RoiCalculatorLPProps = {
  isFarm?: false;
};

type RoiCalculatorFarmProps = {
  isFarm: true;
  cakePrice?: string;
  cakeAprFactor?: BigNumber;
};

// Price is always price of token0
export function RoiCalculator({
  sqrtRatioX96,
  liquidity,
  depositAmountInUsd = "0",
  currencyA,
  currencyB,
  balanceA,
  balanceB,
  currencyAUsdPrice,
  currencyBUsdPrice,
  feeAmount,
  protocolFee,
  prices,
  ticks: ticksRaw,
  price,
  priceLower,
  priceUpper,
  volume24H,
  maxLabel,
  max,
  priceSpan,
  onPriceSpanChange,
  allowApply = false,
  onApply,
  ...props
}: RoiCalculatorProps) {
  const cakeAprFactor = props.isFarm && props.cakeAprFactor;

  const { isMobile } = useMatchBreakpoints();
  const { t } = useTranslation();
  const [usdValue, setUsdValue] = useState(String(depositAmountInUsd));
  const [spanIndex, setSpanIndex] = useState(3);
  const [compoundOn, setCompoundOn] = useState(true);
  const [compoundIndex, setCompoundIndex] = useState(3);
  const tickCurrent = useMemo(() => sqrtRatioX96 && TickMath.getTickAtSqrtRatio(sqrtRatioX96), [sqrtRatioX96]);
  const invertPrice = useMemo(
    () => currencyA && currencyB && currencyB.wrapped.sortsBefore(currencyA.wrapped),
    [currencyA, currencyB]
  );
  const priceCurrent = useMemo<Price<Token, Token> | undefined>(() => {
    if (typeof tickCurrent !== "number" || !currencyA || !currencyB) {
      return undefined;
    }
    return invertPrice
      ? tickToPrice(currencyB.wrapped, currencyA.wrapped, tickCurrent)
      : tickToPrice(currencyA.wrapped, currencyB.wrapped, tickCurrent);
  }, [invertPrice, tickCurrent, currencyA, currencyB]);
  const ticks = useMemo(
    () =>
      ticksRaw?.map(
        ({ tick, liquidityNet }) => new Tick({ index: parseInt(tick), liquidityNet, liquidityGross: liquidityNet })
      ),
    [ticksRaw]
  );
  const mostActiveLiquidity = useMemo(
    () => ticks && sqrtRatioX96 && FeeCalculator.getLiquidityFromSqrtRatioX96(ticks, sqrtRatioX96),
    [ticks, sqrtRatioX96]
  );

  const priceRange = usePriceRange({
    feeAmount,
    baseCurrency: currencyA,
    quoteCurrency: currencyB,
    priceLower,
    priceUpper,
  });
  const { getDecrementLower, getIncrementLower, getDecrementUpper, getIncrementUpper } = useRangeHopCallbacks(
    currencyA,
    currencyB,
    feeAmount,
    priceRange?.tickLower,
    priceRange?.tickUpper,
    tickCurrent
  );
  const { amountA, amountB } = useAmountsByUsdValue({
    usdValue,
    currencyA,
    currencyB,
    price,
    priceLower: priceRange?.priceLower,
    priceUpper: priceRange?.priceUpper,
    sqrtRatioX96,
    currencyAUsdPrice,
    currencyBUsdPrice,
  });
  const maxUsdValue = useMemo<string | undefined>(() => {
    if (max) return max;
    if (!balanceA || !balanceB || typeof currencyAUsdPrice !== "number" || typeof currencyBUsdPrice !== "number") {
      return undefined;
    }
    const maxA = parseFloat(balanceA.toExact()) * currencyAUsdPrice;
    const maxB = parseFloat(balanceA.toExact()) * currencyBUsdPrice;
    return String(Math.max(maxA, maxB));
  }, [balanceA, balanceB, currencyAUsdPrice, currencyBUsdPrice, max]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [editCakePrice, setEditCakePrice] = useState<number | null>(null);

  const cakePriceDiffPercent = props.isFarm && props.cakePrice && editCakePrice && editCakePrice / +props.cakePrice;

  const derivedCakeApr = useMemo(() => {
    if (
      !currencyB ||
      !priceRange?.tickUpper ||
      !priceRange?.tickLower ||
      !sqrtRatioX96 ||
      !props.isFarm ||
      !cakeAprFactor ||
      !amountA
    ) {
      return undefined;
    }

    if (isPositionOutOfRange(tickCurrent, { tickLower: priceRange.tickLower, tickUpper: priceRange.tickUpper })) {
      return BIG_ZERO;
    }

    try {
      const positionLiquidity = FeeCalculator.getLiquidityBySingleAmount({
        amount: amountA,
        currency: currencyB,
        tickUpper: priceRange?.tickUpper,
        tickLower: priceRange?.tickLower,
        sqrtRatioX96,
      });

      const cakeApr = JSBI.greaterThan(positionLiquidity, ZERO)
        ? new BigNumber(positionLiquidity.toString()).times(cakeAprFactor).div(usdValue)
        : BIG_ZERO;

      return cakeApr;
    } catch (error) {
      console.error(error, amountA, priceRange, sqrtRatioX96);
      return undefined;
    }
  }, [currencyB, priceRange, sqrtRatioX96, props.isFarm, cakeAprFactor, amountA, tickCurrent, usdValue]);

  const editedCakeApr =
    derivedCakeApr && typeof cakePriceDiffPercent === "number"
      ? derivedCakeApr.times(cakePriceDiffPercent)
      : derivedCakeApr;

  const { fee, rate, apr, apy, cakeApy, editCakeApy, cakeRate, cakeReward } = useRoi({
    amountA,
    amountB,
    currencyAUsdPrice,
    currencyBUsdPrice,
    tickLower: priceRange?.tickLower,
    tickUpper: priceRange?.tickUpper,
    volume24H,
    sqrtRatioX96,
    mostActiveLiquidity,
    fee: feeAmount,
    protocolFee,
    compoundEvery: compoundingIndexToFrequency[compoundIndex],
    stakeFor: spanIndexToSpan[spanIndex],
    compoundOn,
    cakeApr: props.isFarm && derivedCakeApr ? derivedCakeApr.toNumber() : undefined,
    editCakeApr: props.isFarm && editedCakeApr ? editedCakeApr.toNumber() : undefined,
  });

  const handleApply = useCallback(
    () =>
      onApply?.({
        amountA,
        amountB,
        depositAmountInUsd: usdValue,
        priceLower: priceRange?.priceLower,
        priceUpper: priceRange?.priceUpper,
        currencyAUsdPrice,
        currencyBUsdPrice,
        fullRange: priceRange?.fullRange,
      }),
    [onApply, priceRange, amountA, amountB, usdValue, currencyAUsdPrice, currencyBUsdPrice]
  );

  const totalRate = parseFloat(formatPercent(rate?.add(cakeRate || ZERO_PERCENT), 12) ?? "0");
  const lpReward = parseFloat(formatFraction(fee, 12) ?? "0");
  const farmReward = cakeReward;
  const totalReward = lpReward + farmReward;

  const warningMessage = (
    <Message variant="warning" mb="1em">
      <MessageText>
        {t(
          "We are in the early stage of V3 deployment. Due to a lack of historical data, numbers and estimates may be inaccurate."
        )}
      </MessageText>
    </Message>
  );

  const depositSection = (
    <Section title={t("Deposit Amount")}>
      <DepositAmountInput
        value={usdValue}
        maxLabel={maxLabel}
        onChange={setUsdValue}
        currencyA={currencyA}
        currencyB={currencyB}
        amountA={amountA}
        amountB={amountB}
        max={maxUsdValue}
      />
    </Section>
  );

  const stakeAndCompound = (
    <>
      <Section title={t("Staked for")}>
        <StakeSpan spanIndex={spanIndex} onSpanChange={setSpanIndex} />
      </Section>
      <Section title={t("Compounding every")}>
        <CompoundFrequency
          compoundIndex={compoundIndex}
          onCompoundChange={setCompoundIndex}
          on={compoundOn}
          onToggleCompound={setCompoundOn}
        />
      </Section>
    </>
  );

  const priceRangeSettings = (
    <Section title={t("Set price range")}>
      <LiquidityChartRangeInput
        price={price}
        currencyA={currencyA}
        currencyB={currencyB}
        tickCurrent={tickCurrent}
        liquidity={liquidity}
        feeAmount={feeAmount}
        ticks={ticksRaw}
        ticksAtLimit={priceRange?.ticksAtLimit}
        priceLower={priceRange?.priceLower}
        priceUpper={priceRange?.priceUpper}
        onLeftRangeInput={priceRange?.onLeftRangeInput}
        onRightRangeInput={priceRange?.onRightRangeInput}
      />
      <DynamicSection>
        <RangeSelector
          priceLower={priceRange?.priceLower}
          priceUpper={priceRange?.priceUpper}
          getDecrementLower={getDecrementLower}
          getIncrementLower={getIncrementLower}
          getDecrementUpper={getDecrementUpper}
          getIncrementUpper={getIncrementUpper}
          onLeftRangeInput={priceRange?.onLeftRangeInput}
          onRightRangeInput={priceRange?.onRightRangeInput}
          currencyA={currencyA}
          currencyB={currencyB}
          feeAmount={feeAmount}
          ticksAtLimit={priceRange?.ticksAtLimit || {}}
        />
        <TailwindButton color="white" onClick={priceRange?.toggleFullRange} className="w-full">
          {t("Full Range")}
        </TailwindButton>
      </DynamicSection>
    </Section>
  );

  const priceChart = (
    <Section title={t("History price")}>
      <PriceChart
        prices={useMemo(
          () => prices?.map((p) => ({ ...p, value: invertPrice ? p.value : p.value > 0 ? 1 / p.value : 0 })),
          [invertPrice, prices]
        )}
        onSpanChange={onPriceSpanChange}
        span={priceSpan}
        priceUpper={
          priceRange?.fullRange
            ? undefined
            : invertPrice
            ? formatPrice(priceRange?.priceLower?.invert(), 6)
            : formatPrice(priceRange?.priceUpper, 6)
        }
        priceLower={
          priceRange?.fullRange
            ? undefined
            : invertPrice
            ? formatPrice(priceRange?.priceUpper?.invert(), 6)
            : formatPrice(priceRange?.priceLower, 6)
        }
        priceCurrent={invertPrice ? formatPrice(priceCurrent?.invert(), 6) : formatPrice(priceCurrent, 6)}
      />
    </Section>
  );

  const content = isMobile ? (
    <>
      {depositSection}
      {priceChart}
      {priceRangeSettings}
      {stakeAndCompound}
    </>
  ) : (
    <TwoColumns>
      <Flex flexDirection="column" alignItems="flex-start">
        {depositSection}
        {priceChart}
      </Flex>
      <Flex flexDirection="column" alignItems="flex-start">
        {stakeAndCompound}
        {priceRangeSettings}
      </Flex>
    </TwoColumns>
  );

  return (
    <>
      <ScrollableContainer>
        {warningMessage}
        {content}
        {/* <ImpermanentLossCalculator
          lpReward={lpReward}
          amountA={amountA}
          amountB={amountB}
          currencyAUsdPrice={currencyAUsdPrice}
          currencyBUsdPrice={currencyBUsdPrice}
          tickLower={priceRange?.tickLower}
          tickUpper={priceRange?.tickUpper}
          sqrtRatioX96={sqrtRatioX96}
          isFarm={props.isFarm}
          usdValue={usdValue}
          cakeApy={cakeApy}
          cakePrice={props.isFarm ? props.cakePrice : undefined}
          setEditCakePrice={setEditCakePrice}
        /> */}
        <AnimatedArrow state={{}} />
        <RoiRate usdAmount={totalReward} roiPercent={totalRate} />
        {allowApply && (
          <Button width="100%" mt="0.75em" onClick={handleApply}>
            {t("Apply Settings")}
          </Button>
        )}
      </ScrollableContainer>
      <Details
        totalYield={totalReward}
        lpReward={lpReward}
        lpApr={apr}
        lpApy={apy}
        compoundIndex={compoundIndex}
        compoundOn={compoundOn}
        farmApr={props.isFarm ? (editCakeApy ? editCakeApy.toFixed(2) : cakeApy?.toFixed(2)) : undefined}
        farmReward={farmReward}
        isFarm={props.isFarm}
      />
    </>
  );
}
