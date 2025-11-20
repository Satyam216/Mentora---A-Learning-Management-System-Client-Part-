// src/app/dashboard/instructor/quizzes/page.js
'use client';
import InstructorNavbar from '@/components/instructor/Sidebar';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import Link from 'next/link';

export default function QuizzesIndex() {
  const { data: courses = [] } = useQuery({
    queryKey: ['instructor-courses-for-quizzes'],
    queryFn: async () => (await api.get('/courses?mine=true')).data || []
  });

  return (
    <>
      <InstructorNavbar />
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h2 className="text-2xl font-semibold">Quizzes</h2>
        <div className="mt-4 space-y-3">
          {courses.map(c => (
            <div key={c.id} className="border rounded p-3 flex justify-between items-center">
              <div>
                <div className="font-semibold">{c.title}</div>
                <div className="text-sm text-slate-500">{(c.quizzes || []).length} quizzes</div>
              </div>
              <div className="flex gap-2">
                <Link href={`/dashboard/instructor/quizzes/create?courseId=${c.id}`} className="px-3 py-1 border rounded">Create Quiz</Link>
                <Link href={`/dashboard/instructor/quizzes/${c.id}`} className="px-3 py-1 border rounded">Manage</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
