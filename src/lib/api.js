import axios from 'axios';
import { supabase } from './supabase';

export const api = axios.create({
  baseURL: (process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000'),
   timeout: 15000,
});

// attach supabase access token
api.interceptors.request.use(async (config) => {
  // prefer supabase session token (Google / email-password)
  const { data } = await supabase.auth.getSession();
  const token = data?.session?.access_token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    // fallback: try local_jwt (if you use /local)
    if (typeof window !== 'undefined') {
      const local = localStorage.getItem('local_jwt');
      if (local) config.headers.Authorization = `Bearer ${local}`;
    }
  }
  return config;
});
