'use client';
import AuthCard from '@/components/AuthCard';

export default function LoginPage() {
  return (
    <div className="max-w-6xl mx-auto py-12">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div><img src="/assets/hero.jpg" className="rounded-xl" /></div>
        <div>
          <h2 className="text-2xl font-bold mb-3">Welcome back</h2>
          <AuthCard mode="login" />
          <p className="mt-3 text-sm text-slate-500">Or sign in with Google</p>
        </div>
      </div>
    </div>
  );
}
