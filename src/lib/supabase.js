import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lgorjcjmmmhkunmpkyqy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxnb3JqY2ptbW1oa3VubXBreXF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIwNjIzODAsImV4cCI6MjA0NzYzODM4MH0.zaPi5kEWhIHtAk5p4iRVdqGVTllCxb-PoX4uG3oEpQY';

export const supabase = createClient(supabaseUrl, supabaseKey);
