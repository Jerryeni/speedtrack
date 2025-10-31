export const CONTRACTS = {
  SPEEDTRACK: '0x5023C1dd28B28e5cFb7CD3462d4680cEd2ee78Da' as `0x${string}`,
  STTOKEN: '0xE2eEc4546145749Ff475A18BF648dE329aBE8d9f' as `0x${string}`,
  USDT: '0x0D3E80cBc9DDC0a3Fdee912b99C50cd0b5761eE3' as `0x${string}`,
};

export const BSC_TESTNET = {
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
};

export const NETWORK_CONFIG = BSC_TESTNET;
