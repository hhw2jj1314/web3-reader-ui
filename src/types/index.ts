// src/types/index.ts

export type AssetType = 'ETH' | 'ERC20' | 'Other';

export interface ParsedTransfer {
    type: 'ETH_TRANSFER' | 'ERC20_TRANSFER' | 'ERC20_APPROVAL' | 'UNISWAP_V2_SWAP' | 'UNISWAP_V2_MINT' | 'UNISWAP_V2_BURN' | 'UNISWAP_V2_SYNC' | 'OTHER_EVENT';
    from: string;
    to: string;
    asset: string; // 地址或 ETH
    assetSymbol?: string;
    amount: string; // 十进制字符串
    amountRaw: string; // 原始最小单位
    decimals?: number;
    txHash: string;
    logIndex?: number;
    meta?: any; // 额外信息
}

export interface ParsedTxResult {
    txHash: string;
    status: null | number;
    blockNumber: number;
    from: string;
    to: string;
    gasUsed: string;
    gasPrice: string;
    feeETH: string;
    transfers: ParsedTransfer[];
    rawTx: any;
    rawReceipt: any;
}
