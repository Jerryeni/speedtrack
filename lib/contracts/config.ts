export const CONTRACTS = {
  SPEEDTRACK: '0x5023C1dd28B28e5cFb7CD3462d4680cEd2ee78Da',
  STTOKEN: '0xE2eEc4546145749Ff475A18BF648dE329aBE8d9f',
  USDT: '0x0D3E80cBc9DDC0a3Fdee912b99C50cd0b5761eE3',
} as const;

export const NETWORK = {
  chainId: 97,
  chainIdHex: '0x61',
  name: 'BSC Testnet',
  rpcUrl: 'https://data-seed-prebsc-1-s1.bnbchain.org:8545',
  blockExplorer: 'https://testnet.bscscan.com',
  nativeCurrency: {
    name: 'BNB',
    symbol: 'BNB',
    decimals: 18,
  },
} as const;

export const CONSTANTS = {
  ACTIVATION_FEE: '10',
  MIN_INVESTMENT: '10',
  MAX_INVESTMENT_POOL_1: '50',
  MAX_INVESTMENT_OTHER: '500',
  REWARD_PERCENT: 0.5,
} as const;
