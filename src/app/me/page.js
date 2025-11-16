'use client';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useSession } from '@/hooks/useSession';

export default function Me() {
  const { user } = useSession();
  const { data } = useQuery(['me'], async () => (await api.get('/auth/profile')).data, { enabled: !!user });

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold">Profile</h1>
      <div className="mt-4 card">
        <pre>{JSON.stringify(data || user, null, 2)}</pre>
      </div>
    </div>
  );
}
