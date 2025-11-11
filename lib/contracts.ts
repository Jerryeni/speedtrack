import SpeedTrackABI from './contracts/abis/SpeedTrack.json';
import STTokenABI from './contracts/abis/STToken.json';
import USDTABI from './contracts/abis/USDT.json';

export interface ContractConfig {
  address: `0x${string}`;
  abi: any[];
  chainId: number;
}

export const CONTRACTS = {
  SPEED_TRACK: {
    address: '0x5023C1dd28B28e5cFb7CD3462d4680cEd2ee78Da' as `0x${string}`,
    abi: SpeedTrackABI,
    chainId: 97,
  },
  ST_TOKEN: {
    address: '0xE2eEc4546145749Ff475A18BF648dE329aBE8d9f' as `0x${string}`,
    abi: STTokenABI,
    chainId: 97,
  },
  USDT: {
    address: '0x0D3E80cBc9DDC0a3Fdee912b99C50cd0b5761eE3' as `0x${string}`,
    abi: USDTABI,
    chainId: 97,
  },
};
