export default interface Task {
  id: number;
  summary: string;
  details?: string | null;
  completed: boolean;
}
