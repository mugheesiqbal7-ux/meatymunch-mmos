// Edge Function: admin-users
// Nur für Geschäftsführung (role = 'mgmt'). Legt Konten an, ändert Rollen/Passwörter,
// aktiviert/deaktiviert. Hält den geheimen service_role key — der bleibt IMMER hier,
// niemals im Frontend.
//
// Aktionen (JSON body): { action, ... }
//   create      { username, display_name, password, role }
//   set_role    { user_id, role }
//   set_password{ user_id, password }
//   set_active  { user_id, active }
//   list        {}
//
// Deploy: Supabase Dashboard → Edge Functions → New function "admin-users" → Code einfügen → Deploy.
// SUPABASE_URL und SUPABASE_SERVICE_ROLE_KEY werden von Supabase automatisch bereitgestellt.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const EMAIL_DOMAIN = 'meatymunch.local';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

  const url = Deno.env.get('SUPABASE_URL')!;
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const admin = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });

  // 1) Aufrufer identifizieren
  const authHeader = req.headers.get('Authorization') ?? '';
  const token = authHeader.replace('Bearer ', '');
  if (!token) return json({ error: 'no_token' }, 401);

  const { data: userData, error: userErr } = await admin.auth.getUser(token);
  if (userErr || !userData?.user) return json({ error: 'invalid_token' }, 401);

  // 2) Rolle des Aufrufers prüfen — muss mgmt sein
  const { data: caller } = await admin
    .from('profiles').select('role').eq('id', userData.user.id).single();
  if (!caller || caller.role !== 'mgmt') return json({ error: 'forbidden' }, 403);

  // 3) Aktion ausführen
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return json({ error: 'bad_json' }, 400); }
  const action = String(body.action ?? '');

  try {
    if (action === 'create') {
      const username = String(body.username ?? '').trim().toLowerCase();
      const display_name = String(body.display_name ?? '').trim();
      const password = String(body.password ?? '');
      const role = String(body.role ?? 'ma');
      if (!username || !password) return json({ error: 'missing_fields' }, 400);
      if (!/^[a-z0-9._-]{3,32}$/.test(username)) return json({ error: 'bad_username' }, 400);
      if (password.length < 6) return json({ error: 'weak_password' }, 400);
      if (!['ma', 'sl', 'mgmt'].includes(role)) return json({ error: 'bad_role' }, 400);

      const { data, error } = await admin.auth.admin.createUser({
        email: `${username}@${EMAIL_DOMAIN}`,
        password,
        email_confirm: true,
        user_metadata: { username, display_name, role },
      });
      if (error) return json({ error: error.message }, 400);
      return json({ ok: true, user_id: data.user?.id });
    }

    if (action === 'set_role') {
      const user_id = String(body.user_id ?? '');
      const role = String(body.role ?? '');
      if (!user_id || !['ma', 'sl', 'mgmt'].includes(role)) return json({ error: 'bad_input' }, 400);
      const { error } = await admin.from('profiles').update({ role }).eq('id', user_id);
      if (error) return json({ error: error.message }, 400);
      return json({ ok: true });
    }

    if (action === 'set_password') {
      const user_id = String(body.user_id ?? '');
      const password = String(body.password ?? '');
      if (!user_id || password.length < 6) return json({ error: 'bad_input' }, 400);
      const { error } = await admin.auth.admin.updateUserById(user_id, { password });
      if (error) return json({ error: error.message }, 400);
      return json({ ok: true });
    }

    if (action === 'set_active') {
      const user_id = String(body.user_id ?? '');
      const active = Boolean(body.active);
      if (!user_id) return json({ error: 'bad_input' }, 400);
      // Login sperren/entsperren via Ban-Dauer + active-Flag im Profil
      await admin.auth.admin.updateUserById(user_id, { ban_duration: active ? 'none' : '876000h' });
      const { error } = await admin.from('profiles').update({ active }).eq('id', user_id);
      if (error) return json({ error: error.message }, 400);
      return json({ ok: true });
    }

    if (action === 'list') {
      const { data, error } = await admin
        .from('profiles').select('id, username, display_name, role, active, created_at')
        .order('created_at', { ascending: true });
      if (error) return json({ error: error.message }, 400);
      return json({ ok: true, users: data });
    }

    return json({ error: 'unknown_action' }, 400);
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});
