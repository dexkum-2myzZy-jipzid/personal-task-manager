import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { TaskForm, TaskFormState } from '../../components/TaskForm';
import { Task } from '../../types/task';
import { parseTaskFromParam } from '../../utils/taskParams';

type EditTaskParams = {
  taskId?: string | string[];
  task?: string | string[];
};

const resolveFirstParam = (
  value: string | string[] | undefined,
): string | undefined => {
  return Array.isArray(value) ? value[0] : value;
};

const resolveTaskToEdit = (params: EditTaskParams): Task | null => {
  const resolvedTaskId = resolveFirstParam(params.taskId);
  const parsedTask = parseTaskFromParam(params.task);

  if (!resolvedTaskId || !parsedTask) {
    return null;
  }

  return parsedTask.id === resolvedTaskId ? parsedTask : null;
};

export default function EditTaskScreen() {
  const params = useLocalSearchParams<EditTaskParams>();
  const router = useRouter();

  const taskToEdit = resolveTaskToEdit(params);

  const buildUpdatedTask = (
    task: Task,
    values: TaskFormState,
  ): Task => {
    const timestamp = Date.now();

    return {
      ...task,
      title: values.title.trim(),
      description: values.description.trim(),
      status: values.status,
      updatedAt: timestamp,
    };
  };

  const handleSubmit = (values: TaskFormState) => {
    if (!taskToEdit) {
      return;
    }

    const updatedTask = buildUpdatedTask(taskToEdit, values);

    router.dismissTo({
      pathname: '/',
      params: {
        updatedTask: JSON.stringify(updatedTask),
      },
    });
  };

  if (!taskToEdit) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Edit Task</Text>
        <View style={styles.formContainer}>
          <Text style={styles.helperText}>Task not found.</Text>
        </View>
      </View>
    );
  }

  const initialValues: TaskFormState = {
    title: taskToEdit.title,
    description: taskToEdit.description,
    status: taskToEdit.status,
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Edit Task</Text>
      <View style={styles.formContainer}>
        <TaskForm
          initialValues={initialValues}
          submitLabel="Save Task"
          onSubmit={handleSubmit}
        />
      </View>
    </View>
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
    marginVertical: 12,
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
