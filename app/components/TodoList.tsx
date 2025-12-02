'use client';

import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useTodoStore } from '@/app/lib/store';
import TodoItem from './TodoItem';
import { format } from 'date-fns';

interface TodoListProps {
    selectedDate: Date;
}

export default function TodoList({ selectedDate }: TodoListProps) {
    const { todos, reorderTodos } = useTodoStore();

    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const filteredTodos = todos.filter((todo) => todo.date === dateStr);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = todos.findIndex((t) => t.id === active.id);
            const newIndex = todos.findIndex((t) => t.id === over.id);

            const newTodos = arrayMove(todos, oldIndex, newIndex);
            reorderTodos(newTodos);
        }
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={filteredTodos.map((t) => t.id)}
                strategy={verticalListSortingStrategy}
            >
                <div className="space-y-2">
                    {filteredTodos.map((todo) => (
                        <TodoItem key={todo.id} todo={todo} />
                    ))}
                    {filteredTodos.length === 0 && (
                        <div className="text-center py-10 text-gray-500 dark:text-yellow-300/70">
                            할 일이 없습니다. 새로운 할 일을 추가해보세요!
                        </div>
                    )}
                </div>
            </SortableContext>
        </DndContext>
    );
}
