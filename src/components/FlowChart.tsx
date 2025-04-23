import React, {useEffect, useRef} from 'react';
import {Graph} from '@antv/g6';

interface FlowChartProps {
    transfers: {
        from: string;
        to: string;
        assetSymbol?: string;
        amount: string;
    }[];
}

const FlowChart: React.FC<FlowChartProps> = ({ transfers }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const graphRef = useRef<Graph | null>(null);

    // 组织 G6 v5 需要的数据结构
    const nodeSet = new Set<string>();
    const edges = transfers
        .filter(tr => tr.from && tr.to && !isNaN(Number(tr.amount)))
        .map(tr => {
            nodeSet.add(tr.from);
            nodeSet.add(tr.to);
            return {
                source: tr.from,
                target: tr.to,
                label: tr.assetSymbol ? `${tr.assetSymbol} ${tr.amount}` : tr.amount,
                asset: tr.assetSymbol || '',
                amount: Number(tr.amount),
            };
        });
    const nodes = Array.from(nodeSet).map(id => {
        return {
            id: id,
            style: {
                fill: 'red',
                stroke: 'blue',
                lineWidth: 2,
            },
        } });

    useEffect(() => {
        if (!containerRef.current || edges.length === 0) return;

        // 销毁旧实例
        if (graphRef.current) {
            graphRef.current.destroy();
            graphRef.current = null;
        }

        // 创建 Graph 实例（G6 v5 新 API）
        graphRef.current = new Graph({
            container: containerRef.current,
            width: containerRef.current.offsetWidth || 600,
            height: 300,
            data: {
                nodes,
                edges: edges.map(edge => ({
                    ...edge,
                    style: {
                        lineWidth: Math.max(1, Math.min(8, edge.amount / 10)),
                    },
                    label: edge.asset ? `${edge.asset} ${edge.amount}` : `${edge.amount}`,
                })),
            },
            layout: {
                type: 'force',
                preventOverlap: true,
            },
            node: {
                style: {
                    size: 24,
                    fill: '#91d5ff',
                    stroke: '#1890ff',
                },
            },
            edge: {
                style: {
                    stroke: '#aaa',
                    endArrow: true,
                },
            },
        });
        graphRef.current.render();

        // 如果 transfers 变了，更新数据
        return () => {
            graphRef.current?.destroy();
            graphRef.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [transfers]); // transfers 变就重新画

    // G6 v5 数据变了，直接 changeData
    useEffect(() => {
        if (graphRef.current && edges.length > 0) {
            graphRef.current.updateData({
                nodes,
                edges: edges.map(edge => ({
                    ...edge,
                    style: {
                        lineWidth: Math.max(1, Math.min(8, edge.amount / 10)),
                    },
                    label: edge.asset ? `${edge.asset} ${edge.amount}` : `${edge.amount}`,
                })),
            });
            graphRef.current.render();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [transfers]);

    if (edges.length === 0) return <div>暂无有效数据</div>;

    return <div ref={containerRef} style={{ width: '100%', height: 3000 }} />;
};

export default FlowChart;
