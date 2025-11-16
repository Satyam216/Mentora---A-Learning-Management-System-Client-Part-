// src/app/auth/signup/page.js
'use client';
import AuthCard from '@/components/AuthCard';
import { useState } from 'react';

export default function SignupPage() {
  const [role, setRole] = useState('student');

  return (
    <div className="max-w-6xl mx-auto py-12">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div><img src="/assets/signup.png" className="rounded-xl" alt="signup" /></div>
        <div>
          <h2 className="text-2xl font-bold mb-3">Create your account</h2>
          <AuthCard mode="signup" fixedRole={role} />
        </div>
      </div>
    </div>
  );
}
