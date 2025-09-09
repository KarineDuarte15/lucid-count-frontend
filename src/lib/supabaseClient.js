import { createClient } from '@supabase/supabase-js'

// Substitua com os seus próprios valores do painel do Supabase!
const supabaseUrl = 'https://pqrtsbnxprgvztxwphxn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxcnRzYm54cHJndnp0eHdwaHhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NDA3NDEsImV4cCI6MjA3MDUxNjc0MX0.96rs0l8zd9pWCv_SNiGTe991dehrVxMJyCsrjydDHoc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);