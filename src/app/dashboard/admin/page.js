'use client';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export default function AdminDashboard() {
  const { data } = useQuery(['admin-stats'], async () => (await api.get('/admin/stats')).data);
  return (
    <div className="max-w-6xl mx-auto py-8">
      <h1 className="text-2xl font-bold">Admin</h1>
      <div className="mt-6 grid md:grid-cols-4 gap-4">
        <div className="card"><div className="text-sm">Users</div><div className="text-2xl font-bold">{data?.users ?? 0}</div></div>
        <div className="card"><div className="text-sm">Courses</div><div className="text-2xl font-bold">{data?.courses ?? 0}</div></div>
        <div className="card"><div className="text-sm">Enrollments</div><div className="text-2xl font-bold">{data?.enrollments ?? 0}</div></div>
        <div className="card"><div className="text-sm">Payments</div><div className="text-2xl font-bold">{data?.payments ?? 0}</div></div>
      </div>
    </div>
  );
}
