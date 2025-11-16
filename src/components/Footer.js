// src/components/Footer.js
'use client';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white mt-12">
      <div className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-4 gap-6">
        <div>
          <h4 className="font-semibold text-lg">Mentora</h4>
          <p className="mt-2 text-sm text-slate-300">Build skills that matter. Learn from creators worldwide.</p>
        </div>

        <div>
          <h5 className="font-semibold">Products</h5>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            <li><Link href="/courses">Courses</Link></li>
            <li><Link href="/dashboard">Dashboard</Link></li>
            <li><Link href="/auth/login">Login</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="font-semibold">Company</h5>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            <li>About</li>
            <li>Careers</li>
            <li>Contact</li>
          </ul>
        </div>

        <div>
          <h5 className="font-semibold">Contact</h5>
          <p className="text-sm text-slate-300 mt-3">Email: satyamjain216@gmail.com</p>
          <p className="text-sm text-slate-300">Phone: +91 8979769045</p>
        </div>
      </div>

      <div className="border-t border-slate-800 py-4">
        <div className="max-w-6xl mx-auto px-6 text-sm text-slate-500 flex justify-between">
          <div>© {new Date().getFullYear()} LMS — All rights reserved.</div>
          <div>Class Standards · Terms · Privacy</div>
        </div>
      </div>
    </footer>
  );
}
