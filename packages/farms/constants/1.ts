import { ethereumTokens } from '@pancakeswap/tokens'
import { FarmConfigV3, SerializedFarmConfig } from '@pancakeswap/farms'
import { FeeAmount } from '@pancakeswap/v3-sdk'

export const farmsV3 = [
  {
    pid: 1,
    lpSymbol: 'USDC-ETH LP',
    lpAddress: '0x1ac1A8FEaAEa1900C4166dEeed0C11cC10669D36',
    token: ethereumTokens.usdc,
    quoteToken: ethereumTokens.weth,
    feeAmount: FeeAmount.LOW,
  },
  {
    pid: 2,
    lpSymbol: 'ETH-USDT LP',
    lpAddress: '0x6CA298D2983aB03Aa1dA7679389D955A4eFEE15C',
    token: ethereumTokens.weth,
    quoteToken: ethereumTokens.usdt,
    feeAmount: FeeAmount.LOW,
  },
  {
    pid: 3,
    lpSymbol: 'USDC-USDT LP',
    lpAddress: '0x04c8577958CcC170EB3d2CCa76F9d51bc6E42D8f',
    token: ethereumTokens.usdc,
    quoteToken: ethereumTokens.usdt,
    feeAmount: FeeAmount.LOWEST,
  },
  {
    pid: 4,
    lpSymbol: 'WBTC-ETH LP',
    lpAddress: '0x9b5699D18DFF51fc65fB8ad6F70d93287C36349f',
    token: ethereumTokens.wbtc,
    quoteToken: ethereumTokens.weth,
    feeAmount: FeeAmount.MEDIUM,
  },
  {
    pid: 5,
    lpSymbol: 'CAKE-ETH LP',
    lpAddress: '0x517F451b0A9E1b87Dc0Ae98A05Ee033C3310F046',
    token: ethereumTokens.cake,
    quoteToken: ethereumTokens.weth,
    feeAmount: FeeAmount.MEDIUM,
  },
  {
    pid: 6,
    lpSymbol: 'CAKE-USDC LP',
    lpAddress: '0x11A6713B702817DB0Aa0964D1AfEe4E641319732',
    token: ethereumTokens.cake,
    quoteToken: ethereumTokens.usdc,
    feeAmount: FeeAmount.MEDIUM,
  },
  {
    pid: 7,
    lpSymbol: 'DAI-USDC LP',
    lpAddress: '0xD9e497BD8f491fE163b42A62c296FB54CaEA74B7',
    token: ethereumTokens.dai,
    quoteToken: ethereumTokens.usdc,
    feeAmount: FeeAmount.LOWEST,
  },
  {
    pid: 8,
    lpSymbol: 'LDO-ETH LP',
    lpAddress: '0x34b8AB3a392d54D839dcDBd5Cd1330aBB24bE167',
    token: ethereumTokens.ldo,
    quoteToken: ethereumTokens.weth,
    feeAmount: FeeAmount.MEDIUM,
  },
  {
    pid: 9,
    lpSymbol: 'LINK-ETH LP',
    lpAddress: '0x7ca3EdB2c8fb3e657E282e67F4008d658aA161D2',
    token: ethereumTokens.link,
    quoteToken: ethereumTokens.weth,
    feeAmount: FeeAmount.MEDIUM,
  },
  {
    pid: 10,
    lpSymbol: 'MATIC-ETH LP',
    lpAddress: '0x8579630AC9c53CFEb5167f90Af90d2c0d52ED09c',
    token: ethereumTokens.matic,
    quoteToken: ethereumTokens.weth,
    feeAmount: FeeAmount.MEDIUM,
  },
  {
    pid: 12,
    lpSymbol: 'wstETH-ETH LP',
    lpAddress: '0x4F64951A6583D56004fF6310834C70d182142A07',
    token: ethereumTokens.wstETH,
    quoteToken: ethereumTokens.weth,
    feeAmount: FeeAmount.LOW,
  },
  {
    pid: 13,
    lpSymbol: 'USDC-STG LP',
    lpAddress: '0x7524Fe020EDcD072EE98126b49Fa65Eb85F8C44C',
    token: ethereumTokens.usdc,
    quoteToken: ethereumTokens.stg,
    feeAmount: FeeAmount.MEDIUM,
  },
] satisfies FarmConfigV3[]

const farms: SerializedFarmConfig[] = [
  {
    pid: 154,
    vaultPid: 7,
    lpSymbol: 'CAPS-WETH LP',
    lpAddress: '0x829e9CC8D05d0D55B4494Ecb5a43D71546dd4DDb',
    quoteToken: ethereumTokens.weth,
    token: ethereumTokens.caps,
  },
  {
    pid: 145,
    vaultPid: 6,
    lpSymbol: 'FUSE-WETH LP',
    lpAddress: '0xF9b026786522251c08d8C49e154d036Ef3Ad8Cc7',
    quoteToken: ethereumTokens.weth,
    token: ethereumTokens.fuse,
  },
  {
    pid: 143,
    vaultPid: 5,
    lpSymbol: 'STG-USDC LP',
    lpAddress: '0x6cCA86CC27EB8c7C2d10B0672FE392CFC88e62ff',
    quoteToken: ethereumTokens.usdc,
    token: ethereumTokens.stg,
  },
  {
    pid: 141,
    vaultPid: 4,
    lpSymbol: 'SDAO-WETH LP',
    lpAddress: '0xDA7cF6a0CD5d5e8D10AB55d8bA58257813a239cA',
    quoteToken: ethereumTokens.weth,
    token: ethereumTokens.sdao,
  },
  {
    pid: 126,
    vaultPid: 3,
    lpSymbol: 'WBTC-ETH LP',
    lpAddress: '0x4AB6702B3Ed3877e9b1f203f90cbEF13d663B0e8',
    quoteToken: ethereumTokens.weth,
    token: ethereumTokens.wbtc,
  },
  {
    pid: 125,
    vaultPid: 2,
    lpSymbol: 'ETH-USDT LP',
    lpAddress: '0x17C1Ae82D99379240059940093762c5e4539aba5',
    quoteToken: ethereumTokens.weth,
    token: ethereumTokens.usdt,
  },
  {
    pid: 124,
    vaultPid: 1,
    lpSymbol: 'ETH-USDC LP',
    lpAddress: '0x2E8135bE71230c6B1B4045696d41C09Db0414226',
    quoteToken: ethereumTokens.weth,
    token: ethereumTokens.usdc,
  },
].map((p) => ({ ...p, token: p.token.serialize, quoteToken: p.quoteToken.serialize }))

export default farms
