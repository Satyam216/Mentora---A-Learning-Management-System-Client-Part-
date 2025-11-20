// src/app/dashboard/instructor/quizzes/create/page.js
'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import InstructorNavbar from '@/components/instructor/Sidebar';
import { api } from '@/lib/api';

export default function CreateQuiz() {
  const sp = useSearchParams();
  const courseId = sp.get('courseId');
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([ { question: '', options: ['', ''], correct_index: 0 } ]);

  const addQuestion = () => setQuestions(qs => [...qs, { question: '', options: ['', ''], correct_index: 0 }]);
  const addOption = (i) => setQuestions(qs => qs.map((q, idx) => idx===i ? {...q, options: [...q.options, '']} : q));

  const updateQuestion = (i, key, val) => setQuestions(qs => qs.map((q, idx) => idx===i ? {...q, [key]: val} : q));
  const updateOption = (i, optIdx, val) => setQuestions(qs => qs.map((q, idx) => idx===i ? {...q, options: q.options.map((o,oIdx) => oIdx===optIdx ? val : o) } : q));

  const doCreate = async () => {
    if (!title || !courseId) return alert('Title & courseId required');
    try {
      const res = await api.post('/quiz', { course_id: courseId, title });
      const quizId = res.data.id;
      for (const q of questions) {
        await api.post(`/quiz/${quizId}/questions`, { question: q.question, options: q.options, correct_index: q.correct_index });
      }
      alert('Quiz created');
      router.push('/dashboard/instructor/quizzes');
    } catch (e) {
      alert(e?.response?.data?.error || e?.message || 'Error');
    }
  };

  return (
    <>
      <InstructorNavbar />
      <div className="max-w-3xl mx-auto py-8 px-4">
        <h2 className="text-2xl font-semibold">Create Quiz</h2>
        <div className="space-y-3 mt-4">
          <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Quiz title" className="w-full border p-2 rounded" />
          {questions.map((q, i) => (
            <div key={i} className="border rounded p-3">
              <input value={q.question} onChange={e=>updateQuestion(i, 'question', e.target.value)} placeholder={`Question ${i+1}`} className="w-full border p-2 rounded" />
              <div className="mt-2 space-y-2">
                {q.options.map((opt, oi)=>(
                  <div key={oi} className="flex items-center gap-2">
                    <input value={opt} onChange={e=>updateOption(i, oi, e.target.value)} className="flex-1 border p-2 rounded" />
                    <label className="text-xs">Correct <input type="radio" name={`correct-${i}`} checked={q.correct_index===oi} onChange={()=>updateQuestion(i,'correct_index', oi)} /></label>
                  </div>
                ))}
                <div className="mt-2">
                  <button onClick={()=>addOption(i)} className="px-3 py-1 border rounded text-sm">Add option</button>
                </div>
              </div>
            </div>
          ))}
          <div className="flex gap-2">
            <button onClick={addQuestion} className="px-3 py-2 border rounded">Add question</button>
            <button onClick={doCreate} className="px-4 py-2 bg-amber-500 text-white rounded">Create quiz</button>
          </div>
        </div>
      </div>
    </>
  );
}
