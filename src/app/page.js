import Link from 'next/link';

export default function Home() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Explore Courses</h1>
      <p className="text-gray-600">Sign in with Google or Email/Password and start learning.</p>
      <div className="flex gap-3">
        <Link href="/courses" className="px-4 py-2 rounded bg-black text-white">Browse Courses</Link>
        <Link href="/auth/login" className="px-4 py-2 rounded border">Login</Link>
      </div>
    </div>
  );
}
