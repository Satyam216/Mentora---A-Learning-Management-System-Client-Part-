'use client';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { User } from 'lucide-react';

export default function Topbar() {
  const router = useRouter();

  const logout = async () => {
    await supabase.auth.signOut();
    router.replace('/auth/login');
  };

  const goToProfile = () => {
    router.push('/profile');   // 👈 Profile page open
  };

  return (
    <header className="h-16 flex items-center justify-between bg-white px-6 shadow-sm">
      <h3 className="text-lg font-semibold">Dashboard</h3>

      <div className="flex items-center gap-4">

        {/* Profile Icon Button */}
        <button
          onClick={goToProfile}
          className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition"
        >
          <User size={22} className="text-gray-700" />
        </button>

        {/* Logout button */}
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
