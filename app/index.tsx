import { SafeAreaView, StyleSheet, Text } from 'react-native';

import { TaskList } from '../components/TaskList';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Tasks</Text>
      <TaskList />
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
});
