// src/components/UniV2PoolChart.tsx

import React from 'react';
import { Column } from '@ant-design/charts';

interface UniV2PoolChartProps {
    before: { reserve0: string, reserve1: string };
    after: { reserve0: string, reserve1: string };
    token0Symbol?: string;
    token1Symbol?: string;
    decimals0?: number;
    decimals1?: number;
}

const UniV2PoolChart: React.FC<UniV2PoolChartProps> = ({
                                                           before, after, token0Symbol = 'Token0', token1Symbol = 'Token1', decimals0 = 18, decimals1 = 18
                                                       }) => {
    const data = [
        { type: token0Symbol, stage: '交易前', value: Number(before.reserve0) / Math.pow(10, decimals0) },
        { type: token0Symbol, stage: '交易后', value: Number(after.reserve0) / Math.pow(10, decimals0) },
        { type: token1Symbol, stage: '交易前', value: Number(before.reserve1) / Math.pow(10, decimals1) },
        { type: token1Symbol, stage: '交易后', value: Number(after.reserve1) / Math.pow(10, decimals1) },
    ];

    const config = {
        data,
        isGroup: true,
        xField: 'type',
        yField: 'value',
        seriesField: 'stage',
        columnWidthRatio: 0.4,
        label: { position: 'middle' as const, style: { fill: '#fff' } },
        height: 220,
        color: ['#69b3f9', '#ffb84d'],
        legend: { position: 'top' as const },
        xAxis: { title: { text: '资产类型' }, label: { autoRotate: false } },
        yAxis: { title: { text: '储备量' } },
    };

    return <Column {...config} />;
};

export default UniV2PoolChart;
