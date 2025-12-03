'use client';

import { Subtask } from '@/app/types/todo';
import { Check, X } from 'lucide-react';
import clsx from 'clsx';

interface SubtaskItemProps {
    todoId: string;
    subtask: Subtask;
    onToggle: (todoId: string, subtaskId: string, completed: boolean) => void;
    onDelete: (todoId: string, subtaskId: string) => void;
}

export default function SubtaskItem({
    todoId,
    subtask,
    onToggle,
    onDelete,
}: SubtaskItemProps) {
    const handleToggle = () => onToggle(todoId, subtask.id, !subtask.completed);
    const handleDelete = () => onDelete(todoId, subtask.id);

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={handleToggle}
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
                onClick={handleDelete}
                className="text-gray-400 hover:text-red-500 dark:text-yellow-300/50 dark:hover:text-red-500"
            >
                <X className="w-3 h-3" />
            </button>
        </div>
    );
}


