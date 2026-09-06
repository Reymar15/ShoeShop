import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (
  !supabaseUrl ||
  !supabaseAnonKey ||
  !/^https?:\/\//.test(supabaseUrl)
) {
  throw new Error(
    "Missing or invalid Supabase config. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local with your real Supabase project values."
  );
}

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);