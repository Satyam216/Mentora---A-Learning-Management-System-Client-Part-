'use client';
import AuthCard from '@/components/AuthCard';

export default function SignupPage() {
  return (
    <div className="max-w-6xl mx-auto py-12">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div><img src="/assets/auth-illus-2.jpg" className="rounded-xl" /></div>
        <div>
          <h2 className="text-2xl font-bold mb-3">Create your account</h2>
          <AuthCard mode="signup" />
        </div>
      </div>
    </div>
  );
}
