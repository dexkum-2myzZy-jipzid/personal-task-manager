import {
  FlatList,
  ListRenderItem,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Task } from '../types/task';

type TaskListProps = {
  tasks: Task[];
  onTaskPress?: (task: Task) => void;
};

const renderTaskItem =
  (onTaskPress?: (task: Task) => void): ListRenderItem<Task> =>
  ({ item }) => {
    const content = (
      <>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.status}>{item.status}</Text>
        {item.description.length > 0 ? (
          <Text style={styles.description}>{item.description}</Text>
        ) : null}
      </>
    );

    if (!onTaskPress) {
      return <View style={styles.card}>{content}</View>;
    }

    return (
      <Pressable style={styles.card} onPress={() => onTaskPress(item)}>
        {content}
      </Pressable>
    );
  };

export function TaskList({ tasks, onTaskPress }: TaskListProps) {
  return (
    <FlatList
      data={tasks}
      keyExtractor={(item) => item.id}
      renderItem={renderTaskItem(onTaskPress)}
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
