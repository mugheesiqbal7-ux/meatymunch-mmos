import { createClient } from '@supabase/supabase-js';

// Env-Werte säubern: Leerzeichen/BOM/Zeilenumbrüche und alle Nicht-ASCII-Zeichen
// entfernen. Sonst kann ein unsichtbares Zeichen (z. B. BOM aus der CI) den
// Authorization/apikey-Header ungültig machen ("non ISO-8859-1 code point").
const clean = (s) => String(s ?? '').trim().replace(/[^\x20-\x7E]/g, '');

const url = clean(import.meta.env.VITE_SUPABASE_URL);
const anonKey = clean(import.meta.env.VITE_SUPABASE_ANON_KEY);

// True nur, wenn die Zugangsdaten gesetzt sind (per .env.local lokal bzw. GitHub-Secrets im Build).
export const isSupabaseConfigured = Boolean(url && anonKey);

// Der anon key ist öffentlich unbedenklich — der Datenschutz kommt aus den RLS-Policies.
export const supabase = isSupabaseConfigured ? createClient(url, anonKey) : null;

// Benutzername -> interne E-Mail-Adresse (wir nutzen keine echten Mails).
export const EMAIL_DOMAIN = 'meatymunch.local';
export const usernameToEmail = (username) =>
  `${String(username).trim().toLowerCase()}@${EMAIL_DOMAIN}`;
