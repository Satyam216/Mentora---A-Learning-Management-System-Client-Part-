// src/app/dashboard/instructor/create/page.js
'use client';
import { useState } from 'react';
import InstructorNavbar from '@/components/instructor/Sidebar';
import { supabase } from '@/lib/supabase';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function CreateCoursePage() {
  const router = useRouter();
  const qc = useQueryClient();
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const createMut = useMutation({
    mutationFn: async ({ title, description, price_cents, thumbnail_path }) => {
      const res = await api.post('/courses', { title, description, price_cents, thumbnail_path });
      return res.data;
    },
    onSuccess: (data) => {
      qc.invalidateQueries(['instructor-courses']);
      router.push(`/dashboard/instructor/${data.id}/lessons`);
    }
  });

  const doCreate = async () => {
    if (!title) return alert('Title required');
    setLoading(true);
    try {
      let thumbnail_path = null;
      if (file) {
        const filePath = `course-thumbnails/${Date.now()}-${file.name}`;
        const { error } = await supabase.storage.from('course-thumbnails').upload(filePath, file);
        if (error) throw error;
        thumbnail_path = filePath;
      }

      await createMut.mutateAsync({
        title,
        description: desc,
        price_cents: Math.round((Number(price) || 0) * 100),
        thumbnail_path
      });
    } catch (e) {
      alert(e?.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <InstructorNavbar />
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h2 className="text-2xl font-semibold mb-4">Create new course</h2>
        <div className="space-y-4">
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Course title" className="w-full border p-2 rounded" />
          <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Short description" className="w-full border p-2 rounded" rows={4} />
          <input value={price} onChange={e => setPrice(e.target.value)} placeholder="Price (INR)" className="w-full border p-2 rounded" />
          <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0])} />
          <div className="flex gap-3">
            <button onClick={doCreate} disabled={loading} className="px-4 py-2 bg-slate-900 text-white rounded">{loading ? 'Creating...' : 'Create course'}</button>
            <button onClick={() => router.back()} className="px-4 py-2 border rounded">Cancel</button>
          </div>
        </div>
      </div>
    </>
  );
}
