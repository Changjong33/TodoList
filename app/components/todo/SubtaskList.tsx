'use client';

import { useState } from 'react';
import { useTodoStore } from '@/app/lib/store';
import { Subtask } from '@/app/types/todo';
import { Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SubtaskItem from './SubtaskItem';

interface SubtaskListProps {
    todoId: string;
    subtasks: Subtask[];
}

export default function SubtaskList({ todoId, subtasks }: SubtaskListProps) {
    const { addSubtask, toggleSubtask, deleteSubtask } = useTodoStore();
    const [newSubtask, setNewSubtask] = useState('');
    const [showSubtasks, setShowSubtasks] = useState(false);

    const handleAddSubtask = (e: React.FormEvent) => {
        e.preventDefault();
        if (newSubtask.trim()) {
            addSubtask(todoId, newSubtask);
            setNewSubtask('');
        }
    };

    return (
        <div className="ml-12 mt-2">
            <button
                onClick={() => setShowSubtasks(!showSubtasks)}
                className="cursor-pointer text-xs text-gray-500 dark:text-yellow-300/70 hover:text-blue-500 mb-2 flex items-center gap-1"
            >
                {subtasks.length > 0
                    ? `세부항목 보기 (${subtasks.length})`
                    : '세부항목 추가하기'}
            </button>

            <AnimatePresence>
                {showSubtasks && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="space-y-2 mb-3">
                            {subtasks.map((subtask) => (
                                <SubtaskItem
                                    key={subtask.id}
                                    todoId={todoId}
                                    subtask={subtask}
                                    onToggle={toggleSubtask}
                                    onDelete={deleteSubtask}
                                />
                            ))}
                        </div>

                        <form onSubmit={handleAddSubtask} className="flex gap-2">
                            <input
                                type="text"
                                value={newSubtask}
                                onChange={(e) => setNewSubtask(e.target.value)}
                                placeholder="New subtask..."
                                className="flex-1 text-sm bg-gray-50 dark:bg-indigo-900 rounded px-2 py-1 outline-none focus:ring-2 ring-blue-500 dark:text-yellow-300 dark:placeholder-yellow-300/30"
                            />
                            <button
                                type="submit"
                                disabled={!newSubtask.trim()}
                                className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
