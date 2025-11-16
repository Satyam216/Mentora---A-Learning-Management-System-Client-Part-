'use client';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useSession } from '@/hooks/useSession';

export default function ProfilePage() {
  const { user, loading } = useSession();

  // fetch profile only when we have a user
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['me', user?.id],
    queryFn: async () => {
      const res = await api.get('/auth/profile');
      return res.data;
    },
    enabled: !!user,     // only run when user exists
    retry: 1,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  useEffect(() => {
    // if session changed, refetch profile
    if (user) refetch();
  }, [user, refetch]);

  if (loading) return <div className="p-6">Checking session...</div>;
  if (!user) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <h2 className="text-xl font-semibold">Not signed in</h2>
        <p className="mt-2 text-slate-600">Please <a href="/auth/login" className="underline">login</a> to view your profile.</p>
      </div>
    );
  }

  if (isLoading) return <div className="p-6">Loading profile...</div>;
  if (error) return <div className="p-6 text-red-500">Unable to load profile</div>;

  // data is the profile row returned by /auth/profile
  const profile = data || {};

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold">Your profile</h1>

      <div className="mt-4 card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-1">
            <div className="w-36 h-36 bg-gray-100 rounded-full overflow-hidden flex items-center justify-center">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="text-3xl text-slate-400">{(profile.full_name || profile.email || 'U')[0]}</div>
              )}
            </div>
          </div>

          <div className="col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold">{profile.full_name || profile.email}</div>
                <div className="text-sm text-slate-500 mt-1">{profile.email}</div>
              </div>

              <div className="text-sm text-slate-600">
                Role: <strong className="capitalize">{profile.role || 'student'}</strong>
              </div>
            </div>

            <div className="mt-4 text-sm text-slate-600">
              <p><strong>Joined:</strong> {profile.created_at ? new Date(profile.created_at).toLocaleDateString() : '-'}</p>
              <p className="mt-2">{profile.bio || 'No bio available.'}</p>
            </div>

            <div className="mt-6 flex gap-3">
              <a href="/dashboard" className="px-4 py-2 bg-slate-900 text-white rounded">Go to dashboard</a>
              <a href="/auth/signup" className="px-4 py-2 border rounded">Edit profile</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
