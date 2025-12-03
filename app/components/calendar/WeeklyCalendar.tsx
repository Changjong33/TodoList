'use client';

import { useState } from 'react';
import {
    format,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    addWeeks,
    subWeeks,
} from 'date-fns';
import { ko } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTodoStore } from '@/app/lib/store';
import WeeklyCalendarDay from '../calendar/WeeklyCalendarDay';

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
                {days.map((day) => (
                    <WeeklyCalendarDay
                        key={day.toString()}
                        day={day}
                        selectedDate={selectedDate}
                        todoCount={getTodoCount(day)}
                        onSelect={onSelectDate}
                    />
                ))}
            </div>
        </div>
    );
}
