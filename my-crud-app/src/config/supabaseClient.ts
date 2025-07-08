import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://nxjhayipmnencjyvgucn.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54amhheWlwbW5lbmNqeXZndWNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3ODQ1NTcsImV4cCI6MjA2NzM2MDU1N30.mmVmCAwsciWW-tG8buNINBsXAaUQu0g_0OyYo96jE8E"

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase
        