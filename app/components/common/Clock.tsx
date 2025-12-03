'use client';

import { useState, useEffect } from 'react';

export default function Clock() {
    const [time, setTime] = useState<Date | null>(null);

    useEffect(() => {
        setTime(new Date());
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    if (!time) return null;

    return (
        <div className="text-4xl font-bold tracking-tight text-gray-800 dark:text-white font-mono">
            {time.toLocaleTimeString('ko-KR', { hour12: false })}
        </div>
    );
}
