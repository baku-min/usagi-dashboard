'use client';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { useTasks, useCreateTask, useUpdateTask } from '@/hooks/useTasks';
import SummaryCards from '@/components/SummaryCards';
import TaskTable    from '@/components/TaskTable';
import TaskModal    from '@/components/TaskModal';
import type { Task, TaskStatus } from '@/types';

type Filter = 'all' | TaskStatus;

export default function DashboardPage() {
  const router       = useRouter();
  const { user, logout } = useAuthStore();
  const { data: tasks = [], isLoading } = useTasks();
  const createTask   = useCreateTask();
  const updateTask   = useUpdateTask();

  const [filter,     setFilter]     = useState<Filter>('all');
  const [modalOpen,  setModalOpen]  = useState(false);
  const [editTarget, setEditTarget] = useState<Task | null>(null);

  const isManager = user?.role === 'manager';

  const filtered = useMemo(
    () => filter === 'all' ? tasks : tasks.filter(t => t.status === filter),
    [tasks, filter]
  );

  if (!user) {
    router.push('/login');
    return null;
  }

  function openAdd() { setEditTarget(null); setModalOpen(true); }
  function openEdit(t: Task) { setEditTarget(t); setModalOpen(true); }

  async function handleSave(data: Partial<Task>) {
    if (editTarget) {
      await updateTask.mutateAsync({ id: editTarget._id, ...data });
    } else {
      await createTask.mutateAsync({
        ...data,
        userId: user!._id,
      } as Omit<Task, '_id' | 'createdAt'>);
    }
    setModalOpen(false);
  }

  async function handleLogout() {
    await logout();
    router.push('/login');
  }

  const FILTERS: { value: Filter; label: string }[] = [
    { value: 'all',   label: '전체' },
    { value: 'inprog',label: '진행 중' },
    { value: 'delay', label: '지연' },
    { value: 'done',  label: '완료' },
    { value: 'todo',  label: '대기' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">📦</span>
            <span className="font-bold text-gray-800">팀 업무 현황</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400">{new Date().toLocaleDateString('ko-KR', { year:'numeric', month:'long', day:'numeric' })}</span>
            <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
              {user.role === 'manager' ? '팀장' : '직원'} {user.displayName}
            </span>
            <button
              onClick={handleLogout}
              className="text-xs border border-gray-200 px-3 py-1.5 rounded-lg text-gray-500 hover:border-red-300 hover:text-red-500 transition-colors"
            >로그아웃</button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-7">
        {isLoading ? (
          <div className="flex items-center justify-center h-40 text-gray-400 text-sm">불러오는 중...</div>
        ) : (
          <>
            <SummaryCards tasks={tasks} />

            {/* Toolbar */}
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className="font-bold text-gray-800 flex-1">업무 목록</span>
              <div className="flex gap-1.5">
                {FILTERS.map(f => (
                  <button
                    key={f.value}
                    onClick={() => setFilter(f.value)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                      filter === f.value
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                    }`}
                  >{f.label}</button>
                ))}
              </div>
              {isManager && (
                <button
                  onClick={openAdd}
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700"
                >＋ 업무 추가</button>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <TaskTable
                tasks={filtered}
                isManager={isManager}
                currentUserId={user._id}
                onEdit={openEdit}
              />
            </div>
          </>
        )}
      </main>

      <TaskModal
        open={modalOpen}
        task={editTarget}
        isManager={isManager}
        currentUserName={user.displayName}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
