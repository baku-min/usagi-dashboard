'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { bkend } from '@/lib/bkend';
import { useAuthStore } from '@/stores/auth-store';

export default function RegisterPage() {
  const [displayName, setDisplayName] = useState('');
  const [email,       setEmail]       = useState('');
  const [password,    setPassword]    = useState('');
  const [role,        setRole]        = useState<'manager' | 'employee'>('employee');
  const [error,       setError]       = useState('');
  const [loading,     setLoading]     = useState(false);
  const { login }  = useAuthStore();
  const router     = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await bkend.auth.signup({ email, password, displayName, role });
      await login(email, password);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : '회원가입에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-sky-50">
      <div className="bg-white rounded-2xl shadow-lg p-12 w-[380px]">
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">📦</div>
          <h1 className="text-xl font-bold text-gray-800">계정 생성</h1>
          <p className="text-xs text-gray-400 mt-1">팀원 초대 또는 첫 팀장 계정 생성</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">이름</label>
            <input
              required value={displayName} onChange={e => setDisplayName(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500"
              placeholder="홍길동"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">이메일</label>
            <input
              type="email" required value={email} onChange={e => setEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500"
              placeholder="example@company.com"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">비밀번호</label>
            <input
              type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500"
              placeholder="6자 이상"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">역할</label>
            <select
              value={role} onChange={e => setRole(e.target.value as 'manager' | 'employee')}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="manager">팀장 (전체 조회·관리)</option>
              <option value="employee">직원 (본인 업무만 수정)</option>
            </select>
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <button
            type="submit" disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-sm hover:bg-blue-700 disabled:opacity-60 mt-2"
          >
            {loading ? '처리 중...' : '계정 만들기'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          이미 계정이 있나요?{' '}
          <Link href="/login" className="text-blue-600 font-semibold hover:underline">로그인</Link>
        </p>
      </div>
    </div>
  );
}
