'use client';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useSession } from '@/hooks/useSession';
import Protected from '@/components/Protected';

export default function Me() {
  const { user } = useSession();
  const { data } = useQuery({
    queryKey: ['me', user?.id],
    queryFn: async () => (await api.get(`/auth/profile`)).data,
    enabled: !!user?.id
  });

  return (
    <Protected>
      <pre className="p-4 border rounded">{JSON.stringify({ user, profile: data }, null, 2)}</pre>
    </Protected>
  );
}
