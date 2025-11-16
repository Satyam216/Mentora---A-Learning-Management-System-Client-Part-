import LandingHero from '@/components/LandingHero';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';

export default function Home() {
  return (
    <div>
      <LandingHero />
      <section className="max-w-6xl mx-auto py-8">
        <h2 className="text-2xl font-semibold">Popular Courses</h2>
        {/* show a few featured cards - lightweight fetch from API via client */}
        <div className="grid md:grid-cols-3 gap-6 mt-4">
          {/* we'll fetch on /courses page; here show placeholders */}
          <div className="card">Featured course 1</div>
          <div className="card">Featured course 2</div>
          <div className="card">Featured course 3</div>
        </div>
      </section>
    </div>
  );
}
