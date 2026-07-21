import { supabase } from './supabase.js';

// Offener (laufender) Zeiteintrag des Nutzers, falls eingestempelt.
export async function fetchOpenEntry(userId) {
  const { data } = await supabase.from('time_entries')
    .select('id, clock_in, clock_out').eq('user_id', userId).is('clock_out', null)
    .order('clock_in', { ascending: false }).limit(1).maybeSingle();
  return data || null;
}
export async function fetchOpenBreak(timeEntryId) {
  const { data } = await supabase.from('break_entries')
    .select('id, break_start, break_end').eq('time_entry_id', timeEntryId).is('break_end', null)
    .order('break_start', { ascending: false }).limit(1).maybeSingle();
  return data || null;
}
export async function clockInDb(userId) {
  const { data, error } = await supabase.from('time_entries')
    .insert({ user_id: userId }).select('id, clock_in').single();
  if (error) throw error;
  return data;
}
export async function clockOutDb(entryId) {
  await supabase.from('time_entries').update({ clock_out: new Date().toISOString() }).eq('id', entryId);
}
export async function startBreakDb(userId, entryId) {
  const { data, error } = await supabase.from('break_entries')
    .insert({ user_id: userId, time_entry_id: entryId }).select('id, break_start').single();
  if (error) throw error;
  return data;
}
export async function endBreakDb(breakId) {
  await supabase.from('break_entries').update({ break_end: new Date().toISOString() }).eq('id', breakId);
}

// Alle Einträge/Pausen ab einem Zeitpunkt (RLS liefert eigene bzw. für sl/mgmt alle).
export async function fetchEntriesSince(sinceISO) {
  const { data } = await supabase.from('time_entries')
    .select('id, user_id, clock_in, clock_out').gte('clock_in', sinceISO)
    .order('clock_in', { ascending: false });
  return data || [];
}
export async function fetchBreaksSince(sinceISO) {
  const { data } = await supabase.from('break_entries')
    .select('id, user_id, time_entry_id, break_start, break_end').gte('break_start', sinceISO);
  return data || [];
}

// Namen aller sichtbaren Profile (RLS: eigene bzw. für sl/mgmt alle).
export async function fetchProfilesMap() {
  const { data } = await supabase.from('profiles').select('id, username, display_name');
  const map = {};
  (data || []).forEach((p) => { map[p.id] = p.display_name || p.username; });
  return map;
}

// ----- Zeit-Helfer -----
export function startOfWeekISO(d = new Date()) {
  const x = new Date(d);
  const day = (x.getDay() + 6) % 7; // Montag = 0
  x.setHours(0, 0, 0, 0);
  x.setDate(x.getDate() - day);
  return x.toISOString();
}
export function startOfTodayISO(d = new Date()) {
  const x = new Date(d); x.setHours(0, 0, 0, 0); return x.toISOString();
}
// Netto-Minuten eines Eintrags (abzüglich Pausen); offene Einträge zählen bis "now".
export function entryNetMinutes(entry, breaks, now = Date.now()) {
  const inMs = new Date(entry.clock_in).getTime();
  const outMs = entry.clock_out ? new Date(entry.clock_out).getTime() : now;
  let gross = Math.max(0, outMs - inMs);
  const bs = breaks.filter((b) => b.time_entry_id === entry.id);
  let breakMs = 0;
  for (const b of bs) {
    const s = new Date(b.break_start).getTime();
    const e = b.break_end ? new Date(b.break_end).getTime() : now;
    breakMs += Math.max(0, e - s);
  }
  return Math.max(0, Math.round((gross - breakMs) / 60000));
}
export function fmtHM(minutes) {
  const h = Math.floor(minutes / 60), m = minutes % 60;
  return `${h}:${String(m).padStart(2, '0')} h`;
}
export function fmtClock(iso) {
  const d = new Date(iso);
  return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
}
