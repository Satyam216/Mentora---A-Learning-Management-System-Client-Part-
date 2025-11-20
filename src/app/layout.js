// src/app/layout.js  (Server Component)
import './globals.css';
import ReactQueryProvider from '@/lib/queryClient';
import Navbar from '@/components/Navbar';
import ClientIdleWrapper from '@/components/ClientIdleWrapper';
import Footer from '@/components/Footer';
import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';


export const metadata = { title: 'Mentora', description: 'Online Learning Platform' };

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
