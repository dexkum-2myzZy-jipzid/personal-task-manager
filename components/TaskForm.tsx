import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { TaskStatus } from '../types/task';

export type TaskFormState = {
  title: string;
  description: string;
  status: TaskStatus;
};

const statusOptions: TaskStatus[] = ['pending', 'completed'];

type TaskFormProps = {
  onSubmit: (values: TaskFormState) => void;
  initialValues?: TaskFormState;
  submitLabel?: string;
};

const getInitialValues = (initialValues?: TaskFormState): TaskFormState => {
  return (
    initialValues ?? {
      title: '',
      description: '',
      status: 'pending',
    }
  );
};

export function TaskForm({
  onSubmit,
  initialValues,
  submitLabel = 'Create Task',
}: TaskFormProps) {
  const [formState, setFormState] = useState<TaskFormState>(() =>
    getInitialValues(initialValues),
  );
  const isTitleValid = formState.title.trim().length > 0;

  const setStatus = (status: TaskStatus) => {
    setFormState((prev) => ({ ...prev, status }));
  };

  const handleSubmit = () => {
    if (!isTitleValid) {
      return;
    }

    onSubmit(formState);
  };

  return (
    <View style={styles.container}>
      <View style={styles.field}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          value={formState.title}
          onChangeText={(title) => setFormState((prev) => ({ ...prev, title }))}
          placeholder="Enter task title"
          style={styles.input}
          autoCapitalize="sentences"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          value={formState.description}
          onChangeText={(description) =>
            setFormState((prev) => ({ ...prev, description }))
          }
          placeholder="Optional details"
          style={[styles.input, styles.textArea]}
          multiline
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Status</Text>
        <View style={styles.statusRow}>
          {statusOptions.map((option) => {
            const isActive = formState.status === option;
            return (
              <Pressable
                key={option}
                onPress={() => setStatus(option)}
                style={[styles.statusPill, isActive && styles.statusPillActive]}
              >
                <Text
                  style={[
                    styles.statusText,
                    isActive && styles.statusTextActive,
                  ]}
                >
                  {option}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <Pressable
        style={[styles.submitButton, isTitleValid && styles.submitButtonActive]}
        onPress={handleSubmit}
        disabled={!isTitleValid}
      >
        <Text style={[styles.submitText, isTitleValid && styles.submitTextActive]}>
          {submitLabel}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  field: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: '#FFFFFF',
    color: '#111827',
  },
  textArea: {
    minHeight: 96,
    textAlignVertical: 'top',
  },
  statusRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statusPill: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  statusPillActive: {
    borderColor: '#2563EB',
    backgroundColor: '#DBEAFE',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
  },
  statusTextActive: {
    color: '#1D4ED8',
  },
  submitButton: {
    marginTop: 8,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#E5E7EB',
  },
  submitButtonActive: {
    backgroundColor: '#2563EB',
  },
  submitText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  submitTextActive: {
    color: '#FFFFFF',
  },
});
