import { Task } from '../../types/task';

export const mockTasks: Task[] = [
  {
    id: 'task-001',
    title: 'Review weekly goals',
    description: 'Align on top priorities for the week.',
    status: 'pending',
    createdAt: 1720000000000,
    updatedAt: 1720000000000,
  },
  {
    id: 'task-002',
    title: 'Write project brief',
    description: 'Outline scope, timeline, and risks.',
    status: 'completed',
    createdAt: 1720003600000,
    updatedAt: 1720007200000,
  },
  {
    id: 'task-003',
    title: 'Schedule stakeholder sync',
    description: 'Confirm attendees and time options.',
    status: 'pending',
    createdAt: 1720010800000,
    updatedAt: 1720010800000,
  },
  {
    id: 'task-004',
    title: 'Organize research notes',
    description: 'Tag findings for quick retrieval.',
    status: 'completed',
    createdAt: 1720014400000,
    updatedAt: 1720018000000,
  },
  {
    id: 'task-005',
    title: 'Prepare demo script',
    description: 'Focus on the top three outcomes.',
    status: 'pending',
    createdAt: 1720021600000,
    updatedAt: 1720021600000,
  },
  {
    id: 'task-006',
    title: 'Send follow-up notes',
    description: 'Recap decisions and next steps.',
    status: 'completed',
    createdAt: 1720025200000,
    updatedAt: 1720028800000,
  },
];
