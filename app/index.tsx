import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { TaskList } from '../components/TaskList';
import { mockTasks } from '../features/tasks/mockTasks';
import { Task, TaskStatus } from '../types/task';

type LocalSearchParams = {
  newTask?: string | string[];
  updatedTask?: string | string[];
};

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

const parseTaskFromParam = (
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

export default function HomeScreen() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const { newTask, updatedTask } = useLocalSearchParams<LocalSearchParams>();
  const router = useRouter();

  useEffect(() => {
    if (newTask) {
      const parsed = parseTaskFromParam(newTask);

      if (!parsed) {
        router.setParams({ newTask: undefined });
        return;
      }

      setTasks((prev) => {
        const exists = prev.some((task) => task.id === parsed.id);
        return exists ? prev : [parsed, ...prev];
      });

      router.setParams({ newTask: undefined });
    }

    if (updatedTask) {
      const parsed = parseTaskFromParam(updatedTask);

      if (!parsed) {
        router.setParams({ updatedTask: undefined });
        return;
      }

      setTasks((prev) => {
        const hasMatch = prev.some((task) => task.id === parsed.id);
        if (!hasMatch) {
          return prev;
        }

        return prev.map((task) => (task.id === parsed.id ? parsed : task));
      });

      router.setParams({ updatedTask: undefined });
    }
  }, [newTask, updatedTask, router]);

  const handleTaskPress = (task: Task) => {
    router.push({
      pathname: `/edit-task/${task.id}`,
      params: {
        task: JSON.stringify(task),
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Tasks</Text>
        <Link href="/new-task" style={styles.addLink}>
          Add
        </Link>
      </View>
      <TaskList tasks={tasks} onTaskPress={handleTaskPress} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  addLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563EB',
  },
});
