import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { TaskList } from '../components/TaskList';
import { mockTasks } from '../features/tasks/mockTasks';
import { Task, TaskStatus } from '../types/task';

type LocalSearchParams = {
  newTask?: string | string[];
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

export default function HomeScreen() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const { newTask } = useLocalSearchParams<LocalSearchParams>();
  const router = useRouter();

  useEffect(() => {
    if (!newTask) {
      return;
    }

    const rawTask = Array.isArray(newTask) ? newTask[0] : newTask;

    let parsed: unknown;

    try {
      parsed = JSON.parse(rawTask);
    } catch {
      router.setParams({ newTask: undefined });
      return;
    }

    if (!isTask(parsed)) {
      router.setParams({ newTask: undefined });
      return;
    }

    setTasks((prev) => {
      const exists = prev.some((task) => task.id === parsed.id);
      return exists ? prev : [parsed, ...prev];
    });

    router.setParams({ newTask: undefined });
  }, [newTask, router]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Tasks</Text>
        <Link href="/new-task" style={styles.addLink}>
          Add
        </Link>
      </View>
      <TaskList tasks={tasks} />
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
