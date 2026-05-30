'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bkend } from '@/lib/bkend';
import { useAuthStore } from '@/stores/auth-store';
import type { Task } from '@/types';

export function useTasks() {
  const user = useAuthStore((s) => s.user);
  const isManager = user?.role === 'manager';

  return useQuery({
    queryKey: ['tasks', user?._id, isManager],
    queryFn: async () => {
      const params = isManager ? undefined : { filter: JSON.stringify({ userId: user!._id }) };
      const res = await bkend.data.list<Task>('tasks', params as Record<string, string> | undefined);
      return res.data;
    },
    enabled: !!user,
  });
}

export function useCreateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Omit<Task, '_id' | 'createdAt'>) =>
      bkend.data.create<Task>('tasks', body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks'] }),
  });
}

export function useUpdateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: Partial<Task> & { id: string }) =>
      bkend.data.update<Task>('tasks', id, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks'] }),
  });
}

export function useDeleteTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => bkend.data.delete('tasks', id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks'] }),
  });
}
