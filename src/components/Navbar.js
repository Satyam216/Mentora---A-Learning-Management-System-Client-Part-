'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useSession } from '@/hooks/useSession';
import { supabase } from '@/lib/supabase';
import { usePathname } from 'next/navigation';
import { User, LogOut, Menu, X } from 'lucide-react';

export default function Navbar() {
  const { user, loading } = useSession();
  const path = usePathname();
  const [open, setOpen] = useState(false);

  const signOut = async () => {
    await supabase.auth.signOut();
    // client-side redirect
    window.location.href = '/auth/login';
  };

  const LinkItem = ({ href, children }) => {
    const active = path === href;
    return (
      <Link
        href={href}
        className={`px-2 py-1 rounded-md ${active ? 'text-slate-900 font-medium' : 'text-slate-600 hover:text-slate-900'}`}
        onClick={() => setOpen(false)}
      >
        {children}
      </Link>
    );
  };

  return (
    <header className="bg-white border-b sticky top-0 z-40">
      <div className="w-full flex items-center justify-between px-6 md:px-10 h-20">
        {/* LOGO - left aligned */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Image
              src="/assets/MentoraLogo.png"
              alt="Mentora"
              width={170}
              height={60}
              priority
              className="object-contain"
            />
          </Link>
        </div>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-6">
          <LinkItem href="/courses">Courses</LinkItem>
          <LinkItem href="/dashboard">Dashboard</LinkItem>

          {!loading && !user && (
            <>
              <Link href="/auth/login" className="px-3 py-2 border rounded-lg text-sm">Login</Link>
              <Link href="/auth/signup" className="px-3 py-2 rounded-lg bg-slate-900 text-white text-sm">Sign up</Link>
            </>
          )}

          {!loading && user && (
            <div className="flex items-center gap-3">
              <Link href="/profile" className="flex items-center gap-2 text-sm">
                <User size={18} />
                <span className="hidden sm:inline">{user.user_metadata?.full_name || user.email}</span>
              </Link>
              <button onClick={signOut} className="px-3 py-2 rounded-lg bg-slate-900 text-white flex items-center gap-2 text-sm">
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </nav>

        {/* MOBILE: hamburger */}
        <div className="md:hidden flex items-center">
          <button onClick={() => setOpen(v => !v)} aria-label="Menu" className="p-2 rounded-md border">
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU (slide down) */}
      <div className={`md:hidden bg-white border-t overflow-hidden transition-[max-height] duration-300 ${open ? 'max-h-80' : 'max-h-0'}`}>
        <div className="px-6 py-4 flex flex-col gap-3">
          <Link href="/courses" onClick={()=>setOpen(false)} className="text-slate-700">Courses</Link>
          <Link href="/dashboard" onClick={()=>setOpen(false)} className="text-slate-700">Dashboard</Link>

          {!loading && !user && (
            <>
              <Link href="/auth/login" onClick={()=>setOpen(false)} className="px-3 py-2 border rounded-md text-center">Login</Link>
              <Link href="/auth/signup" onClick={()=>setOpen(false)} className="px-3 py-2 rounded-md bg-slate-900 text-white text-center">Sign up</Link>
            </>
          )}

          {!loading && user && (
            <>
              <Link href="/profile" onClick={()=>setOpen(false)} className="flex items-center gap-2">
                <User size={16}/> {user.user_metadata?.full_name || user.email}
              </Link>
              <button onClick={signOut} className="px-3 py-2 rounded-md bg-slate-900 text-white">Logout</button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
