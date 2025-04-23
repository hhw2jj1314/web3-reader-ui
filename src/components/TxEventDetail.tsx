// src/components/TxEventDetail.tsx

import React from 'react';
import { Card, Descriptions, Typography } from 'antd';
import CollapsibleExplain from './CollapsibleExplain';

const { Text } = Typography;

const TxEventDetail: React.FC<{ event: any }> = ({ event }) => {
    if (event.type === 'ERC20_TRANSFER') {
        return (
            <Card size="small" style={{ marginBottom: 16 }}>
                <Descriptions size="small" column={1} title="ERC20 转账">
                    <Descriptions.Item label="From">{event.from}</Descriptions.Item>
                    <Descriptions.Item label="To">{event.to}</Descriptions.Item>
                    <Descriptions.Item label="资产">{event.assetSymbol} ({event.asset})</Descriptions.Item>
                    <Descriptions.Item label="金额">
                        {event.amount} {event.assetSymbol}
                        <Text type="secondary" style={{ marginLeft: 8 }}>
                            (最小单位: {event.amountRaw})
                        </Text>
                    </Descriptions.Item>
                </Descriptions>
                <CollapsibleExplain>
                    <div>
                        <b>白话说明：</b>本事件是一次 ERC20 代币转账，<br />
                        从 <Text code>{event.from}</Text> 向 <Text code>{event.to}</Text> 转账
                        <Text strong>{event.amount} {event.assetSymbol}</Text>。
                        <br />
                        金额换算公式：<br />
                        <Text code>实际金额 = 最小单位 / 10^{event.decimals}</Text><br />
                        代入：{event.amountRaw} / 10^{event.decimals} = {event.amount} {event.assetSymbol}
                    </div>
                </CollapsibleExplain>
            </Card>
        );
    }

    if (event.type === 'UNISWAP_V2_SYNC') {
        return (
            <Card size="small" style={{ marginBottom: 16 }}>
                <Descriptions size="small" column={1} title="Uniswap V2 Sync（池储备变动）">
                    <Descriptions.Item label="池合约">{event.asset}</Descriptions.Item>
                    <Descriptions.Item label="储备0">{event.meta.reserve0.toString()}</Descriptions.Item>
                    <Descriptions.Item label="储备1">{event.meta.reserve1.toString()}</Descriptions.Item>
                </Descriptions>
                <CollapsibleExplain>
                    <div>
                        <b>白话说明：</b>本事件记录了 Uniswap V2 流动性池的储备变化，<br />
                        代表当前池中两种资产的最新储备量。
                    </div>
                </CollapsibleExplain>
            </Card>
        );
    }

    // 其它类型可扩展
    return (
        <Card size="small" style={{ marginBottom: 16 }}>
            <pre>{JSON.stringify(event, (key, value) =>
                typeof value === 'bigint'
                    ? value.toString()
                    : value )}</pre>
        </Card>
    );
};

export default TxEventDetail;
