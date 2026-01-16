import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { TaskForm } from '../components/TaskForm';
import { Task } from '../types/task';
import { useRouter } from 'expo-router';

export default function NewTaskScreen() {
  const router = useRouter();

  const handleSubmit = (values: {
    title: string;
    description: string;
    status: Task['status'];
  }) => {
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
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>New Task</Text>
      <View style={styles.formContainer}>
        <TaskForm onSubmit={handleSubmit} />
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
});
