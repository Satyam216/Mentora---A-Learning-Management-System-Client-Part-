'use client';
import Protected from '@/components/Protected';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export default function Admin() {
  const { data } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => (await api.get('/admin/stats')).data
  });

  return (
    <Protected>
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
        {data ? (
          <>
            <Card label="Users" value={data.users ?? 0} />
            <Card label="Courses" value={data.courses ?? 0} />
            <Card label="Enrollments" value={data.enrollments ?? 0} />
            <Card label="Payments" value={data.payments ?? 0} />
          </>
        ) : <div>Loading...</div>}
      </div>
    </Protected>
  );
}

function Card({ label, value }) {
  return (
    <div className="border rounded-xl p-4">
      <div className="text-sm text-gray-600">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}
