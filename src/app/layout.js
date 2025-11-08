import './globals.css';
import Link from 'next/link';
import ReactQueryProvider from '@/lib/query';
import AuthButton from '@/components/AuthButton';

export const metadata = { title: 'LMS', description: 'Online Learning Platform' };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <ReactQueryProvider>
          <header className="border-b">
            <nav className="max-w-6xl mx-auto flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <Link href="/" className="font-bold text-xl">LMS</Link>
                <Link href="/courses" className="hover:underline">Courses</Link>
                <Link href="/dashboard/instructor" className="hover:underline">Instructor</Link>
                <Link href="/dashboard/admin" className="hover:underline">Admin</Link>
              </div>
              <AuthButton />
            </nav>
          </header>
          <main className="max-w-6xl mx-auto p-6">{children}</main>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
