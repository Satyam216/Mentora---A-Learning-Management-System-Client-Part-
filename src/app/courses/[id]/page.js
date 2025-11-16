'use client';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import VideoPlayer from '@/components/VideoPlayer';
import { useState } from 'react';

export default function CourseDetail() {
  const params = useParams();
  const id = params?.id;
  const [videoSrc, setVideoSrc] = useState(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['course', id],
    queryFn: async () => {
      const res = await api.get(`/courses/${id}`);
      return res.data;
    },
    enabled: !!id,
    retry: 1,
    staleTime: 1000 * 60, // 1 minute
  });

  const playLesson = async (lessonId) => {
    try {
      const res = await api.get(`/lessons/stream/${lessonId}`);
      setVideoSrc(res.data.url);
    } catch (e) {
      // better error feedback
      const msg = e?.response?.data?.error || e?.message || 'You must enroll to watch this lesson';
      alert(msg);
    }
  };

  if (isLoading) return <div className="p-6">Loading course...</div>;
  if (error) return <div className="p-6 text-red-500">Error loading course</div>;
  if (!data) return <div className="p-6">Course not found</div>;

  const { course, lessons } = data || {};
  const safeLessons = Array.isArray(lessons) ? lessons : [];

  return (
    <div className="max-w-6xl mx-auto py-8 grid md:grid-cols-[2fr_1fr] gap-6">
      <div>
        <h1 className="text-2xl font-bold">{course?.title || 'Untitled Course'}</h1>
        <p className="text-slate-600 mt-2">{course?.description}</p>

        <div className="mt-6">
          <VideoPlayer
            src={videoSrc}
            onProgress={(seconds) => {
              /* connect this to /progress/update if needed */
            }}
          />
        </div>

        <div className="mt-6">
          <h3 className="font-semibold">Lessons</h3>
          <div className="space-y-2 mt-3">
            {safeLessons.length === 0 && (
              <div className="text-sm text-slate-500 p-3 border rounded">No lessons uploaded yet.</div>
            )}

            {safeLessons.map((l) => (
              <div key={l.id} className="flex items-center justify-between border rounded p-3">
                <div>
                  <div className="font-medium">{l.title}</div>
                  <div className="text-sm text-slate-500">
                    {Math.floor((l.duration_seconds || 0) / 60)} min
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => playLesson(l.id)}
                    className="px-3 py-1 rounded bg-slate-900 text-white"
                  >
                    Play
                  </button>
                  {l.is_preview && (
                    <div className="text-xs px-2 py-1 border rounded">Preview</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <aside>
        <div className="card">
          <div className="text-sm text-slate-500">Instructor</div>
          <div className="font-semibold mt-1">{course?.instructor_id || 'Unknown'}</div>

          <div className="mt-4">
            <div className="text-sm">Price</div>
            <div className="text-lg font-bold">
              {course?.price_cents ? `₹${(course.price_cents / 100).toFixed(2)}` : 'Free'}
            </div>

            <button
              className="mt-4 w-full bg-amber-500 text-white px-3 py-2 rounded"
              onClick={() => alert('Purchase flow not implemented yet')}
            >
              Purchase
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
