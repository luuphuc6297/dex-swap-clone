import { Currency, CurrencyAmount, JSBI, MaxUint256, Percent, Fraction, ZERO } from '@pancakeswap/sdk'
import invariant from 'tiny-invariant'
import { parseNumberToFraction } from '@pancakeswap/utils/formatFractions'

import { maxLiquidityForAmounts } from './maxLiquidityForAmounts'
import { TickMath } from './tickMath'
import { PositionMath } from './positionMath'
import { ONE_HUNDRED_PERCENT, MAX_FEE, ZERO_PERCENT } from '../internalConstants'
import { Tick } from '../entities'
import { TickList } from './tickList'

export const FeeCalculator = {
  getEstimatedLPFee,
  getLiquidityFromTick,
  getLiquidityFromSqrtRatioX96,
  getAverageLiquidity,
  getLiquidityBySingleAmount,
  getDependentAmount,
  getLiquidityByAmountsAndPrice,
  getAmountsByLiquidityAndPrice,
  getAmountsAtNewPrice,
}

interface EstimateFeeOptions {
  // Amount of token user input
  amount: CurrencyAmount<Currency>
  // Currency of the other token in the pool
  currency: Currency
  tickLower: number
  tickUpper: number
  // Average 24h historical trading volume in USD
  volume24H: number

  // The reason of using price sqrt X96 instead of tick current is that
  // tick current may have rounding error since it's a floor rounding
  sqrtRatioX96: JSBI
  // Most active liquidity of the pool
  mostActiveLiquidity: JSBI
  // Fee tier of the pool, in hundreds of a bip, i.e. 1e-6
  fee: number

  // Proportion of time in future 24 hours when price staying inside given tick range
  insidePercentage?: Percent

  // Proportion of protocol fee
  protocolFee?: Percent
}

export function getEstimatedLPFeeWithProtocolFee(options: EstimateFeeOptions) {
  try {
    return tryGetEstimatedLPFee(options)
  } catch (e) {
    console.error(e)
    return new Fraction(ZERO)
  }
}

export function getEstimatedLPFee({ protocolFee = ZERO_PERCENT, ...rest }: EstimateFeeOptions) {
  try {
    const fee = tryGetEstimatedLPFee(rest)
    return ONE_HUNDRED_PERCENT.subtract(protocolFee).multiply(fee).asFraction
  } catch (e) {
    console.error(e)
    return new Fraction(ZERO)
  }
}

function tryGetEstimatedLPFee({
  amount,
  currency,
  volume24H,
  sqrtRatioX96,
  tickLower,
  tickUpper,
  mostActiveLiquidity,
  fee,
  insidePercentage = ONE_HUNDRED_PERCENT,
}: EstimateFeeOptions): Fraction {
  invariant(!Number.isNaN(fee) && fee >= 0, 'INVALID_FEE')

  const tickCurrent = TickMath.getTickAtSqrtRatio(sqrtRatioX96)
  if (tickCurrent < tickLower || tickCurrent > tickUpper) {
    return new Fraction(ZERO)
  }

  const liquidity = FeeCalculator.getLiquidityBySingleAmount({ amount, currency, tickUpper, tickLower, sqrtRatioX96 })

  return insidePercentage
    .multiply(parseNumberToFraction(volume24H).multiply(JSBI.BigInt(fee)).multiply(liquidity))
    .divide(JSBI.multiply(MAX_FEE, JSBI.add(liquidity, mostActiveLiquidity))).asFraction
}

interface GetAmountOptions {
  // Amount of token user input
  amount: CurrencyAmount<Currency>
  // Currency of the dependent token in the pool
  currency: Currency
  tickLower: number
  tickUpper: number

  // The reason of using price sqrt X96 instead of tick current is that
  // tick current may have rounding error since it's a floor rounding
  sqrtRatioX96: JSBI
}

export function getDependentAmount(options: GetAmountOptions) {
  const { currency, amount, sqrtRatioX96, tickLower, tickUpper } = options
  const currentTick = TickMath.getTickAtSqrtRatio(sqrtRatioX96)
  const liquidity = FeeCalculator.getLiquidityBySingleAmount(options)
  const isToken0 = currency.wrapped.sortsBefore(amount.currency.wrapped)
  const getTokenAmount = isToken0 ? PositionMath.getToken0Amount : PositionMath.getToken1Amount
  return CurrencyAmount.fromRawAmount(
    currency,
    getTokenAmount(currentTick, tickLower, tickUpper, sqrtRatioX96, liquidity)
  )
}

export function getLiquidityBySingleAmount({ amount, currency, ...rest }: GetAmountOptions): JSBI {
  return getLiquidityByAmountsAndPrice({
    amountA: amount,
    amountB: CurrencyAmount.fromRawAmount(currency, MaxUint256),
    ...rest,
  })
}

interface GetLiquidityOptions extends Omit<GetAmountOptions, 'amount' | 'currency'> {
  amountA: CurrencyAmount<Currency>
  amountB: CurrencyAmount<Currency>
}

export function getLiquidityByAmountsAndPrice({
  amountA,
  amountB,
  tickUpper,
  tickLower,
  sqrtRatioX96,
}: GetLiquidityOptions) {
  const isToken0 = amountA.currency.wrapped.sortsBefore(amountB.currency.wrapped)
  const [inputAmount0, inputAmount1] = isToken0
    ? [amountA.quotient, amountB.quotient]
    : [amountB.quotient, amountA.quotient]
  const sqrtRatioAX96 = TickMath.getSqrtRatioAtTick(tickLower)
  const sqrtRatioBX96 = TickMath.getSqrtRatioAtTick(tickUpper)
  return maxLiquidityForAmounts(sqrtRatioX96, sqrtRatioAX96, sqrtRatioBX96, inputAmount0, inputAmount1, true)
}

interface GetAmountsOptions extends Omit<GetAmountOptions, 'amount' | 'currency'> {
  currencyA: Currency
  currencyB: Currency
  liquidity: JSBI
}

export function getAmountsByLiquidityAndPrice(options: GetAmountsOptions) {
  const { currencyA, currencyB, liquidity, sqrtRatioX96, tickLower, tickUpper } = options
  const currentTick = TickMath.getTickAtSqrtRatio(sqrtRatioX96)
  const isToken0 = currencyA.wrapped.sortsBefore(currencyB.wrapped)
  const adjustedAmount0 = PositionMath.getToken0Amount(currentTick, tickLower, tickUpper, sqrtRatioX96, liquidity)
  const adjustedAmount1 = PositionMath.getToken1Amount(currentTick, tickLower, tickUpper, sqrtRatioX96, liquidity)
  return [
    CurrencyAmount.fromRawAmount(currencyA, isToken0 ? adjustedAmount0 : adjustedAmount1),
    CurrencyAmount.fromRawAmount(currencyB, isToken0 ? adjustedAmount1 : adjustedAmount0),
  ]
}

interface GetAmountsAtNewPriceOptions extends Omit<GetAmountOptions, 'amount' | 'currency'> {
  amountA: CurrencyAmount<Currency>
  amountB: CurrencyAmount<Currency>
  newSqrtRatioX96: JSBI
}

export function getAmountsAtNewPrice({ newSqrtRatioX96, ...rest }: GetAmountsAtNewPriceOptions) {
  const { tickLower, tickUpper, amountA, amountB } = rest
  const liquidity = FeeCalculator.getLiquidityByAmountsAndPrice(rest)
  return FeeCalculator.getAmountsByLiquidityAndPrice({
    liquidity,
    currencyA: amountA.currency,
    currencyB: amountB.currency,
    tickLower,
    tickUpper,
    sqrtRatioX96: newSqrtRatioX96,
  })
}

export function getAverageLiquidity(ticks: Tick[], tickSpacing: number, tickLower: number, tickUpper: number): JSBI {
  invariant(tickLower <= tickUpper, 'INVALID_TICK_RANGE')
  TickList.validateList(ticks, tickSpacing)

  if (tickLower === tickUpper) {
    return FeeCalculator.getLiquidityFromTick(ticks, tickLower)
  }

  const lowerOutOfBound = tickLower < ticks[0].index
  let lastTick = lowerOutOfBound
    ? new Tick({ index: TickMath.MIN_TICK, liquidityNet: ZERO, liquidityGross: ZERO })
    : TickList.nextInitializedTick(ticks, tickLower, true)
  let currentTick = TickList.nextInitializedTick(ticks, tickLower, false)
  let currentL = lowerOutOfBound ? ZERO : FeeCalculator.getLiquidityFromTick(ticks, currentTick.index)
  let weightedL = ZERO
  const getWeightedLFromLastTickTo = (toTick: number) =>
    JSBI.multiply(currentL, JSBI.BigInt(toTick - Math.max(lastTick.index, tickLower)))
  while (currentTick.index < tickUpper) {
    weightedL = JSBI.add(weightedL, getWeightedLFromLastTickTo(currentTick.index))
    currentL = JSBI.add(currentL, currentTick.liquidityNet)
    lastTick = currentTick

    // Tick upper is out of initialized tick range
    if (currentTick.index === ticks[ticks.length - 1].index) {
      break
    }

    currentTick = TickList.nextInitializedTick(ticks, currentTick.index, false)
  }
  weightedL = JSBI.add(weightedL, getWeightedLFromLastTickTo(tickUpper))

  return JSBI.divide(weightedL, JSBI.BigInt(tickUpper - tickLower))
}

export function getLiquidityFromSqrtRatioX96(ticks: Tick[], sqrtRatioX96: JSBI): JSBI {
  const tick = TickMath.getTickAtSqrtRatio(sqrtRatioX96)
  return FeeCalculator.getLiquidityFromTick(ticks, tick)
}

export function getLiquidityFromTick(ticks: Tick[], tick: number): JSBI {
  // calculate a cumulative of liquidityNet from all ticks that poolTicks[i] <= tick
  let liquidity = ZERO

  if (!ticks?.length) return liquidity

  if (tick < ticks[0].index || tick > ticks[ticks.length - 1].index) {
    return liquidity
  }

  for (let i = 0; i < ticks.length - 1; ++i) {
    liquidity = JSBI.add(liquidity, ticks[i].liquidityNet)

    const lowerTick = ticks[i].index
    const upperTick = ticks[i + 1]?.index

    if (lowerTick <= tick && tick <= upperTick) {
      break
    }
  }

  return liquidity
}
