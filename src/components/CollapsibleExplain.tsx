// src/components/CollapsibleExplain.tsx

import React, { useState } from 'react';
import { Button } from 'antd';

const CollapsibleExplain: React.FC<{ title?: string, children: React.ReactNode }> = ({ title = '白话说明', children }) => {
    const [open, setOpen] = useState(false);
    return (
        <div style={{ margin: '12px 0' }}>
            <Button type="link" onClick={() => setOpen(v => !v)}>
                {open ? '收起' : '展开'}{title}
            </Button>
            {open && (
                <div style={{ background: '#f6f6f6', padding: 12, borderRadius: 6, marginTop: 4 }}>
                    {children}
                </div>
            )}
        </div>
    );
};

export default CollapsibleExplain;
