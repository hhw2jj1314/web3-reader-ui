// src/utils/provider.ts
import { AlchemyProvider } from 'ethers';

const ALCHEMY_KEY = 'FX_bllPZgI0-j85vKwK7FpnVjXT6LZtC';
export const provider = new AlchemyProvider('mainnet', ALCHEMY_KEY);

// 统一导出，方便全局复用
export default provider;
