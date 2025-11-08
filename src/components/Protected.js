'use client';
import { useSession } from '@/hooks/useSession';
import Link from 'next/link';

export default function Protected({ children }) {
  const { user, loading } = useSession();
  if (loading) return <div className="p-6">Loading...</div>;
  if (!user) {
    return (
      <div className="p-6">
        You must be logged in. <Link className="underline" href="/auth/login">Login</Link>
      </div>
    );
  }
  return children;
}
