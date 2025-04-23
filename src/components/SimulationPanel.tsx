// src/components/SimulationPanel.tsx

import React, { useState } from 'react';
import { Button, Descriptions, Alert, Spin } from 'antd';
import provider from '../utils/provider';

interface SimulationPanelProps {
    tx: any;
}

const SimulationPanel: React.FC<SimulationPanelProps> = ({ tx }) => {
    const [simResult, setSimResult] = useState<any>(null);
    const [gasEstimate, setGasEstimate] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    // 1. 预估 Gas
    const handleEstimateGas = async () => {
        setLoading(true); setErr(null); setGasEstimate(null);
        try {
            const estimate = await provider.estimateGas({
                from: tx.from,
                to: tx.to,
                data: tx.data,
                value: tx.value,
            });
            setGasEstimate(estimate.toString());
        } catch (e: any) {
            setErr(e.message || 'Gas 预估失败');
        }
        setLoading(false);
    };

    // 2. 模拟执行（callStatic）
    const handleSimulate = async () => {
        setLoading(true); setErr(null); setSimResult(null);
        try {
            const res = await provider.call({
                from: tx.from,
                to: tx.to,
                data: tx.data,
                value: tx.value,
            });
            setSimResult(res);
        } catch (e: any) {
            setErr(e.message || '模拟执行失败');
        }
        setLoading(false);
    };

    return (
        <div style={{ margin: '24px 0' }}>
            <Descriptions title="模拟交易/预估 Gas" size="small" column={1} />
            <Button onClick={handleEstimateGas} style={{ marginRight: 8 }}>预估 Gas</Button>
            <Button onClick={handleSimulate}>模拟执行</Button>
            {loading && <Spin style={{ marginLeft: 16 }} />}
            {gasEstimate && (
                <div style={{ marginTop: 8 }}>
                    预估 GasUsed: <b>{gasEstimate}</b>
                </div>
            )}
            {simResult && (
                <div style={{ marginTop: 8 }}>
                    <b>模拟返回值:</b>
                    <pre>{simResult}</pre>
                </div>
            )}
            {err && <Alert type="error" message={err} style={{ marginTop: 8 }} />}
        </div>
    );
};

export default SimulationPanel;
