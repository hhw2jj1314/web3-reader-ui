// src/utils/decode.ts

import { Interface, Log, TransactionResponse, TransactionReceipt } from 'ethers';
import { ERC20_ABI, UNISWAP_V2_PAIR_ABI } from './abi';
import { ParsedTransfer, ParsedTxResult } from '../types';
import {formatAmount} from './format'
import provider from './provider';

// ERC20 & Uniswap 事件接口
const erc20Iface = new Interface(ERC20_ABI);
const univ2Iface = new Interface(UNISWAP_V2_PAIR_ABI);

// Uniswap V2 Pair 常见主网合约前缀，可扩展
export const UNISWAP_V2_PAIR_PREFIX = '0x'; // 这里只做标记，后续可查询工厂合约判断

// ERC20 合约缓存
const erc20MetaCache = new Map<string, { symbol: string, decimals: number }>();

export async function getERC20Meta(address: string) {
    if (erc20MetaCache.has(address)) return erc20MetaCache.get(address)!;
    try {
        const contract = new (await import('ethers')).Contract(address, ERC20_ABI, provider);
        const [symbol, decimals] = await Promise.all([
            contract.symbol(),
            contract.decimals()
        ]);
        const meta = { symbol, decimals };
        erc20MetaCache.set(address, meta);
        return meta;
    } catch {
        return { symbol: 'UNKNOWN', decimals: 18 };
    }
}

// 主解析入口
export async function parseTransaction(tx: TransactionResponse, receipt: TransactionReceipt): Promise<ParsedTxResult> {
    const transfers: ParsedTransfer[] = [];

    // 1. ETH 原生转账
    if (tx.value && tx.value > 0n) {
        transfers.push({
            type: 'ETH_TRANSFER',
            from: tx.from,
            to: tx.to!,
            asset: 'ETH',
            amount: formatAmount(tx.value.toString(), 18).toString(),
            amountRaw: tx.value.toString(),
            txHash: tx.hash,
        });
    }

    // 2. 日志事件解析
    for (const log of receipt.logs) {
        // ERC20 Transfer/Approval
        let parsed: any = null;
        try {
            parsed = erc20Iface.parseLog(log);
        } catch {}
        if (parsed) {
            if (parsed.name === 'Transfer') {
                const meta = await getERC20Meta(log.address);
                transfers.push({
                    type: 'ERC20_TRANSFER',
                    from: parsed.args.from,
                    to: parsed.args.to,
                    asset: log.address,
                    assetSymbol: meta.symbol,
                    decimals: meta.decimals,
                    amount: formatAmount(parsed.args.value.toString(), meta.decimals).toString(),
                    amountRaw: parsed.args.value.toString(),
                    txHash: tx.hash,
                    logIndex: log.index,
                });
                continue;
            }
            if (parsed.name === 'Approval') {
                const meta = await getERC20Meta(log.address);
                transfers.push({
                    type: 'ERC20_APPROVAL',
                    from: parsed.args.owner,
                    to: parsed.args.spender,
                    asset: log.address,
                    assetSymbol: meta.symbol,
                    decimals: meta.decimals,
                    amount: formatAmount(parsed.args.value.toString(), meta.decimals).toString(),
                    amountRaw: parsed.args.value.toString(),
                    txHash: tx.hash,
                    logIndex: log.index,
                });
                continue;
            }
        }

        // Uniswap V2 Swap/Mint/Burn/Sync
        let parsedUni: any = null;
        try {
            parsedUni = univ2Iface.parseLog(log);
        } catch {}
        if (parsedUni) {
            transfers.push({
                type: `UNISWAP_V2_${parsedUni.name.toUpperCase()}` as any,
                from: parsedUni.args.sender || tx.from,
                to: parsedUni.args.to || tx.to,
                asset: log.address,
                amount: '0', // 具体金额后续在uniswap.ts中详细解析
                amountRaw: '0',
                txHash: tx.hash,
                logIndex: log.index,
                meta: parsedUni.args,
            });
            continue;
        }

        // 其它事件（可扩展）
        // ...
    }

    // 计算手续费
    const gasUsed = receipt.gasUsed?.toString() || '0';
    const gasPrice = tx.gasPrice?.toString() || '0';
    const feeETH = formatAmount((BigInt(gasUsed) * BigInt(gasPrice)).toString(), 18).toString();

    return {
        txHash: tx.hash,
        status: receipt.status,
        blockNumber: receipt.blockNumber,
        from: tx.from,
        to: tx.to!,
        gasUsed,
        gasPrice,
        feeETH,
        transfers,
        rawTx: tx,
        rawReceipt: receipt,
    };
}
