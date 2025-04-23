import React, { useState } from 'react';
import { message, Spin } from 'antd';
import provider from '../utils/provider';
import TxInputBar from './TxInputBar';
import TxEventList from './TxEventList';

const TxAnalyzer: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [txHash, setTxHash] = useState('');
    const [txData, setTxData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    // 查询并解析交易
    const handleSearch = async (hash: string) => {
        setLoading(true);
        setError(null);
        setTxData(null);
        setTxHash(hash);
        try {
            if (!/^0x([A-Fa-f0-9]{64})$/.test(hash)) {
                throw new Error('请输入正确的以太坊交易哈希');
            }
            // 1. 拉取交易详情和回执
            const [tx, receipt] = await Promise.all([
                provider.getTransaction(hash),
                provider.getTransactionReceipt(hash),
            ]);
            if (!tx || !receipt) {
                throw new Error('未找到该交易，请检查哈希是否正确');
            }
            // 后续解析逻辑见下一步
            setTxData({ tx, receipt });
        } catch (err: any) {
            setError(err.message || '查询失败');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
            <TxInputBar onSearch={handleSearch} />
            {loading && <Spin tip="加载中..." />}
            {error && <div style={{ color: 'red', marginTop: 16 }}>{error}</div>}
            {txData && <TxEventList txData={txData} />}
        </div>
    );
};

export default TxAnalyzer;
