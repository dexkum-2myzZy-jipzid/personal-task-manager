import { FlatList, ListRenderItem, StyleSheet, Text, View } from 'react-native';

import { Task } from '../types/task';

const renderTaskItem: ListRenderItem<Task> = ({ item }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.status}>{item.status}</Text>
      {item.description.length > 0 ? (
        <Text style={styles.description}>{item.description}</Text>
      ) : null}
    </View>
  );
};

type TaskListProps = {
  tasks: Task[];
};

export function TaskList({ tasks }: TaskListProps) {
  return (
    <FlatList
      data={tasks}
      keyExtractor={(item) => item.id}
      renderItem={renderTaskItem}
      contentContainerStyle={styles.listContent}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  status: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
    color: '#6B7280',
  },
  description: {
    marginTop: 8,
    fontSize: 14,
    color: '#4B5563',
  },
});
