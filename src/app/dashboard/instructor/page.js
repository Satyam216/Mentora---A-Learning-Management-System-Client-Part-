'use client';
import Protected from '@/components/Protected';
import { useState } from 'react';
import { api } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';

export default function Instructor() {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState(0);
  const [courseId, setCourseId] = useState('');
  const [lessonTitle, setLessonTitle] = useState('');
  const [file, setFile] = useState(null);
  const [isPreview, setIsPreview] = useState(false);

  const { data: myCourses, refetch } = useQuery({
    queryKey: ['my-courses'],
    queryFn: async () => (await api.get('/courses?mine=1')).data,
    enabled: false // optional: implement "mine" in backend if you want
  });

  const createCourse = async () => {
    const { data } = await api.post('/courses', {
      title, description: desc, price_cents: Number(price)
    });
    alert('Course created');
    setCourseId(data.id);
    refetch();
  };

  const uploadVideo = async () => {
    if (!file || !courseId) return alert('Choose file and course');
    const path = `${courseId}/${crypto.randomUUID()}-${file.name}`;
    const { error } = await supabase.storage.from('course-videos')
      .upload(path, file, { upsert: false });
    if (error) return alert(error.message);

    await api.post('/lessons', {
      course_id: courseId, title: lessonTitle, video_path: path, is_preview: isPreview
    });

    alert('Lesson added');
    setLessonTitle(''); setFile(null);
  };

  return (
    <Protected>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-3 border rounded p-4">
          <h2 className="font-bold text-lg">Create Course</h2>
          <input className="border p-2 w-full rounded" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
          <textarea className="border p-2 w-full rounded" placeholder="Description" value={desc} onChange={e=>setDesc(e.target.value)} />
          <input className="border p-2 w-full rounded" placeholder="Price (cents)" value={price} onChange={e=>setPrice(e.target.value)} />
          <button onClick={createCourse} className="bg-black text-white rounded px-4 py-2">Create</button>
          {courseId && <p className="text-sm text-gray-600">Current Course ID: {courseId}</p>}
        </div>

        <div className="space-y-3 border rounded p-4">
          <h2 className="font-bold text-lg">Add Lesson</h2>
          <input className="border p-2 w-full rounded" placeholder="Course ID" value={courseId} onChange={e=>setCourseId(e.target.value)} />
          <input className="border p-2 w-full rounded" placeholder="Lesson title" value={lessonTitle} onChange={e=>setLessonTitle(e.target.value)} />
          <input type="file" accept="video/*" onChange={e=>setFile(e.target.files?.[0])} />
          <label className="flex items-center gap-2"><input type="checkbox" checked={isPreview} onChange={e=>setIsPreview(e.target.checked)} /> Preview</label>
          <button onClick={uploadVideo} className="bg-black text-white rounded px-4 py-2">Upload + Add</button>
        </div>
      </div>
    </Protected>
  );
}
