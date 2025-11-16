'use client';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import CourseCard from '@/components/CourseCard';

export default function Courses() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => (await api.get('/courses')).data,
  });

  if (isLoading) return <div className="p-6">Loading courses...</div>;
  if (error) return <div className="p-6 text-red-500">Error loading courses</div>;

  return (
    <div className="max-w-6xl mx-auto py-8">
      <h1 className="text-2xl font-bold">All Courses</h1>
      <div className="grid md:grid-cols-3 gap-6 mt-6">
        {data?.map(c => <CourseCard key={c.id} course={c} />)}
      </div>
    </div>
  );
}
