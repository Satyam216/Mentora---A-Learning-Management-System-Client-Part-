// src/app/layout.js  (Server Component)
import './globals.css';
import ReactQueryProvider from '@/lib/queryClient';
import Navbar from '@/components/Navbar';
import ClientIdleWrapper from '@/components/ClientIdleWrapper'; // <- NEW

export const metadata = { title: 'LMS', description: 'Online Learning Platform' };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>
          <Navbar /> {/* Navbar is a client component already (has "use client") */}
          {/* Wrap the part of the tree that needs client behavior */}
          <ClientIdleWrapper>
            <main className="min-h-[80vh]">{children}</main>
          </ClientIdleWrapper>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
