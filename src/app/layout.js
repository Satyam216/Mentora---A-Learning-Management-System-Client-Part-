// src/app/layout.js  (Server Component)
import './globals.css';
import ReactQueryProvider from '@/lib/queryClient';
import Navbar from '@/components/Navbar';
import ClientIdleWrapper from '@/components/ClientIdleWrapper';
import Footer from '@/components/Footer';

export const metadata = { title: 'LMS', description: 'Online Learning Platform' };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>
          <Navbar /> 
          <ClientIdleWrapper>
            <main className="min-h-[80vh]">{children}</main>
          </ClientIdleWrapper>
           <Footer />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
