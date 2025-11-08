'use client';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import Protected from '@/components/Protected';

export default function CoursePage() {
  const { id } = useParams();

  const { data } = useQuery({
    queryKey: ['course', id],
    queryFn: async () => (await api.get(`/courses/${id}`)).data,
    enabled: !!id
  });

  const play = async (lessonId) => {
    try {
      const { data } = await api.get(`/lessons/stream/${lessonId}`);
      const v = document.getElementById('player');
      v.src = data.url;
      v.play();
    } catch (e) {
      alert(e?.response?.data?.error || 'Unable to play. Enroll first?');
    }
  };

  if (!data) return <div>Loading...</div>;
  const { course, lessons } = data;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{course.title}</h1>
      <div className="grid md:grid-cols-[2fr_1fr] gap-6">
        <video id="player" className="w-full aspect-video bg-black rounded" controls />
        <div className="space-y-2">
          {lessons.map(l => (
            <button key={l.id} onClick={() => play(l.id)} className="w-full text-left border rounded p-2">
              {l.title} {l.is_preview ? '(Preview)' : ''}
            </button>
          ))}
        </div>
      </div>
      {/* Protected block example for progress/quiz; open to all for preview lessons */}
      <Protected>
        <div className="border rounded p-3">
          <p className="font-medium">Your progress & quiz will appear here.</p>
        </div>
      </Protected>
    </div>
  );
}
