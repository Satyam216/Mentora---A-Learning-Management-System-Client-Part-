// src/components/InstructorCourseForm.js
'use client';
import { useState } from 'react';
import { api } from '@/lib/api';

export default function InstructorCourseForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);

  const create = async () => {
    if (!title) return alert('Title required');
    setLoading(true);
    try {
      const res = await api.post('/courses', { title, description, price_cents: Math.round((Number(price)||0)*100) });
      alert('Course created: ' + res.data.id);
      setTitle(''); setDescription(''); setPrice('');
    } catch (e) {
      alert(e?.response?.data?.error || e?.message || 'Error');
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-3">
      <input value={title} onChange={e=>setTitle(e.target.value)} className="w-full border p-2 rounded" placeholder="Course title" />
      <textarea value={description} onChange={e=>setDescription(e.target.value)} className="w-full border p-2 rounded" placeholder="Short description" />
      <input value={price} onChange={e=>setPrice(e.target.value)} className="w-full border p-2 rounded" placeholder="Price (INR)" />
      <div className="flex gap-2">
        <button onClick={create} className="px-4 py-2 bg-slate-900 text-white rounded" disabled={loading}>{loading ? 'Creating...' : 'Create Course'}</button>
      </div>
    </div>
  );
}
