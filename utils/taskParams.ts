import { Task, TaskStatus } from '../types/task';

const isTaskStatus = (value: unknown): value is TaskStatus => {
  return value === 'pending' || value === 'completed';
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

const isTask = (value: unknown): value is Task => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === 'string' &&
    typeof value.title === 'string' &&
    typeof value.description === 'string' &&
    isTaskStatus(value.status) &&
    typeof value.createdAt === 'number' &&
    Number.isFinite(value.createdAt) &&
    typeof value.updatedAt === 'number' &&
    Number.isFinite(value.updatedAt)
  );
};

export const parseTaskFromParam = (
  value: string | string[] | undefined,
): Task | null => {
  if (!value) {
    return null;
  }

  const rawTask = Array.isArray(value) ? value[0] : value;

  try {
    const parsed: unknown = JSON.parse(rawTask);
    return isTask(parsed) ? parsed : null;
  } catch {
    return null;
  }
};
