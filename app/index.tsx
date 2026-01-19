import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
  const [searchQuery, setSearchQuery] = useState('');
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
      pathname: '/edit-task/[taskId]',
      params: {
        taskId: task.id,
        task: JSON.stringify(task),
      },
    });
  };

  const handleDeleteTask = (task: Task) => {
    setTasks((prev) => prev.filter((item) => item.id !== task.id));
  };

  const handleToggleStatus = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== taskId) {
          return task;
        }

        const nextStatus = task.status === 'pending' ? 'completed' : 'pending';
        return {
          ...task,
          status: nextStatus,
          updatedAt: Date.now(),
        };
      }),
    );
  };

  const filteredTasks = useMemo(() => {
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery.length === 0) {
      return tasks;
    }

    const normalizedQuery = trimmedQuery.toLowerCase();
    return tasks.filter((task) =>
      task.title.toLowerCase().includes(normalizedQuery),
    );
  }, [searchQuery, tasks]);

  const orderedTasks = useMemo(() => {
    return filteredTasks
      .map((task, index) => ({ task, index }))
      .sort((a, b) => {
        if (a.task.status === b.task.status) {
          return a.index - b.index;
        }

        return a.task.status === 'pending' ? -1 : 1;
      })
      .map((item) => item.task);
  }, [filteredTasks]);

  const emptyMessage =
    searchQuery.trim().length > 0
      ? 'No tasks match your search.'
      : 'No tasks yet.';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Tasks</Text>
        <Link href="/new-task" style={styles.addLink}>
          Add
        </Link>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search tasks"
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.searchInput}
        />
      </View>
      <TaskList
        tasks={orderedTasks}
        onTaskPress={handleTaskPress}
        onDeleteTask={handleDeleteTask}
        onToggleStatus={handleToggleStatus}
        emptyMessage={emptyMessage}
      />
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
    paddingTop: 12,
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
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
  },
});
