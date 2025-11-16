// src/components/AuthCard.js
'use client';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
// If you put google.svg in /public/icons/, use <img src="/icons/google.svg" ... />

export default function AuthCard({ mode = 'login', fixedRole = null }) {
  const r = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState(fixedRole || 'student');
  const [loginAs, setLoginAs] = useState('student'); // login selector

  const doLogin = async (e) => {
    e?.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return alert(error.message);
    // redirect to dashboard (server will show role-aware content)
    r.push('/dashboard');
  };

  const doSignup = async (e) => {
    e?.preventDefault();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name, role } }
    });
    if (error) return alert(error.message);
    alert('Account created — check email (if enabled). Redirecting to dashboard...');
    r.push('/dashboard');
  };

  const signGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin + '/dashboard' }});
  };

  return (
    <div className="max-w-md mx-auto card">
      <form className="space-y-4" onSubmit={mode === 'login' ? doLogin : doSignup}>
        {mode === 'signup' && (
          <>
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" className="w-full border p-2 rounded" required />
            {/* Role select */}
            <div className="flex gap-3 items-center text-sm">
              <label className="flex items-center gap-2"><input type="radio" name="role" checked={role==='student'} onChange={()=>setRole('student')} /> Student</label>
              <label className="flex items-center gap-2"><input type="radio" name="role" checked={role==='instructor'} onChange={()=>setRole('instructor')} /> Instructor</label>
            </div>
          </>
        )}

        {mode === 'login' && (
          <div className="text-sm mb-2">
            <label className="mr-3"><input type="radio" name="loginAs" checked={loginAs==='student'} onChange={()=>setLoginAs('student')} /> Login as Student</label>
            <label className="ml-3"><input type="radio" name="loginAs" checked={loginAs==='instructor'} onChange={()=>setLoginAs('instructor')} /> Login as Instructor</label>
          </div>
        )}

        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" type="email" className="w-full border p-2 rounded" required />
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" className="w-full border p-2 rounded" required />
        <button className="w-full bg-slate-900 text-white p-2 rounded">{mode==='login' ? 'Login' : 'Create account'}</button>
      </form>

      <div className="mt-3 border-t pt-3">
        <button onClick={signGoogle} className="w-full px-3 py-2 rounded border flex items-center justify-center gap-2 bg-white">
          <img src="/icons/google.svg" alt="Google" className="w-5 h-5" />
          Continue with Google
        </button>
      </div>
    </div>
  );
}
