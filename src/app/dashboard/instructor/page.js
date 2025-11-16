'use client';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export default function InstructorDashboard() {
  const { data } = useQuery(['my-courses'], async () => (await api.get('/courses?mine=1')).data);
  return (
    <div className="max-w-6xl mx-auto py-8">
      <h1 className="text-2xl font-bold">Instructor Dashboard</h1>
      <p className="text-slate-600 mt-2">Create & manage your courses</p>
      <div className="mt-6">
        <button className="bg-slate-900 text-white px-4 py-2 rounded">Create new course</button>
      </div>
      <div className="mt-6 space-y-3">
        {data?.map(c => (
          <div key={c.id} className="border rounded p-3 flex items-center justify-between">
            <div>
              <div className="font-semibold">{c.title}</div>
              <div className="text-sm text-slate-500">{c.description}</div>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 border rounded">Edit</button>
              <button className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
