import React, { useState } from 'react';
import { Input, Button } from 'antd';

interface TxInputBarProps {
    onSearch: (txHash: string) => void;
}

const TxInputBar: React.FC<TxInputBarProps> = ({ onSearch }) => {
    const [value, setValue] = useState('');
    return (
        <Input.Search
            placeholder="请输入以太坊交易哈希（0x...）"
            enterButton="解析"
            value={value}
            onChange={e => setValue(e.target.value)}
            onSearch={onSearch}
            allowClear
            style={{ maxWidth: 600, margin: '24px auto', display: 'block' }}
        />
    );
};

export default TxInputBar;
