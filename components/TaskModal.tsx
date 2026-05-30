'use client';
import { useEffect, useState } from 'react';
import type { Task, TaskStatus } from '@/types';

interface Props {
  open: boolean;
  task: Task | null;
  isManager: boolean;
  currentUserName: string;
  onClose: () => void;
  onSave: (data: Partial<Task>) => void;
}

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: 'todo',   label: '대기' },
  { value: 'inprog', label: '진행 중' },
  { value: 'done',   label: '완료' },
  { value: 'delay',  label: '지연' },
];

export default function TaskModal({ open, task, isManager, currentUserName, onClose, onSave }: Props) {
  const [person,   setPerson]   = useState('');
  const [taskName, setTaskName] = useState('');
  const [progress, setProgress] = useState(0);
  const [status,   setStatus]   = useState<TaskStatus>('todo');
  const [deadline, setDeadline] = useState('');
  const [note,     setNote]     = useState('');

  useEffect(() => {
    if (task) {
      setPerson(task.person);
      setTaskName(task.taskName);
      setProgress(task.progress);
      setStatus(task.status);
      setDeadline(task.deadline ?? '');
      setNote(task.note ?? '');
    } else {
      setPerson(currentUserName);
      setTaskName(''); setProgress(0); setStatus('todo'); setDeadline(''); setNote('');
    }
  }, [task, currentUserName, open]);

  if (!open) return null;

  function handleSave() {
    if (!taskName.trim()) { alert('업무명을 입력해 주세요.'); return; }
    onSave({ person, taskName, progress, status, deadline, note });
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-[420px] max-w-[95vw] p-8">
        <h2 className="text-lg font-bold mb-6">{task ? '업무 수정' : '업무 추가'}</h2>

        <label className="block text-xs font-semibold text-gray-500 mb-1">담당자</label>
        <input
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:border-blue-500"
          value={person}
          onChange={e => setPerson(e.target.value)}
          disabled={!isManager}
        />

        <label className="block text-xs font-semibold text-gray-500 mb-1">업무명</label>
        <input
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:border-blue-500"
          value={taskName}
          onChange={e => setTaskName(e.target.value)}
          placeholder="예) A사 박스 디자인 수정"
        />

        <label className="block text-xs font-semibold text-gray-500 mb-1">진행률 (%)</label>
        <input
          type="number" min={0} max={100}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:border-blue-500"
          value={progress}
          onChange={e => setProgress(Number(e.target.value))}
        />

        <label className="block text-xs font-semibold text-gray-500 mb-1">상태</label>
        <select
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:border-blue-500"
          value={status}
          onChange={e => setStatus(e.target.value as TaskStatus)}
        >
          {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        <label className="block text-xs font-semibold text-gray-500 mb-1">마감일</label>
        <input
          type="date"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:border-blue-500"
          value={deadline}
          onChange={e => setDeadline(e.target.value)}
        />

        <label className="block text-xs font-semibold text-gray-500 mb-1">비고</label>
        <input
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-6 focus:outline-none focus:border-blue-500"
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="추가 메모 (선택)"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:border-gray-400"
          >취소</button>
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700"
          >저장</button>
        </div>
      </div>
    </div>
  );
}
