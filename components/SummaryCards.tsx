'use client';
import type { Task } from '@/types';

interface Props { tasks: Task[] }

export default function SummaryCards({ tasks }: Props) {
  const total  = tasks.length;
  const done   = tasks.filter(t => t.status === 'done').length;
  const inprog = tasks.filter(t => t.status === 'inprog').length;
  const delay  = tasks.filter(t => t.status === 'delay').length;

  const cards = [
    { label: '전체 업무', value: total,  sub: '등록된 업무', color: '#2563EB', border: '#2563EB' },
    { label: '완료',     value: done,   sub: '처리 완료',   color: '#16A34A', border: '#16A34A' },
    { label: '진행 중',  value: inprog, sub: '현재 작업 중', color: '#D97706', border: '#D97706' },
    { label: '지연',     value: delay,  sub: '마감 초과',   color: '#DC2626', border: '#DC2626' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-7">
      {cards.map((c) => (
        <div
          key={c.label}
          className="bg-white rounded-xl p-5 shadow-sm"
          style={{ borderLeft: `4px solid ${c.border}` }}
        >
          <p className="text-xs font-bold tracking-wider text-gray-400 uppercase mb-1">{c.label}</p>
          <p className="text-4xl font-bold leading-none mb-1" style={{ color: c.color }}>{c.value}</p>
          <p className="text-xs text-gray-400">{c.sub}</p>
        </div>
      ))}
    </div>
  );
}
