'use client';

import { useState } from 'react';
import { useTodoStore } from '@/app/lib/store';
import { Plus } from 'lucide-react';
import { format } from 'date-fns';

interface TodoInputProps {
    selectedDate: Date;
}

export default function TodoInput({ selectedDate }: TodoInputProps) {
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
    );
}
