import { supabase } from './supabase.js';

// Ruft die Edge Function "admin-users" auf (nur für Geschäftsführung wirksam).
// Der Auth-Token wird von supabase-js automatisch mitgeschickt.
export async function adminCall(action, payload = {}) {
  if (!supabase) return { error: 'not_configured' };
  const { data, error } = await supabase.functions.invoke('admin-users', {
    body: { action, ...payload },
  });
  if (error) {
    // Fehlermeldung aus der Antwort der Function herausholen, falls vorhanden.
    let msg = error.message || 'error';
    try {
      const ctx = error.context;
      if (ctx && typeof ctx.json === 'function') {
        const body = await ctx.json();
        if (body?.error) msg = body.error;
      }
    } catch { /* ignore */ }
    return { error: msg };
  }
  if (data?.error) return { error: data.error };
  return { data };
}
