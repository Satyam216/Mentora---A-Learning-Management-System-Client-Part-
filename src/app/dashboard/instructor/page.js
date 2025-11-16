// src/app/dashboard/instructor/page.js
'use client';
import InstructorCourseForm from '@/components/InstructorCourseForm';
import InstructorLessonForm from '@/components/InstructorLessonForm';

export default function InstructorDashboard() {
  return (
    <div className="max-w-6xl mx-auto py-8">
      <h1 className="text-2xl font-bold">Instructor Dashboard</h1>
      <p className="text-slate-600 mt-2">Create and manage your courses</p>

      <div className="mt-6 grid md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold mb-3">Create Course</h3>
          <InstructorCourseForm />
        </div>

        <div className="card">
          <h3 className="font-semibold mb-3">Add Lesson</h3>
          <InstructorLessonForm />
        </div>
      </div>
    </div>
  );
}
