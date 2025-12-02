'use client';

import { useState } from 'react';
import { useTodoStore } from '@/app/lib/store';
import Clock from '@/app/components/Clock';
import WeeklyCalendar from '@/app/components/WeeklyCalendar';
import TodoList from '@/app/components/TodoList';
import ThemeToggle from '@/app/components/ThemeToggle';
import { Plus } from 'lucide-react';
import { format } from 'date-fns';

export default function Home() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [newTodoText, setNewTodoText] = useState('');
  const addTodo = useTodoStore((state) => state.addTodo);

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoText.trim()) {
      addTodo(newTodoText, format(selectedDate, 'yyyy-MM-dd'));
      setNewTodoText('');
    }
  };

  return (
    <main className="min-h-screen p-8 max-w-3xl mx-auto transition-colors duration-300">
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

      <WeeklyCalendar
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />

      <div className="bg-white/50 dark:bg-indigo-900/50 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-yellow-300/30">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-yellow-300">
            {format(selectedDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
              ? 'Today'
              : format(selectedDate, 'EEEE, MMMM d')}
          </h3>

          <form onSubmit={handleAddTodo} className="relative">
            <input
              type="text"
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              placeholder="Add a new task..."
              className="w-full pl-4 pr-12 py-3 rounded-xl bg-white dark:bg-indigo-900 border border-gray-200 dark:border-yellow-300/30 focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm dark:text-yellow-300 dark:placeholder-yellow-300/50"
            />
            <button
              type="submit"
              disabled={!newTodoText.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:hover:bg-blue-500 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </form>
        </div>

        <TodoList selectedDate={selectedDate} />
      </div>
    </main>
  );
}
