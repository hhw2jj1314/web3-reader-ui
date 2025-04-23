// src/components/TxEventList.tsx

import React, { useEffect, useState } from 'react';
import { Spin, Alert, Divider, Typography } from 'antd';
import { parseTransaction } from '../utils/decode';
import TxEventDetail from './TxEventDetail';
import FlowChart from './FlowChart';
import UniV2PoolChart from './UniV2PoolChart';
import { getSyncEvents, calcReservesChange, calcPoolPrice } from '../utils/uniswap';
import SimulationPanel from './SimulationPanel';

const { Title } = Typography;

const TxEventList: React.FC<{ txData: any }> = ({ txData }) => {
    const [parsed, setParsed] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        setParsed(null);
        setErr(null);
        parseTransaction(txData.tx, txData.receipt)
            .then(res => setParsed(res))
            .catch(e => setErr(e.message || '解析失败'))
            .finally(() => setLoading(false));
    }, [txData]);

    if (loading) return <Spin tip="解析中..." />;
    if (err) return <Alert type="error" message={err} />;
    if (!parsed) return null;

    // 资产流向图数据准备
    const flowTransfers = parsed.transfers
        .filter((t: any) => t.type === 'ETH_TRANSFER' || t.type === 'ERC20_TRANSFER')
        .map((t: any) => ({
            from: t.from,
            to: t.to,
            assetSymbol: t.assetSymbol || t.asset,
            amount: t.amount,
        }));

    // Uniswap V2 池子变化与价格推算
    const syncs = getSyncEvents(parsed.transfers);
    const poolChange = syncs.length >= 2 ? calcReservesChange(syncs) : null;
    const price = poolChange
        ? calcPoolPrice(poolChange.after.reserve0, poolChange.after.reserve1)
        : null;

    return (
        <div style={{ marginTop: 32 }}>
            <Title level={4}>交易明细解析</Title>
            <SimulationPanel tx={parsed.rawTx} />
            <Divider />
            <Title level={5}>资产流向图</Title>
            <FlowChart transfers={flowTransfers} />
            <Divider />
            {poolChange && (
                <>
                    <Title level={5}>Uniswap V2 池子储备变化</Title>
                    <UniV2PoolChart
                        before={poolChange.before}
                        after={poolChange.after}
                        token0Symbol="Token0"
                        token1Symbol="Token1"
                    />
                    <div style={{ marginTop: 8 }}>
                        <b>即时价格推算：</b>
                        1 Token0 ≈ {price} Token1
                        <div style={{ fontSize: 12, color: '#888' }}>
                            计算公式：价格 = 储备1 / 储备0 = {poolChange.after.reserve1} / {poolChange.after.reserve0} = {price}
                        </div>
                    </div>
                </>
            )}
            <Divider />
            <div>
                {parsed.transfers.map((event: any, idx: number) => (
                    <TxEventDetail event={event} key={event.logIndex || idx} />
                ))}
            </div>
        </div>
    );
};

export default TxEventList;
