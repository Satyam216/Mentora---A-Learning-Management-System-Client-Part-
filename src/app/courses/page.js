'use client';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import Link from 'next/link';

export default function Courses() {
  const { data } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => (await api.get('/courses')).data
  });

  if (!data) return <div>Loading...</div>;

  return (
    <div className="grid md:grid-cols-3 gap-4">
      {data.map(c => (
        <Link key={c.id} href={`/courses/${c.id}`} className="border rounded-xl p-4 hover:shadow">
          <div className="aspect-video bg-gray-100 rounded mb-3" />
          <div className="font-semibold">{c.title}</div>
          <div className="text-sm text-gray-600 line-clamp-2">{c.description}</div>
        </Link>
      ))}
    </div>
  );
}
