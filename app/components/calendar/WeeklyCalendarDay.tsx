'use client';

import { format, isSameDay, isToday } from 'date-fns';
import { ko } from 'date-fns/locale';
import clsx from 'clsx';

interface WeeklyCalendarDayProps {
    day: Date;
    selectedDate: Date;
    todoCount: number;
    onSelect: (date: Date) => void;
}

export default function WeeklyCalendarDay({
    day,
    selectedDate,
    todoCount,
    onSelect,
}: WeeklyCalendarDayProps) {
    const isSelected = isSameDay(day, selectedDate);
    const currentDay = isToday(day);
    const dayOfWeek = day.getDay(); // 0: Sun, 6: Sat
    const isSaturday = dayOfWeek === 6;
    const isSunday = dayOfWeek === 0;

    return (
        <button
            onClick={() => onSelect(day)}
            className={clsx(
                'flex flex-col items-center justify-center p-3 rounded-xl transition-colors duration-200 relative group',
                isSelected
                    ? 'bg-blue-500 text-white shadow-md'
                    : clsx(
                          'hover:bg-gray-100 dark:hover:bg-indigo-800',
                          isSaturday
                              ? 'text-blue-500'
                              : isSunday
                                ? 'text-red-500'
                                : 'text-gray-600 dark:text-yellow-300/80'
                      )
            )}
        >
            <span className="text-xs font-medium mb-1 opacity-80">
                {format(day, 'E', { locale: ko })}
            </span>
            <span className="text-lg font-bold">{format(day, 'd')}</span>

            {todoCount > 0 && (
                <span
                    className={clsx(
                        'absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-[10px] font-bold rounded-full border-2',
                        isSelected
                            ? 'bg-white text-blue-500 border-blue-500'
                            : 'bg-blue-500 text-white border-white dark:border-indigo-900'
                    )}
                >
                    {todoCount}
                </span>
            )}
        </button>
    );
}


