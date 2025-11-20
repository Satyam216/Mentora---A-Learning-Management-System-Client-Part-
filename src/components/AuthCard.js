// src/components/AuthCard.js
'use client';
import { supabase } from '@/lib/supabase';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// AuthCard: supports signup & login with role validation
export default function AuthCard({ mode = 'login', fixedRole = null }) {
  const r = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState(fixedRole || 'student'); // used for signup
  const [loginAs, setLoginAs] = useState('student'); // UI choice for login
  const [loading, setLoading] = useState(false);

  // Helper: redirect based on role
  function redirectByRole(roleStr) {
    if (roleStr === 'instructor') r.push('/dashboard/instructor');
    else if (roleStr === 'admin') r.push('/dashboard/admin');
    else r.push('/dashboard');
  }

  // LOGIN handler with role verification
  const doLogin = async (e) => {
    e?.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;

      const access_token = data?.session?.access_token;
      if (!access_token) {
        // this can happen if email confirmation is required: still, check user object
        // fallback: try to get user and continue (but role-check will rely on backend profile)
      }

      // Fetch profile from backend using the access token so backend can verify and return profile row
      // api should attach header (see lib/api), but we pass it explicitly for safety
      let profile = null;
      try {
        const res = await api.get('/auth/profile', {
          headers: access_token ? { Authorization: `Bearer ${access_token}` } : {}
        });
        profile = res.data;
      } catch (pErr) {
        // if profile fetch fails, sign out and show message
        await supabase.auth.signOut();
        throw new Error(pErr?.response?.data?.error || 'Unable to fetch profile after login. Contact support.');
      }

      // Check role existence
      const actualRole = profile?.role;
      if (!actualRole) {
        await supabase.auth.signOut();
        throw new Error('Your account does not have a role set. Please contact support or create a new account with the correct role.');
      }

      // Compare chosen loginAs with actual role
      if (actualRole !== loginAs) {
        // mismatch: sign out and show friendly message
        await supabase.auth.signOut();
        throw new Error(`Role mismatch — you attempted to login as "${loginAs}" but this account is registered as "${actualRole}". Please login with the correct role or create a new account.`);
      }

      // Role matches => redirect to appropriate dashboard
      redirectByRole(actualRole);
    } catch (err) {
      const msg = err?.message || err?.response?.data?.error || 'Login failed';
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  // SIGNUP handler: creates supabase user with role in user metadata
  const doSignup = async (e) => {
    e?.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name, role }
        }
      });
      if (error) throw error;

      // NOTE:
      // - Often Supabase creates a profile row via DB trigger (auth.users -> profiles). If you don't have that,
      //   you should upsert profile from your backend (server side) using service role.
      // - If you want immediate profile upsert from the client, you'd need a backend endpoint that creates the profile using the service role.
      //
      // Example (optional):
      // await api.post('/auth/profile/upsert', { id: data.user.id, full_name: name, role }, { headers: { Authorization: `Bearer ${serviceRoleToken}` } });

      alert('Account created — check email (if confirmation is enabled). You will be redirected to login.');
      r.push('/auth/login');
    } catch (err) {
      const msg = err?.message || err?.response?.data?.error || 'Signup failed';
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth: note role-check must be handled after redirect (in callback page)
  const signGoogle = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/auth/callback'
        }
      });
    } catch (err) {
      alert(err?.message || 'Google sign-in failed');
    }
  };

  return (
    <div className="max-w-md mx-auto card">
      <form className="space-y-4" onSubmit={mode === 'login' ? doLogin : doSignup}>
        {mode === 'signup' && (
          <>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="w-full border p-2 rounded"
              required
            />
            {/* Role select */}
            <div className="flex gap-3 items-center text-sm">
              <label className="flex items-center gap-2">
                <input type="radio" name="role" checked={role === 'student'} onChange={() => setRole('student')} /> Student
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="role" checked={role === 'instructor'} onChange={() => setRole('instructor')} /> Instructor
              </label>
            </div>
          </>
        )}

        {mode === 'login' && (
          <div className="text-sm mb-2">
            <label className="mr-3">
              <input type="radio" name="loginAs" checked={loginAs === 'student'} onChange={() => setLoginAs('student')} /> Login as Student
            </label>
            <label className="ml-3">
              <input type="radio" name="loginAs" checked={loginAs === 'instructor'} onChange={() => setLoginAs('instructor')} /> Login as Instructor
            </label>
          </div>
        )}

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
          className="w-full border p-2 rounded"
          required
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          className="w-full border p-2 rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-slate-900 text-white p-2 rounded"
          disabled={loading}
        >
          {loading ? 'Please wait...' : (mode === 'login' ? 'Login' : 'Create account')}
        </button>
      </form>

      <div className="mt-3 border-t pt-3">
        <button onClick={signGoogle} className="w-full px-3 py-2 rounded border flex items-center justify-center gap-2 bg-white">
          <img src="/icons/google.svg" alt="Google" className="w-5 h-5" />
          Continue with Google
        </button>
      </div>
    </div>
  );
}
