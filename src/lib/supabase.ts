import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dpcgljxsbirnvsemziow.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwY2dsanhzYmlybnZzZW16aW93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM3NjMyNzYsImV4cCI6MjA0OTMzOTI3Nn0.7lz1coLyviaVWqlUybQDp3aDLze6-ItLom5QMVpiW1c';

export const supabase = createClient(supabaseUrl, supabaseKey);