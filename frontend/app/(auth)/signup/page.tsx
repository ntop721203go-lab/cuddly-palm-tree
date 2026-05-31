"use client";
import { useActionState } from "react";
import Link from "next/link";
import { signup } from "@/lib/actions/auth";

export default function SignupPage() {
  const [state, action, pending] = useActionState(signup, null);

  return (
    <div className="w-full max-w-sm">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <div className="text-center mb-8">
          <span className="text-4xl">🤖</span>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">AI 비서</h1>
          <p className="text-sm text-gray-500 mt-1">새 계정을 만드세요</p>
        </div>

        <form action={action} className="space-y-4">
          {state?.error && (
            <p className="text-sm text-red-500 bg-red-50 rounded-lg px-4 py-2">
              {state.error}
            </p>
          )}

          {state === null || state?.error ? null : (
            <p className="text-sm text-green-600 bg-green-50 rounded-lg px-4 py-2">
              가입 완료! 이메일을 확인해주세요.
            </p>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이메일
            </label>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              비밀번호
            </label>
            <input
              name="password"
              type="password"
              required
              autoComplete="new-password"
              minLength={6}
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="최소 6자리"
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-xl py-2.5 text-sm font-medium transition-colors"
          >
            {pending ? "가입 중..." : "회원가입"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          이미 계정이 있으신가요?{" "}
          <Link href="/login" className="text-blue-500 hover:underline font-medium">
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}
