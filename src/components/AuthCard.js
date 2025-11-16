'use client';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Github, Google } from 'lucide-react';

export default function AuthCard({ mode = 'login' }) {
  const r = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const doLogin = async (e) => {
    e?.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return alert(error.message);
    r.push('/dashboard/student');
  };

  const doSignup = async (e) => {
    e?.preventDefault();
    const { error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } });
    if (error) return alert(error.message);
    alert('Check your email to confirm (if enabled).');
    r.push('/auth/login');
  };

  const signGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin }});
  };

  return (
    <div className="max-w-md mx-auto card">
      <form className="space-y-4" onSubmit={mode==='login' ? doLogin : doSignup}>
        {mode === 'signup' && <input value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" className="w-full border p-2 rounded" required />}
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" type="email" className="w-full border p-2 rounded" required />
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" className="w-full border p-2 rounded" required />
        <button className="w-full bg-slate-900 text-white p-2 rounded">{mode==='login' ? 'Login' : 'Create account'}</button>
      </form>

      <div className="mt-3 border-t pt-3">
        <button
            onClick={signGoogle}
            className="w-full px-3 py-2 rounded border flex items-center justify-center gap-2 bg-white hover:bg-gray-50 transition"
          >
            <img 
              src="/icons/google.svg" 
              alt="Google"
              className="w-5 h-5"
            />
            Continue with Google
          </button>
      </div>
    </div>
  );
}
