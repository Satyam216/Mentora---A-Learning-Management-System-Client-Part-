'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Signup() {
  const r = useRouter();
  const [full_name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onEmail = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name } }
    });
    if (error) alert(error.message);
    else {
      alert('Check your email to confirm (if enabled).');
      r.push('/');
    }
  };

  return (
    <div className="max-w-sm mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Create account</h1>
      <form onSubmit={onEmail} className="space-y-3">
        <input className="w-full border p-2 rounded" placeholder="Full name" value={full_name} onChange={e=>setName(e.target.value)} />
        <input className="w-full border p-2 rounded" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full border p-2 rounded" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="w-full bg-black text-white rounded p-2">Sign up</button>
      </form>
    </div>
  );
}
