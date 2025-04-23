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

const FlowChart: React.FC<FlowChartProps> = ({transfers}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const graphRef = useRef<Graph | null>(null);

    // 组织 G6 v5 需要的数据结构
    const nodeSet = new Set<string>();
    const edges = transfers
        .filter(tr => tr.from && tr.to)
        .map(tr => {
            nodeSet.add(tr.from);
            nodeSet.add(tr.to);
            return {
                source: tr.from,
                target: tr.to,
                asset: tr.assetSymbol || '',
                amount: Number(tr.amount),
                style: {
                    lineWidth: 2,
                    labelText: tr.assetSymbol ? `${tr.amount} ${tr.assetSymbol}` : tr.amount,
                    label:false,
                },
            };
        });
    const nodes = Array.from(nodeSet).map(id => ({
        id: id,
        style: {
            fill: 'violet',
            stroke: 'blue',
            lineWidth: 1,
            labelText: id,
            label:false,
        },
    }));

    useEffect(() => {
        if (!containerRef.current || edges.length === 0) return;
        // 销毁旧实例
        if (graphRef.current) {
            graphRef.current.clear().then(r => {
                console.log('清除旧的图形')
            });
        }
        console.log('开始渲染')

        // 创建 Graph 实例（G6 v5 新 API）
        graphRef.current = new Graph({
            container: containerRef.current,
            width: containerRef.current.offsetWidth || 600,
            height: 300,
            data: {
                nodes,
                edges,
            },
            node: {
                style: {
                    labelMaxLines: 2,
                    labelWordWrap: true
                },
                state: {
                    active: {
                        label: true
                    },
                    inactive: {
                        label: false
                    }
                }
            },
            edge: {
                style: {
                    endArrow: true, // 边起始箭头开启
                    labelWordWrap: true,
                    labelMaxLines: 2
                },
                state: {
                    active: {
                        label: true
                    },
                    inactive: {
                        label: false
                    }
                }
            },
            behaviors: ['drag-canvas', 'zoom-canvas', 'drag-node', 'hover-activate', {
                type: 'click-select',
                multiple: true,
                state: 'active',
                unselectedState: 'inactive',
            }],
            layout: {
                type: 'force',
            },
            autoFit: "view",
            autoResize: true,
            transforms: ['process-parallel-edges', 'place-radial-labels'],
            plugins: [{
                type: 'fullscreen'
            }]
        });
        graphRef.current.render().then(
            () => {
                console.log('渲染完成');
            }
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [transfers]); // transfers 变就重新画

    if (edges.length === 0) return <div>暂无有效数据</div>;

    return <div ref={containerRef} style={{
        width: '120%',
        height: '500px',
        border: '1px solid #f0f0f0',
        borderRadius: '4px',
    }}/>;
};

export default FlowChart;
