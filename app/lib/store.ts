import { create } from 'zustand';
import { Todo } from '@/app/types/todo';

interface TodoStore {
    todos: Todo[];
    fetchTodos: () => Promise<void>;
    addTodo: (text: string, date: string) => Promise<void>;
    toggleTodo: (id: string, completed: boolean) => Promise<void>;
    deleteTodo: (id: string) => Promise<void>;
    updateTodo: (id: string, text: string) => Promise<void>;
    reorderTodos: (newOrder: Todo[]) => Promise<void>;
    addSubtask: (todoId: string, text: string) => Promise<void>;
    toggleSubtask: (todoId: string, subtaskId: string, completed: boolean) => Promise<void>;
    deleteSubtask: (todoId: string, subtaskId: string) => Promise<void>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const useTodoStore = create<TodoStore>((set, get) => ({
    todos: [],
    fetchTodos: async () => {
        try {
            const res = await fetch(`${API_URL}/todos`);
            const data = await res.json();
            set({ todos: data });
        } catch (error) {
            console.error('Failed to fetch todos:', error);
        }
    },
    addTodo: async (text, date) => {
        try {
            const res = await fetch(`${API_URL}/todos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, date }),
            });
            const newTodo = await res.json();
            set((state) => ({ todos: [...state.todos, newTodo] }));
        } catch (error) {
            console.error('Failed to add todo:', error);
        }
    },
    toggleTodo: async (id, completed) => {
        try {
            // Optimistic update
            set((state) => ({
                todos: state.todos.map((t) => (t.id === id ? { ...t, completed } : t)),
            }));
            await fetch(`${API_URL}/todos/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ completed }),
            });
        } catch (error) {
            console.error('Failed to toggle todo:', error);
            get().fetchTodos(); // Revert on error
        }
    },
    deleteTodo: async (id) => {
        try {
            set((state) => ({
                todos: state.todos.filter((t) => t.id !== id),
            }));
            await fetch(`${API_URL}/todos/${id}`, {
                method: 'DELETE',
            });
        } catch (error) {
            console.error('Failed to delete todo:', error);
            get().fetchTodos();
        }
    },
    updateTodo: async (id, text) => {
        try {
            set((state) => ({
                todos: state.todos.map((t) => (t.id === id ? { ...t, text } : t)),
            }));
            await fetch(`${API_URL}/todos/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text }),
            });
        } catch (error) {
            console.error('Failed to update todo:', error);
            get().fetchTodos();
        }
    },
    reorderTodos: async (newOrder) => {
        try {
            set({ todos: newOrder });
            await fetch(`${API_URL}/todos/reorder`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ todos: newOrder }),
            });
        } catch (error) {
            console.error('Failed to reorder todos:', error);
            get().fetchTodos();
        }
    },
    addSubtask: async (todoId, text) => {
        try {
            const res = await fetch(`${API_URL}/todos/${todoId}/subtasks`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text }),
            });
            const newSubtask = await res.json();
            set((state) => ({
                todos: state.todos.map((t) =>
                    t.id === todoId ? { ...t, subtasks: [...t.subtasks, newSubtask] } : t
                ),
            }));
        } catch (error) {
            console.error('Failed to add subtask:', error);
        }
    },
    toggleSubtask: async (todoId, subtaskId, completed) => {
        try {
            set((state) => ({
                todos: state.todos.map((t) =>
                    t.id === todoId
                        ? {
                            ...t,
                            subtasks: t.subtasks.map((s) =>
                                s.id === subtaskId ? { ...s, completed } : s
                            ),
                        }
                        : t
                ),
            }));
            await fetch(`${API_URL}/subtasks/${subtaskId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ completed }),
            });
        } catch (error) {
            console.error('Failed to toggle subtask:', error);
            get().fetchTodos();
        }
    },
    deleteSubtask: async (todoId, subtaskId) => {
        try {
            set((state) => ({
                todos: state.todos.map((t) =>
                    t.id === todoId
                        ? {
                            ...t,
                            subtasks: t.subtasks.filter((s) => s.id !== subtaskId),
                        }
                        : t
                ),
            }));
            await fetch(`${API_URL}/subtasks/${subtaskId}`, {
                method: 'DELETE',
            });
        } catch (error) {
            console.error('Failed to delete subtask:', error);
            get().fetchTodos();
        }
    },
}));
