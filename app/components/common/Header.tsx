'use client';

import ThemeToggle from '@/app/components/common/ThemeToggle';
import Clock from '@/app/components/common/Clock';

export default function Header() {
    return (
        <header className="flex justify-between items-end mb-8">
            <div className="flex flex-col gap-4">
                <ThemeToggle />
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-yellow-300 mb-2 transition-colors">
                        My Tasks
                    </h1>
                    <p className="text-gray-500 dark:text-yellow-300/80 transition-colors">
                        Manage your daily goals
                    </p>
                </div>
            </div>
            <Clock />
        </header>
    );
}
