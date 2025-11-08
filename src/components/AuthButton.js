'use client';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AuthButton() {
  const r = useRouter();

  const signOut = async () => {
    await supabase.auth.signOut();
    r.push('/auth/login');
  };

  return (
    <button onClick={signOut} className="px-3 py-2 rounded bg-black text-white">
      Logout
    </button>
  );
}
