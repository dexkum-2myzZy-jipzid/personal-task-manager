import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: true }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="new-task"
          options={{
            title: 'New Task',
            headerBackTitle: '',
            headerBackTitleVisible: false,
            headerBackButtonDisplayMode: 'minimal',
          }}
        />
        <Stack.Screen
          name="edit-task/[taskId]"
          options={{
            title: 'Edit Task',
            headerBackTitle: '',
            headerBackTitleVisible: false,
            headerBackButtonDisplayMode: 'minimal',
          }}
        />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
