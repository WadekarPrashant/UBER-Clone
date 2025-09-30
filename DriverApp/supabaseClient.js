import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://phuuoawhormkhdwhpdzs.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBodXVvYXdob3Jta2hkd2hwZHpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3ODIxODcsImV4cCI6MjA3MzM1ODE4N30.c14Y_9vyEUwNgtMpxHkqyKdLzKIXGjNAKgFpl6n44z4";
export const supabase = createClient(supabaseUrl, supabaseKey);
