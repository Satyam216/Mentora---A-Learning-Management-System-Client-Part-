import Link from 'next/link';
import ProgressPill from './ProgressPill';
import { motion } from 'framer-motion';

export default function CourseCard({ course }) {
  return (
    <motion.div layout className="border rounded-2xl overflow-hidden">
      <Link href={`/courses/${course.id}`} className="block">
        <div className="h-40 bg-gray-100">
          <img src={course.thumbnail_path || '/assets/course-default.jpg'} className="w-full h-40 object-cover" />
        </div>
        <div className="p-4">
          <div className="font-semibold">{course.title}</div>
          <div className="mt-2 text-sm text-slate-600 line-clamp-2">{course.description}</div>
          <div className="mt-3 flex items-center justify-between">
            <div className="text-sm text-slate-500">₹{(course.price_cents||0)|| 'Free'}</div>
            <ProgressPill percent={course.progress_percent || 0} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
