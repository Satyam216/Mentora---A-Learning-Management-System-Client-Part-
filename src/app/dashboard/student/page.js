// src/app/dashboard/page.js
'use client';
import { useEffect, useState, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/hooks/useSession';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import { Play, Search } from 'lucide-react';


function CourseCardSmall({ course, onOpen }) {
  return (
    <div className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition p-3">
      <div className="flex gap-3 items-center">
        <img src={course.thumbnail_url || '/course-default.jpg'} alt={course.title} className="w-20 h-12 object-cover rounded" />
        <div className="flex-1">
          <div className="font-medium text-sm line-clamp-2">{course.title}</div>
          <div className="text-xs text-slate-500 mt-1">₹{(course.price_cents||0) || 'Free'}</div>
        </div>
        <div className="text-right">
          <div className="text-sm font-semibold">{Math.round(course.completion_percent || 0)}%</div>
          <div className="text-xs text-slate-400">complete</div>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <button onClick={() => onOpen(course)} className="px-3 py-1 bg-slate-900 text-white rounded text-sm flex items-center gap-2">
          <Play size={14} /> Open
        </button>
      </div>
    </div>
  );
}

export default function StudentDashboard() {
  const { user, loading } = useSession();
  const router = useRouter();
  const [coursesWithMeta, setCoursesWithMeta] = useState([]);
  const signedUrlCache = useRef(new Map());

  // search state
  const [q, setQ] = useState('');

  // 1) fetch all courses
  const { data: courses = [], isLoading: loadingCourses } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const r = await api.get('/courses');
      return r.data || [];
    },
    staleTime: 1000 * 60,
  });

  // 2) fetch enrollments (used to compute trending by counting course_id occurrences)
  const { data: enrollments = [] } = useQuery({
    queryKey: ['enrollments'],
    queryFn: async () => {
      const r = await api.get('/enrollments'); // returns array of enrollments
      return r.data || [];
    },
    staleTime: 1000 * 60,
  });

  // helper: cached signed URL
  async function getSignedUrlForPath(path) {
    if (!path) return null;
    const cache = signedUrlCache.current;
    if (cache.has(path)) return cache.get(path);

    // try explicit bucket if path contains bucket prefix
    if (path.includes('/')) {
      const parts = path.split('/');
      const maybeBucket = parts[0];
      const maybeFile = parts.slice(1).join('/');
      try {
        const { data, error } = await supabase.storage.from(maybeBucket).createSignedUrl(maybeFile, 60 * 60);
        if (!error && data?.signedURL) {
          cache.set(path, data.signedURL);
          return data.signedURL;
        }
      } catch (e) { /* ignore */ }
    }

    // try fallback buckets
    const possibleBuckets = ['course-thumbnails', 'course-assets', 'course-videos', 'public'];
    for (const b of possibleBuckets) {
      try {
        const { data, error } = await supabase.storage.from(b).createSignedUrl(path, 60 * 60);
        if (!error && data?.signedURL) {
          cache.set(path, data.signedURL);
          return data.signedURL;
        }
      } catch (e) { /* ignore */ }
    }

    // try public
    for (const b of possibleBuckets) {
      try {
        const { data } = supabase.storage.from(b).getPublicUrl(path);
        if (data?.publicUrl) {
          cache.set(path, data.publicUrl);
          return data.publicUrl;
        }
      } catch (e) { /* ignore */ }
    }

    return null;
  }

  // 3) enrich courses with completion% and thumbnail_url — run only when user.id or courses change length
  useEffect(() => {
    let cancelled = false;
    if (!user?.id) {
      setCoursesWithMeta([]);
      return;
    }
    if (!courses || courses.length === 0) {
      setCoursesWithMeta([]);
      return;
    }

    (async () => {
      try {
        const enriched = await Promise.all(courses.map(async (c) => {
          // lessons: may be included in course; else fetch
          let lessons = Array.isArray(c.lessons) ? c.lessons : [];
          if ((!Array.isArray(lessons) || lessons.length === 0) && c.id) {
            try {
              const r = await api.get(`/courses/${c.id}`);
              lessons = r.data?.lessons ?? [];
            } catch (e) {
              lessons = [];
            }
          }

          // progress for this user
          let progressItems = [];
          try {
            const p = await api.get(`/progress/${user.id}/${c.id}`);
            if (Array.isArray(p.data)) progressItems = p.data;
            else if (p.data && Array.isArray(p.data.items)) progressItems = p.data.items;
            else if (p.data) progressItems = [p.data];
          } catch (e) {
            progressItems = [];
          }

          // compute completion percent
          const total = lessons.length || 0;
          let completed = 0;
          if (total > 0) {
            const lessonMap = {};
            lessons.forEach(l => { lessonMap[l.id] = l.duration_seconds || 0; });
            progressItems.forEach(pi => {
              const dur = lessonMap[pi.lesson_id] || 0;
              if (pi.is_completed) completed++;
              else if (dur > 0 && (pi.watched_seconds || 0) >= Math.floor(dur * 0.9)) completed++;
            });
          }
          const completion_percent = total === 0 ? 0 : Math.round((completed / total) * 100);

          // thumbnail_url
          let thumbnail_url = null;
          if (c.thumbnail_path) {
            try {
              thumbnail_url = await getSignedUrlForPath(c.thumbnail_path);
            } catch (e) {
              thumbnail_url = null;
            }
          }

          return {
            ...c,
            lessons,
            completion_percent,
            thumbnail_url,
          };
        }));

        if (!cancelled) setCoursesWithMeta(enriched);
      } catch (err) {
        console.error(err);
        if (!cancelled) setCoursesWithMeta(courses);
      }
    })();

    return () => { cancelled = true; };
// depend only on user id and number of courses to avoid infinite loops
  }, [user?.id, courses?.length]);

  // compute purchase counts and trending array (memoized)
  const { trending, others } = useMemo(() => {
    // count purchases per course using enrollments (is_paid true preferred)
    const counts = enrollments.reduce((acc, e) => {
      if (!e || !e.course_id) return acc;
      acc[e.course_id] = (acc[e.course_id] || 0) + 1;
      return acc;
    }, {});

    // combine counts into coursesWithMeta base (if not enriched yet, fallback to courses)
    const base = (coursesWithMeta.length ? coursesWithMeta : courses).map(c => ({
      ...c,
      purchase_count: counts[c.id] || 0
    }));

    // sort desc by purchase_count
    const sorted = [...base].sort((a,b) => (b.purchase_count || 0) - (a.purchase_count || 0));
    const top = sorted.slice(0, 6);
    const rest = sorted.slice(6);
    return { trending: top, others: rest };
  }, [coursesWithMeta, courses, enrollments]);

  // search filter
  const qLower = q.trim().toLowerCase();
  const filteredAll = useMemo(() => {
    if (!qLower) return [...trending, ...others];
    return [...trending, ...others].filter(c => {
      return (c.title || '').toLowerCase().includes(qLower)
        || (c.description || '').toLowerCase().includes(qLower)
        || (c.category || '').toLowerCase().includes(qLower);
    });
  }, [qLower, trending, others]);

  // top trending highlight: choose first trending, else first course, else null
  const hero = trending[0] || coursesWithMeta[0] || null;

  function openCourse(c) {
    router.push(`/courses/${c.id}`);
  }

  if (loading || loadingCourses) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      {/* Search + hero */}
      <div className="grid md:grid-cols-3 gap-6 items-start">
        <div className="md:col-span-2 space-y-4">
          {/* Search */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 text-slate-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search courses, categories..."
                className="w-full pl-10 pr-4 py-3 border rounded-lg"
              />
            </div>

            <button onClick={() => setQ('')} className="px-4 py-3 border rounded-lg">Clear</button>
          </div>

          {/* Hero / Big trending card */}
          {hero && (
            <div onClick={() => openCourse(hero)} className="cursor-pointer rounded-2xl overflow-hidden shadow-lg border hover:shadow-2xl transition grid md:grid-cols-2 items-stretch">
              <div className="p-8 flex flex-col justify-center">
                <div className="text-sm text-amber-500 font-semibold">Trending</div>
                <h2 className="text-3xl md:text-4xl font-extrabold leading-tight mt-3">{hero.title}</h2>
                <p className="text-slate-600 mt-3 line-clamp-3">{hero.description}</p>
                <div className="mt-6 flex items-center gap-3">
                  <button onClick={() => openCourse(hero)} className="px-4 py-2 rounded-lg bg-slate-900 text-white">Explore course</button>
                  <div className="text-sm text-slate-500">Purchased {hero.purchase_count || 0} times</div>
                </div>
              </div>
              <div className="bg-slate-50 flex items-center justify-center">
                <img
                  src={hero.thumbnail_url || '/mnt/data/60d9a7d7-4a5a-4df5-88f5-3b7a6afec244.png'}
                  alt={hero.title}
                  className="w-full h-60 object-cover"
                />
              </div>
            </div>
          )}
        </div>

        {/* Trending small list on right */}
        <aside className="space-y-4">
          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="font-semibold">Trending</div>
              <div className="text-xs text-slate-400">Top picks</div>
            </div>

            <div className="mt-3 space-y-3">
              {trending.length === 0 && <div className="text-sm text-slate-500">No trending courses yet</div>}
              {trending.map(c => (
                <div key={c.id} onClick={() => openCourse(c)} className="cursor-pointer">
                  <CourseCardSmall course={c} onOpen={openCourse} />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <div className="font-semibold">Quick Filters</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {['Web','Data','AI','Design','DevOps'].map(cat => (
                <button key={cat} onClick={() => setQ(cat)} className="px-3 py-1 text-sm border rounded">{cat}</button>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* All courses grid (filtered by search) */}
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">All courses</h3>
          <div className="text-sm text-slate-500">{filteredAll.length} results</div>
        </div>

        <div className="mt-4 grid md:grid-cols-3 gap-6">
          {filteredAll.map(c => (
            <div key={c.id} onClick={() => openCourse(c)} className="cursor-pointer">
              <CourseCardSmall course={c} onOpen={openCourse} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
