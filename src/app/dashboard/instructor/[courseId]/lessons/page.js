// src/app/dashboard/instructor/[courseId]/lessons/page.js
'use client';
import { useRouter, useParams } from 'next/navigation';
import InstructorNavbar from '@/components/instructor/Sidebar';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import Link from 'next/link';

export default function LessonsPage() {
  const { courseId } = useParams();
  const { data: lessons = [], isLoading } = useQuery({
    queryKey: ['lessons', courseId],
    queryFn: async () => {
      const r = await api.get(`/lessons/${courseId}`);
      return r.data || [];
    },
    enabled: !!courseId
  });

  if (isLoading) return <div className="p-6">Loading...</div>;

  return (
    <>
      <InstructorNavbar />
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Lessons</h2>
          <Link href={`/dashboard/instructor/${courseId}/lessons/create`} className="px-4 py-2 bg-amber-500 text-white rounded">Add Lesson</Link>
        </div>

        <div className="mt-4 space-y-3">
          {lessons.length === 0 && <div className="text-slate-500">No lessons yet.</div>}
          {lessons.map(l => (
            <div key={l.id} className="border rounded p-3 flex items-center justify-between">
              <div>
                <div className="font-medium">{l.title}</div>
                <div className="text-xs text-slate-500">{Math.floor((l.duration_seconds||0)/60)} min • {l.is_preview ? 'Preview' : ''}</div>
              </div>
              <div className="flex gap-2">
                <Link href={`/dashboard/instructor/${courseId}/lessons/edit/${l.id}`} className="px-3 py-1 border rounded">Edit</Link>
                <button className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
