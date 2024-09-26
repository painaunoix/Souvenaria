// supabaseClient.ts
import { createClient } from '@supabase/supabase-js';
import 'cross-fetch/polyfill';

const supabaseUrl = 'https://aeymirmftojbgmpkfbah.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFleW1pcm1mdG9qYmdtcGtmYmFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjcyNDk1OTUsImV4cCI6MjA0MjgyNTU5NX0.2zZVA5TbW-qwR4XojD7B65JZPw8tNjMDnsRJJBRXvZk'; // Trouve-le dans ton tableau de bord Supabase

export const supabase = createClient(supabaseUrl, supabaseAnonKey);