'use client';
import Link from 'next/link';
import { useSession } from '@/hooks/useSession';
import { supabase } from '@/lib/supabase';
import { usePathname } from 'next/navigation';
import { LogOut, User, BookOpen, Users, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navbar() {
  const { user, loading } = useSession();
  const path = usePathname();

  const signOut = async () => {
    await supabase.auth.signOut();
    // client will auto redirect via auth hook in pages
    location.href = '/auth/login';
  };

  return (
    <motion.header initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: .45 }}>
      <nav className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-sky-600 flex items-center justify-center text-white font-bold">M</div>
            <div>
              <div className="font-semibold">Mentora</div>
              <div className="text-xs text-slate-400">Learn. Think. Apply.</div>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/courses" className={`hover:underline ${path.startsWith('/courses') ? 'font-medium' : 'text-slate-600'}`}>Courses</Link>
            <Link href="/dashboard" className="text-slate-600 hover:underline">Dashboard</Link>
            {!loading && !user && <Link href="/auth/login" className="px-3 py-2 border rounded-md">Login</Link>}
            {!loading && user && (
              <div className="flex items-center gap-3">
                <Link href="/me" className="flex items-center gap-2 px-2 py-1 rounded hover:bg-slate-50">
                  <User size={18} />
                  <span className="hidden sm:block text-sm">{user.user_metadata?.full_name || user.email}</span>
                </Link>
                <button onClick={signOut} className="px-3 py-2 rounded bg-slate-900 text-white flex items-center gap-2">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </motion.header>
  );
}
