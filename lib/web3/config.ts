// Contract addresses from environment variables with fallbacks
export const CONTRACTS = {
  SPEEDTRACK: (process.env.NEXT_PUBLIC_SPEEDTRACK_ADDRESS || '0x406249AF7Eb8A32c1F79b9BB1A9DB57DB1EB3D23') as `0x${string}`,
  STTOKEN: (process.env.NEXT_PUBLIC_STTOKEN_ADDRESS || '0x8058aE55731ab8dF54DFdf3f21469830F89f35Ed') as `0x${string}`,
  USDT: (process.env.NEXT_PUBLIC_USDT_ADDRESS || '0x0D3E80cBc9DDC0a3Fdee912b99C50cd0b5761eE3') as `0x${string}`,
};

// Multiple RPC endpoints for better reliability
export const BSC_TESTNET_RPC_URLS = [
  'https://data-seed-prebsc-1-s1.bnbchain.org:8545',
  'https://data-seed-prebsc-2-s1.bnbchain.org:8545',
  'https://data-seed-prebsc-1-s2.bnbchain.org:8545',
  'https://bsc-testnet-rpc.publicnode.com',
];

export const BSC_TESTNET = {
  chainId: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '97'),
  chainIdHex: '0x61',
  name: 'BSC Testnet',
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || BSC_TESTNET_RPC_URLS[0],
  rpcUrls: BSC_TESTNET_RPC_URLS,
  blockExplorer: process.env.NEXT_PUBLIC_BLOCK_EXPLORER || 'https://testnet.bscscan.com',
  nativeCurrency: {
    name: 'BNB',
    symbol: 'BNB',
    decimals: 18,
  },
};

export const NETWORK_CONFIG = BSC_TESTNET;
