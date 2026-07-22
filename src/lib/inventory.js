import { supabase } from './supabase.js';

export async function fetchInventory() {
  const { data } = await supabase
    .from('inventory_items')
    .select('id, name, min_qty, max_qty, current_qty, sort')
    .order('sort', { ascending: true });
  return data || [];
}

// Schreiben nur Management (per RLS).
export async function addItem(item) {
  return supabase.from('inventory_items').insert(item).select().single();
}
export async function updateItem(id, patch) {
  return supabase.from('inventory_items').update({ ...patch, updated_at: new Date().toISOString() }).eq('id', id);
}
export async function deleteItem(id) {
  return supabase.from('inventory_items').delete().eq('id', id);
}

// Status wie im Handbuch (MIN/MAX-System).
export function invStatus(min, current) {
  if (current <= min) return { label: 'kritisch', col: '#b1470f', bg: '#fbe9d6' };
  if (current < min * 1.4) return { label: 'niedrig', col: '#8a6a15', bg: '#f7f0e2' };
  return { label: 'ok', col: '#1c6d3c', bg: '#e8f5ec' };
}
