// src/App.tsx

import React from 'react';
import TxAnalyzer from './components/TxAnalyzer';

const App: React.FC = () => {
    return (
        <div style={{ background: '#f7f9fb', minHeight: '100vh' }}>
            <h1 style={{ textAlign: 'center', marginTop: 32, fontWeight: 600 }}>
                以太坊全类型交易解析 & 可视化分析器
            </h1>
            <TxAnalyzer />
        </div>
    );
};

export default App;
