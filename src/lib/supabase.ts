import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export { supabase };

// Only export auth helpers if supabase is properly configured
const isConfigured = supabaseUrl && supabaseKey && !supabaseUrl.includes('your-project-id') && !supabaseKey.includes('your-supabase-anon-key');

// Auth helpers
export const signUp = async (email: string, password: string, fullName: string) => {
  if (!isConfigured) {
    return { data: null, error: { message: 'Please configure Supabase credentials in your .env file' } };
  }
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  if (!isConfigured) {
    return { data: null, error: { message: 'Please configure Supabase credentials in your .env file' } };
  }
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  if (!isConfigured) {
    return { error: null };
  }
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  if (!isConfigured) {
    return null;
  }
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};