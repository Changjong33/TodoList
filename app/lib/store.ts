import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Todo } from '@/app/types/todo';

interface TodoStore {
    todos: Todo[];
    addTodo: (text: string, date: string) => void;
    toggleTodo: (id: string) => void;
    deleteTodo: (id: string) => void;
    updateTodo: (id: string, text: string) => void;
    reorderTodos: (newOrder: Todo[]) => void;
    addSubtask: (todoId: string, text: string) => void;
    toggleSubtask: (todoId: string, subtaskId: string) => void;
    deleteSubtask: (todoId: string, subtaskId: string) => void;
}

export const useTodoStore = create<TodoStore>()(
    persist(
        (set) => ({
            todos: [],
            addTodo: (text, date) =>
                set((state) => ({
                    todos: [
                        ...state.todos,
                        {
                            id: crypto.randomUUID(),
                            text,
                            completed: false,
                            date,
                            subtasks: [],
                            order: state.todos.length,
                        },
                    ],
                })),
            toggleTodo: (id) =>
                set((state) => ({
                    todos: state.todos.map((todo) =>
                        todo.id === id ? { ...todo, completed: !todo.completed } : todo
                    ),
                })),
            deleteTodo: (id) =>
                set((state) => ({
                    todos: state.todos.filter((todo) => todo.id !== id),
                })),
            updateTodo: (id, text) =>
                set((state) => ({
                    todos: state.todos.map((todo) =>
                        todo.id === id ? { ...todo, text } : todo
                    ),
                })),
            reorderTodos: (newOrder) => set({ todos: newOrder }),
            addSubtask: (todoId, text) =>
                set((state) => ({
                    todos: state.todos.map((todo) =>
                        todo.id === todoId
                            ? {
                                ...todo,
                                subtasks: [
                                    ...todo.subtasks,
                                    { id: crypto.randomUUID(), text, completed: false },
                                ],
                            }
                            : todo
                    ),
                })),
            toggleSubtask: (todoId, subtaskId) =>
                set((state) => ({
                    todos: state.todos.map((todo) =>
                        todo.id === todoId
                            ? {
                                ...todo,
                                subtasks: todo.subtasks.map((sub) =>
                                    sub.id === subtaskId
                                        ? { ...sub, completed: !sub.completed }
                                        : sub
                                ),
                            }
                            : todo
                    ),
                })),
            deleteSubtask: (todoId, subtaskId) =>
                set((state) => ({
                    todos: state.todos.map((todo) =>
                        todo.id === todoId
                            ? {
                                ...todo,
                                subtasks: todo.subtasks.filter((sub) => sub.id !== subtaskId),
                            }
                            : todo
                    ),
                })),
        }),
        {
            name: 'todo-storage',
        }
    )
);
