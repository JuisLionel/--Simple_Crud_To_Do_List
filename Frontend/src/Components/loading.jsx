import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';


export default function Loading() {
    const [dots, setDots] = useState('.');

    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prev => (prev.length === 3 ? '.' : prev + '.'));
        }, 500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center w-screen h-screen text-white bg-gradient-to-r from-blue-900 to-blue-600">
            <Spin indicator={<LoadingOutlined style={{ fontSize: 48, color: 'white' }} spin />} />
            <h1 className="mt-5 text-2xl">Loading{dots}</h1>
        </div>
    );
}
