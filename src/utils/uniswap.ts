// src/utils/uniswap.ts

export interface UniV2SyncData {
    reserve0: string;
    reserve1: string;
    logIndex: number;
}

export function getSyncEvents(transfers: any[]) {
    // 按 logIndex 升序
    return transfers
        .filter(t => t.type === 'UNISWAP_V2_SYNC')
        .sort((a, b) => (a.logIndex || 0) - (b.logIndex || 0))
        .map(t => ({
            reserve0: t.meta.reserve0.toString(),
            reserve1: t.meta.reserve1.toString(),
            logIndex: t.logIndex,
        }));
}

export function calcReservesChange(syncs: UniV2SyncData[]) {
    if (syncs.length < 2) return null;
    const before = syncs[0];
    const after = syncs[syncs.length - 1];
    return {
        before,
        after,
        delta0: (BigInt(after.reserve0) - BigInt(before.reserve0)).toString(),
        delta1: (BigInt(after.reserve1) - BigInt(before.reserve1)).toString(),
    };
}

// 推算即时价格（如 1 ETH ≈ 3000 USDT），假设 token0 是 ETH，token1 是 USDT
export function calcPoolPrice(reserve0: string, reserve1: string, decimals0 = 18, decimals1 = 6) {
    if (!reserve0 || !reserve1) return null;
    const r0 = Number(reserve0) / Math.pow(10, decimals0);
    const r1 = Number(reserve1) / Math.pow(10, decimals1);
    if (r0 === 0) return null;
    return (r1 / r0).toFixed(2); // 1 token0 ≈ ? token1
}
