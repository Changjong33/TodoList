export interface Subtask {
    id: string;
    text: string;
    completed: boolean;
}

export interface Todo {
    id: string;
    text: string;
    completed: boolean;
    date: string; // ISO date string YYYY-MM-DD
    subtasks: Subtask[];
    order: number; // For drag and drop
}
