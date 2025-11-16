'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function LandingHero() {
  return (
    <section className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center py-12">
      <div>
        <motion.h1 initial={{x:-40,opacity:0}} animate={{x:0,opacity:1}} transition={{duration:.6}} className="text-4xl font-extrabold leading-tight">
          Build skills that matter. Learn from the best teachers worldwide.
        </motion.h1>
        <motion.p initial={{x:-20,opacity:0}} animate={{x:0,opacity:1}} transition={{delay:.12}} className="mt-4 text-slate-600">
          Interactive video courses, quizzes, progress tracking and certificates. Start your journey with one click.
        </motion.p>
        <div className="mt-6 flex gap-3">
          <Link href="/courses" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white">
            Browse Courses <ArrowRight size={16}/>
          </Link>
          <Link href="/auth/signup" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-slate-700">
            Get Started
          </Link>
        </div>
      </div>

      <motion.div initial={{scale:.98,opacity:0}} animate={{scale:1,opacity:1}} transition={{duration:.7}}>
        <div className="rounded-2xl overflow-hidden shadow-1xl">
          <img src="/assets/hero.png" alt="learning" className="w-full h-[520px] object-cover" />
        </div>
      </motion.div>
    </section>
  );
}
