'use client';

import { useState } from 'react';
import {
    format,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    addWeeks,
    subWeeks,
    isSameDay,
    isToday,
} from 'date-fns';
import { ko } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTodoStore } from '@/app/lib/store';
import clsx from 'clsx';

interface WeeklyCalendarProps {
    selectedDate: Date;
    onSelectDate: (date: Date) => void;
}

export default function WeeklyCalendar({
    selectedDate,
    onSelectDate,
}: WeeklyCalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const todos = useTodoStore((state) => state.todos);

    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday start
    const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

    const prevWeek = () => setCurrentDate(subWeeks(currentDate, 1));
    const nextWeek = () => setCurrentDate(addWeeks(currentDate, 1));

    const getTodoCount = (date: Date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        return todos.filter((todo) => todo.date === dateStr && !todo.completed).length;
    };

    return (
        <div className="w-full bg-white/50 dark:bg-indigo-900/50 backdrop-blur-md rounded-2xl p-6 shadow-lg mb-8 border border-gray-200 dark:border-yellow-300/30">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-yellow-300 capitalize">
                    {format(currentDate, 'yyyy년 MMMM', { locale: ko })}
                </h2>
                <div className="flex gap-2">
                    <button
                        onClick={prevWeek}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-indigo-800 rounded-full transition-colors dark:text-yellow-300"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={nextWeek}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-indigo-800 rounded-full transition-colors dark:text-yellow-300"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-2">
                {days.map((day) => {
                    const isSelected = isSameDay(day, selectedDate);
                    const isCurrentDay = isToday(day);
                    const count = getTodoCount(day);

                    return (
                        <button
                            key={day.toString()}
                            onClick={() => onSelectDate(day)}
                            className={clsx(
                                'flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-200 relative group',
                                isSelected
                                    ? 'bg-blue-500 text-white shadow-md scale-105'
                                    : 'hover:bg-gray-100 dark:hover:bg-indigo-800 text-gray-600 dark:text-yellow-300/80',
                                isCurrentDay && !isSelected && 'border-2 border-blue-500'
                            )}
                        >
                            <span className="text-xs font-medium mb-1 opacity-80">
                                {format(day, 'E', { locale: ko })}
                            </span>
                            <span className="text-lg font-bold">{format(day, 'd')}</span>

                            {count > 0 && (
                                <span
                                    className={clsx(
                                        'absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-[10px] font-bold rounded-full border-2',
                                        isSelected
                                            ? 'bg-white text-blue-500 border-blue-500'
                                            : 'bg-blue-500 text-white border-white dark:border-indigo-900'
                                    )}
                                >
                                    {count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
