export default interface Task {
  id: string;
  summary: string;
  details?: string | null;
  completed: boolean;
  userId: string;
}

export type createTaskInput = Omit<Task, "id">;
export type TaskParams = { id: string };
