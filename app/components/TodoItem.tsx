'use client';

import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Todo } from '@/app/types/todo';
import { useTodoStore } from '@/app/lib/store';
import { GripVertical, Trash2, Plus, Check, X } from 'lucide-react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

interface TodoItemProps {
    todo: Todo;
}

export default function TodoItem({ todo }: TodoItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: todo.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
    };

    const {
        toggleTodo,
        deleteTodo,
        updateTodo,
        addSubtask,
        toggleSubtask,
        deleteSubtask,
    } = useTodoStore();

    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(todo.text);
    const [newSubtask, setNewSubtask] = useState('');
    const [showSubtasks, setShowSubtasks] = useState(false);

    const handleUpdate = () => {
        if (editText.trim()) {
            updateTodo(todo.id, editText);
            setIsEditing(false);
        }
    };

    const handleAddSubtask = (e: React.FormEvent) => {
        e.preventDefault();
        if (newSubtask.trim()) {
            addSubtask(todo.id, newSubtask);
            setNewSubtask('');
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={clsx(
                'bg-white dark:bg-indigo-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-indigo-700 mb-3 group',
                isDragging && 'opacity-50 scale-105 shadow-xl'
            )}
        >
            <div className="flex items-center gap-3">
                <div
                    {...attributes}
                    {...listeners}
                    className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 dark:text-yellow-300/50 dark:hover:text-yellow-300"
                >
                    <GripVertical className="w-5 h-5" />
                </div>

                <button
                    onClick={() => toggleTodo(todo.id)}
                    className={clsx(
                        'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors',
                        todo.completed
                            ? 'bg-blue-500 border-blue-500 text-white'
                            : 'border-gray-300 dark:border-yellow-300/50 hover:border-blue-500 dark:hover:border-yellow-300'
                    )}
                >
                    {todo.completed && <Check className="w-4 h-4" />}
                </button>

                <div className="flex-1">
                    {isEditing ? (
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleUpdate();
                            }}
                            className="flex gap-2"
                        >
                            <input
                                type="text"
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                className="flex-1 bg-gray-50 dark:bg-indigo-900 rounded px-2 py-1 outline-none focus:ring-2 ring-blue-500 dark:text-yellow-300"
                                autoFocus
                                onBlur={handleUpdate}
                            />
                        </form>
                    ) : (
                        <span
                            onClick={() => setIsEditing(true)}
                            className={clsx(
                                'block cursor-text select-none dark:text-yellow-300',
                                todo.completed && 'text-gray-400 dark:text-yellow-300/50 line-through'
                            )}
                        >
                            {todo.text}
                        </span>
                    )}
                </div>

                <button
                    onClick={() => deleteTodo(todo.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            {/* Subtasks */}
            <div className="ml-12 mt-2">
                <button
                    onClick={() => setShowSubtasks(!showSubtasks)}
                    className="text-xs text-gray-500 dark:text-yellow-300/70 hover:text-blue-500 mb-2 flex items-center gap-1"
                >
                    {todo.subtasks.length > 0
                        ? `${todo.subtasks.length} subtasks`
                        : 'Add subtask'}
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
                                {todo.subtasks.map((subtask) => (
                                    <div key={subtask.id} className="flex items-center gap-2">
                                        <button
                                            onClick={() => toggleSubtask(todo.id, subtask.id)}
                                            className={clsx(
                                                'w-4 h-4 rounded border flex items-center justify-center transition-colors',
                                                subtask.completed
                                                    ? 'bg-blue-500 border-blue-500 text-white'
                                                    : 'border-gray-300 dark:border-yellow-300/50'
                                            )}
                                        >
                                            {subtask.completed && <Check className="w-3 h-3" />}
                                        </button>
                                        <span
                                            className={clsx(
                                                'text-sm flex-1 dark:text-yellow-300',
                                                subtask.completed && 'text-gray-400 dark:text-yellow-300/50 line-through'
                                            )}
                                        >
                                            {subtask.text}
                                        </span>
                                        <button
                                            onClick={() => deleteSubtask(todo.id, subtask.id)}
                                            className="text-gray-400 hover:text-red-500 dark:text-yellow-300/50 dark:hover:text-red-500"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
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
        </div>
    );
}
