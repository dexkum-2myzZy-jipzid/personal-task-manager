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
  onToggleStatus?: (taskId: string) => void;
  emptyMessage?: string;
};

const ACTION_WIDTH = 72;

type TaskListItemProps = {
  task: Task;
  onTaskPress?: (task: Task) => void;
  onDeleteTask?: (task: Task) => void;
  onToggleStatus?: (taskId: string) => void;
};

const TaskListItem = ({
  task,
  onTaskPress,
  onDeleteTask,
  onToggleStatus,
}: TaskListItemProps) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const [isOpen, setIsOpen] = useState(false);
  const isCompleted = task.status === 'completed';

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

  const handleToggleStatus = () => {
    onToggleStatus?.(task.id);
  };

  const statusControl = onToggleStatus ? (
    <Pressable
      onPress={handleToggleStatus}
      style={[
        styles.statusToggle,
        isCompleted && styles.statusToggleCompleted,
      ]}
    >
      <Text
        style={[
          styles.statusToggleText,
          isCompleted && styles.statusToggleTextCompleted,
        ]}
      >
        {isCompleted ? 'Completed' : 'Pending'}
      </Text>
    </Pressable>
  ) : (
    <View
      style={[
        styles.statusToggle,
        isCompleted && styles.statusToggleCompleted,
      ]}
    >
      <Text
        style={[
          styles.statusToggleText,
          isCompleted && styles.statusToggleTextCompleted,
        ]}
      >
        {isCompleted ? 'Completed' : 'Pending'}
      </Text>
    </View>
  );

  const content = (
    <>
      <View style={styles.headerRow}>
        <Text style={[styles.title, isCompleted && styles.titleCompleted]}>
          {task.title}
        </Text>
        {statusControl}
      </View>
      {task.description.length > 0 ? (
        <Text style={styles.description}>{task.description}</Text>
      ) : null}
    </>
  );

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
        {onTaskPress ? (
          <Pressable onPress={handlePress}>{content}</Pressable>
        ) : (
          <View>{content}</View>
        )}
      </Animated.View>
    </View>
  );
};

const renderTaskItem = (
  onTaskPress?: (task: Task) => void,
  onDeleteTask?: (task: Task) => void,
  onToggleStatus?: (taskId: string) => void,
): ListRenderItem<Task> => {
  function RenderTaskItem({ item }: { item: Task }) {
    return (
      <TaskListItem
        task={item}
        onTaskPress={onTaskPress}
        onDeleteTask={onDeleteTask}
        onToggleStatus={onToggleStatus}
      />
    );
  }

  return RenderTaskItem;
};

export function TaskList({
  tasks,
  onTaskPress,
  onDeleteTask,
  onToggleStatus,
  emptyMessage,
}: TaskListProps) {
  return (
    <FlatList
      data={tasks}
      keyExtractor={(item) => item.id}
      renderItem={renderTaskItem(onTaskPress, onDeleteTask, onToggleStatus)}
      contentContainerStyle={styles.listContent}
      ListEmptyComponent={
        emptyMessage ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>{emptyMessage}</Text>
          </View>
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6B7280',
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
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
  titleCompleted: {
    color: '#6B7280',
    textDecorationLine: 'line-through',
  },
  statusToggle: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#CBD5F5',
    backgroundColor: '#EFF6FF',
  },
  statusToggleCompleted: {
    borderColor: '#86EFAC',
    backgroundColor: '#DCFCE7',
  },
  statusToggleText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    color: '#1D4ED8',
  },
  statusToggleTextCompleted: {
    color: '#166534',
  },
  description: {
    marginTop: 8,
    fontSize: 14,
    color: '#4B5563',
  },
});
