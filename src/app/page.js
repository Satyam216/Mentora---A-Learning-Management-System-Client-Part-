// src/app/page.js (Server Component)
import LandingHero from '@/components/LandingHero';

export default function Home() {
  return (
    <div>
      <LandingHero />
      <section className="max-w-6xl mx-auto py-10">
        <h2 className="text-2xl font-semibold">Popular categories</h2>
        <div className="mt-6 grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card">Web Development</div>
          <div className="card">Data Science</div>
          <div className="card">DevOps</div>
          <div className="card">AI/ML</div>
        </div>
      </section>
    </div>
  );
}
