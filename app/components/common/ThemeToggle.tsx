'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import clsx from 'clsx';

export default function ThemeToggle() {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    useEffect(() => {
        // Check local storage or system preference
        const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
        if (storedTheme) {
            setTheme(storedTheme);
            document.documentElement.classList.toggle('dark', storedTheme === 'dark');
        } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setTheme('dark');
            document.documentElement.classList.add('dark');
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.classList.toggle('dark');
    };

    return (
        <button
            onClick={toggleTheme}
            className={clsx(
                'w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 cursor-pointer',
                theme === 'light'
                    ? 'bg-amber-100 text-amber-500 hover:bg-amber-200'
                    : 'bg-indigo-900 text-yellow-300 hover:bg-indigo-800 shadow-[0_0_15px_rgba(253,224,71,0.3)]'
            )}
            aria-label="Toggle theme"
        >
            {theme === 'light' ? (
                <Sun className="w-6 h-6" />
            ) : (
                <Moon className="w-6 h-6 fill-current" />
            )}
        </button>
    );
}
