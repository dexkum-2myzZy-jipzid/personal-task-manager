import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { TaskForm, TaskFormState } from '../../components/TaskForm';
import { Task, TaskStatus } from '../../types/task';

type EditTaskParams = {
  taskId?: string | string[];
  task?: string | string[];
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

export default function EditTaskScreen() {
  const { taskId, task } = useLocalSearchParams<EditTaskParams>();
  const router = useRouter();

  const resolvedTaskId = Array.isArray(taskId) ? taskId[0] : taskId;
  const parsedTask = parseTaskFromParam(task);
  const taskToEdit =
    resolvedTaskId && parsedTask && parsedTask.id === resolvedTaskId
      ? parsedTask
      : null;

  const handleSubmit = (values: TaskFormState) => {
    if (!taskToEdit) {
      return;
    }

    const timestamp = Date.now();
    const updatedTask: Task = {
      ...taskToEdit,
      title: values.title.trim(),
      description: values.description.trim(),
      status: values.status,
      updatedAt: timestamp,
    };

    router.replace({
      pathname: '/',
      params: {
        updatedTask: JSON.stringify(updatedTask),
      },
    });
  };

  if (!taskToEdit) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>Edit Task</Text>
        <View style={styles.formContainer}>
          <Text style={styles.helperText}>Task not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const initialValues: TaskFormState = {
    title: taskToEdit.title,
    description: taskToEdit.description,
    status: taskToEdit.status,
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Edit Task</Text>
      <View style={styles.formContainer}>
        <TaskForm
          initialValues={initialValues}
          submitLabel="Save Task"
          onSubmit={handleSubmit}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    paddingHorizontal: 20,
    color: '#111827',
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  helperText: {
    fontSize: 14,
    color: '#6B7280',
  },
});
