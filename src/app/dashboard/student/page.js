'use client';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import CourseCard from '@/components/CourseCard';

export default function StudentDashboard() {
  const { data: courses, isLoading } = useQuery({
    queryKey: ['student-courses'],
    queryFn: async () => (await api.get('/courses')).data
  });

  if (isLoading) return <div>Loading...</div>;
  return (
    <div className="max-w-6xl mx-auto py-8">
      <h1 className="text-2xl font-bold">Your Courses</h1>
      <div className="mt-4 grid md:grid-cols-3 gap-4">
        {courses?.map(c => <CourseCard key={c.id} course={{...c, progress_percent: 0}} />)}
      </div>
    </div>
  );
}
