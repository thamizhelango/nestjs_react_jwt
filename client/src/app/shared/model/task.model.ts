export interface ITask {
  id?: number;
  title?: string | null;
  description?: string | null;
}

export const defaultValue: Readonly<ITask> = {};
