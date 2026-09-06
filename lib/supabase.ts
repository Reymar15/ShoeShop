import { createClient } from "@supabase/supabase-js";

// `createClient` expects the project URL, not its REST endpoint. Accept either
// form so a URL copied from the Supabase REST API settings still works.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(
  /\/rest\/v1\/?$/,
  ""
);
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase =
  supabaseUrl &&
  supabaseAnonKey &&
  /^https?:\/\//.test(supabaseUrl)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;
