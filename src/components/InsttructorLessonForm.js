// src/components/InstructorLessonForm.js
'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { api } from '@/lib/api';

export default function InstructorLessonForm() {
  const [courseId, setCourseId] = useState('');
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [isPreview, setIsPreview] = useState(false);
  const [loading, setLoading] = useState(false);

  const uploadAndCreate = async () => {
    if (!courseId || !title || !file) return alert('Provide course id, title and file');
    setLoading(true);
    try {
      const path = `${courseId}/${crypto.randomUUID()}-${file.name}`;
      const { error: upErr } = await supabase.storage.from('course-videos').upload(path, file, { upsert: false });
      if (upErr) throw upErr;
      // create lesson row via backend
      const res = await api.post('/lessons', { course_id: courseId, title, video_path: path, is_preview: isPreview });
      alert('Lesson added: ' + res.data.id);
      setTitle(''); setFile(null); setIsPreview(false);
    } catch (e) {
      alert(e?.message || e?.response?.data?.error || 'Error uploading');
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-3">
      <input value={courseId} onChange={e=>setCourseId(e.target.value)} className="w-full border p-2 rounded" placeholder="Course ID" />
      <input value={title} onChange={e=>setTitle(e.target.value)} className="w-full border p-2 rounded" placeholder="Lesson title" />
      <input type="file" accept="video/*" onChange={e=>setFile(e.target.files?.[0])} />
      <label className="flex items-center gap-2"><input type="checkbox" checked={isPreview} onChange={e=>setIsPreview(e.target.checked)} /> Is preview</label>
      <button onClick={uploadAndCreate} className="px-4 py-2 bg-slate-900 text-white rounded" disabled={loading}>{loading ? 'Uploading...' : 'Upload & Create'}</button>
    </div>
  );
}
