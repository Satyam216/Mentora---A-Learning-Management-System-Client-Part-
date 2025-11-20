// src/app/dashboard/instructor/[courseId]/lessons/create/page.js
'use client';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import InstructorNavbar from '@/components/instructor/Sidebar';
import { supabase } from '@/lib/supabase';
import { api } from '@/lib/api';

export default function CreateLessonPage() {
  const { courseId } = useParams();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [isPreview, setIsPreview] = useState(false);
  const [loading, setLoading] = useState(false);

  const uploadAndCreate = async () => {
    if (!title || !file) return alert('Title and file required');
    setLoading(true);
    try {
      const folder = `course-videos/${courseId}`;
      const filePath = `${folder}/${Date.now()}-${file.name}`;
      const { error } = await supabase.storage.from('course-videos').upload(filePath, file);
      if (error) throw error;

      // create lesson row (video_path stored)
      const res = await api.post('/lessons', { course_id: courseId, title, video_path: filePath, is_preview: isPreview });
      alert('Lesson created');
      router.push(`/dashboard/instructor/${courseId}/lessons`);
    } catch (e) {
      alert(e?.message || 'Error uploading');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <InstructorNavbar />
      <div className="max-w-3xl mx-auto py-8 px-4">
        <h2 className="text-2xl font-semibold mb-4">Add lesson to course</h2>
        <div className="space-y-3">
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Lesson title" className="w-full border p-2 rounded" />
          <input type="file" accept="video/*" onChange={e => setFile(e.target.files?.[0])} />
          <label className="flex items-center gap-2"><input type="checkbox" checked={isPreview} onChange={e => setIsPreview(e.target.checked)} /> Mark as preview</label>
          <div className="flex gap-2">
            <button onClick={uploadAndCreate} disabled={loading} className="px-4 py-2 bg-slate-900 text-white rounded">{loading ? 'Uploading...' : 'Upload & Create'}</button>
            <button onClick={() => router.back()} className="px-4 py-2 border rounded">Cancel</button>
          </div>
        </div>
      </div>
    </>
  );
}
