import Link from 'next/link';
import { BookOpen, Layers, Users, LayoutList, PlusCircle } from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white shadow-xl min-h-screen p-6 rounded-r-3xl">
      <div className="text-center mb-8">
        <h2 className="text-xl font-semibold text-gray-700">Instructor</h2>
      </div>

      <nav className="space-y-3">
        <Link href="/dashboard/instructor" className="nav-item">📊 Dashboard</Link>
        <Link href="/dashboard/instructor/courses" className="nav-item">📚 My Courses</Link>
        <Link href="/dashboard/instructor/add-course" className="nav-item">➕ Add Course</Link>
        <Link href="/dashboard/instructor/lessons" className="nav-item">🎬 Lessons</Link>
        <Link href="/dashboard/instructor/quizzes" className="nav-item">📝 Quizzes</Link>
        <Link href="/dashboard/instructor/students" className="nav-item">👥 Students</Link>

      </nav>

      <style jsx>{`
        .nav-item {
          display: block;
          padding: 12px;
          border-radius: 12px;
          font-size: 15px;
          color: #4a5568;
          background: #f7f9fc;
          transition: 0.25s;
        }
        .nav-item:hover {
          background: #eef5ff;
          color: #2563eb;
        }
      `}</style>
    </aside>
  );
}
