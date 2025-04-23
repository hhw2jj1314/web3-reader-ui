// src/components/FlowChart.tsx

import React from 'react';
import { Sankey } from '@ant-design/charts';

interface FlowChartProps {
    transfers: {
        from: string;
        to: string;
        assetSymbol?: string;
        amount: string;
    }[];
}

const FlowChart: React.FC<FlowChartProps> = ({ transfers }) => {
    const nodes: any[] = [];
    const links: any[] = [];

    transfers.forEach(tr => {
        if (!nodes.find(n => n.name === tr.from)) nodes.push({ name: tr.from });
        if (!nodes.find(n => n.name === tr.to)) nodes.push({ name: tr.to });
        links.push({
            source: tr.from,
            target: tr.to,
            value: Number(tr.amount),
            asset: tr.assetSymbol || '',
        });
    });

    const config = {
        data: {
            nodes,
            links,
        },
        nodeWidthRatio: 0.02,
        nodePaddingRatio: 0.02,
        height: 300,
        tooltip: {
            customContent: (title: string, items: any[]) => {
                if (!items?.length) return '';
                const item = items[0];
                return `<div>
          <div>资产: ${item.data.asset || ''}</div>
          <div>金额: ${item.data.value}</div>
        </div>`;
            },
        },
    };

    return <Sankey {...config} />;
};

export default FlowChart;
