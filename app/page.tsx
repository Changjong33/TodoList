'use client';

import { useState, useEffect } from 'react';
import { useTodoStore } from '@/app/lib/store';
import WeeklyCalendar from '@/app/components/calendar/WeeklyCalendar';
import TodoList from '@/app/components/todo/TodoList';
import Header from '@/app/components/common/Header';
import TodoInput from '@/app/components/todo/TodoInput';

export default function Home() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const fetchTodos = useTodoStore((state) => state.fetchTodos);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  return (
    <main className="min-h-screen p-8 max-w-3xl mx-auto transition-colors duration-300">
      <Header />

      <WeeklyCalendar
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />

      <div className="bg-white/50 dark:bg-indigo-900/50 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-yellow-300/30">
        <TodoInput selectedDate={selectedDate} />
        <TodoList selectedDate={selectedDate} />
      </div>
    </main>
  );
}
