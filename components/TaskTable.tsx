'use client';
import type { Task, TaskStatus } from '@/types';

const STATUS_META: Record<TaskStatus, { label: string; bg: string; text: string; fill: string }> = {
  todo:   { label: '대기',    bg: 'bg-gray-100',   text: 'text-gray-600',  fill: 'bg-gray-400'  },
  inprog: { label: '진행 중', bg: 'bg-blue-50',    text: 'text-blue-600',  fill: 'bg-blue-500'  },
  done:   { label: '완료',    bg: 'bg-green-50',   text: 'text-green-600', fill: 'bg-green-500' },
  delay:  { label: '지연',    bg: 'bg-red-50',     text: 'text-red-600',   fill: 'bg-red-500'   },
};

const AVATAR_COLORS = ['#2563EB','#16A34A','#D97706','#7C3AED','#DB2777','#0891B2'];
const avatarColor = (name: string) => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
const todayISO = () => new Date().toISOString().slice(0, 10);

interface Props {
  tasks: Task[];
  isManager: boolean;
  currentUserId: string;
  onEdit: (task: Task) => void;
}

export default function TaskTable({ tasks, isManager, currentUserId, onEdit }: Props) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <div className="text-4xl mb-3">🔍</div>
        <p className="text-sm">해당하는 업무가 없습니다.</p>
      </div>
    );
  }

  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-gray-50">
          {['담당자','업무명','진행률','상태','마감일','비고',''].map(h => (
            <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-200">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {tasks.map(t => {
          const meta     = STATUS_META[t.status];
          const canEdit  = isManager || t.userId === currentUserId;
          const overdue  = t.deadline && t.deadline < todayISO() && t.status !== 'done';

          return (
            <tr key={t._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <span
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                    style={{ background: avatarColor(t.person) }}
                  >{t.person[0]}</span>
                  <span className="text-sm">{t.person}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-sm font-medium">{t.taskName}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2 min-w-[130px]">
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${meta.fill}`} style={{ width: `${t.progress}%` }} />
                  </div>
                  <span className="text-xs font-semibold text-gray-600 w-9 text-right">{t.progress}%</span>
                </div>
              </td>
              <td className="px-4 py-3">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${meta.bg} ${meta.text}`}>
                  {meta.label}
                </span>
              </td>
              <td className={`px-4 py-3 text-sm ${overdue ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
                {t.deadline ? t.deadline.slice(5).replace('-', '/') : '—'}
                {overdue && ' ⚠'}
              </td>
              <td className="px-4 py-3 text-xs text-gray-400 max-w-[160px] truncate">{t.note || '—'}</td>
              <td className="px-4 py-3">
                {canEdit && (
                  <button
                    onClick={() => onEdit(t)}
                    className="px-3 py-1 border border-gray-200 rounded-md text-xs text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
                  >수정</button>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
