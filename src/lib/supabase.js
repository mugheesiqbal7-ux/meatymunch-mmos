import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// True nur, wenn die Zugangsdaten gesetzt sind (per .env.local lokal bzw. GitHub-Secrets im Build).
export const isSupabaseConfigured = Boolean(url && anonKey);

// Der anon key ist öffentlich unbedenklich — der Datenschutz kommt aus den RLS-Policies.
export const supabase = isSupabaseConfigured ? createClient(url, anonKey) : null;

// Benutzername -> interne E-Mail-Adresse (wir nutzen keine echten Mails).
export const EMAIL_DOMAIN = 'meatymunch.local';
export const usernameToEmail = (username) =>
  `${String(username).trim().toLowerCase()}@${EMAIL_DOMAIN}`;
