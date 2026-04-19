export interface Task {
  id: string;
  summary: string;
  details?: string | null;
  completed: boolean;
  userId: string;
}

export type CreateTaskInput = Omit<Task, "id">;
export type QueryParams = { id: string };
