'use client';

import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Todo } from '@/app/types/todo';
import { useTodoStore } from '@/app/lib/store';
import { GripVertical, Trash2, Check } from 'lucide-react';
import clsx from 'clsx';
import SubtaskList from './SubtaskList';

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
    } = useTodoStore();

    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(todo.text);

    const handleUpdate = () => {
        if (editText.trim()) {
            updateTodo(todo.id, editText);
            setIsEditing(false);
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
                    onClick={() => toggleTodo(todo.id, !todo.completed)}
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
            <SubtaskList todoId={todo.id} subtasks={todo.subtasks} />
        </div>
    );
}
