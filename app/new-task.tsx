import { StyleSheet, Text, View } from 'react-native';

import { useRouter } from 'expo-router';
import { TaskForm, TaskFormState } from '../components/TaskForm';
import { Task } from '../types/task';

export default function NewTaskScreen() {
  const router = useRouter();

  const handleSubmit = (values: TaskFormState) => {
    const timestamp = Date.now();
    const newTask: Task = {
      id: `${timestamp}`,
      title: values.title.trim(),
      description: values.description.trim(),
      status: values.status,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    router.replace({
      pathname: '/',
      params: {
        newTask: JSON.stringify(newTask),
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>New Task</Text>
      <View style={styles.formContainer}>
        <TaskForm onSubmit={handleSubmit} />
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
});
