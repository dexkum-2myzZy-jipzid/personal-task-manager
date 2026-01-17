import { useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  ListRenderItem,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Task } from '../types/task';

type TaskListProps = {
  tasks: Task[];
  onTaskPress?: (task: Task) => void;
  onDeleteTask?: (task: Task) => void;
};

const ACTION_WIDTH = 72;

type TaskListItemProps = {
  task: Task;
  onTaskPress?: (task: Task) => void;
  onDeleteTask?: (task: Task) => void;
};

const TaskListItem = ({ task, onTaskPress, onDeleteTask }: TaskListItemProps) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const [isOpen, setIsOpen] = useState(false);

  const openActions = () => {
    Animated.timing(translateX, {
      toValue: -ACTION_WIDTH,
      duration: 150,
      useNativeDriver: true,
    }).start(() => setIsOpen(true));
  };

  const closeActions = () => {
    Animated.timing(translateX, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => setIsOpen(false));
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) =>
        Math.abs(gesture.dx) > 6 && Math.abs(gesture.dy) < 10,
      onPanResponderMove: (_, gesture) => {
        if (gesture.dx > 0) {
          translateX.setValue(0);
          return;
        }

        const clamped = Math.max(gesture.dx, -ACTION_WIDTH);
        translateX.setValue(clamped);
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx <= -ACTION_WIDTH / 2) {
          openActions();
        } else {
          closeActions();
        }
      },
      onPanResponderTerminate: () => {
        closeActions();
      },
    }),
  ).current;

  const handlePress = () => {
    if (isOpen) {
      closeActions();
      return;
    }

    onTaskPress?.(task);
  };

  const handleDelete = () => {
    onDeleteTask?.(task);
  };

  return (
    <View style={styles.swipeRow}>
      <View style={styles.deleteAction}>
        <Pressable onPress={handleDelete} style={styles.deleteButton}>
          <Text style={styles.deleteText}>Delete</Text>
        </Pressable>
      </View>
      <Animated.View
        style={[styles.card, { transform: [{ translateX }] }]}
        {...panResponder.panHandlers}
      >
        <Pressable onPress={handlePress}>
          <Text style={styles.title}>{task.title}</Text>
          <Text style={styles.status}>{task.status}</Text>
          {task.description.length > 0 ? (
            <Text style={styles.description}>{task.description}</Text>
          ) : null}
        </Pressable>
      </Animated.View>
    </View>
  );
};

const renderTaskItem =
  (
    onTaskPress?: (task: Task) => void,
    onDeleteTask?: (task: Task) => void,
  ): ListRenderItem<Task> =>
  ({ item }) => {
    return (
      <TaskListItem
        task={item}
        onTaskPress={onTaskPress}
        onDeleteTask={onDeleteTask}
      />
    );
  };

export function TaskList({ tasks, onTaskPress, onDeleteTask }: TaskListProps) {
  return (
    <FlatList
      data={tasks}
      keyExtractor={(item) => item.id}
      renderItem={renderTaskItem(onTaskPress, onDeleteTask)}
      contentContainerStyle={styles.listContent}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  swipeRow: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  card: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  deleteAction: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: ACTION_WIDTH,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  deleteButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  deleteText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B91C1C',
    textTransform: 'uppercase',
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
