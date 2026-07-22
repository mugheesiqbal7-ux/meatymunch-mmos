import { supabase } from './supabase.js';

export async function fetchSupplierProducts() {
  const { data } = await supabase
    .from('supplier_products')
    .select('id, supplier, art_no, name, price_cents, sort')
    .order('supplier', { ascending: true })
    .order('sort', { ascending: true });
  return data || [];
}

// Nur Management (per RLS abgesichert).
export async function updateProductPrice(id, priceCents) {
  return supabase.from('supplier_products')
    .update({ price_cents: priceCents, updated_at: new Date().toISOString() })
    .eq('id', id);
}

export async function addProduct({ supplier, art_no, name, price_cents, sort }) {
  return supabase.from('supplier_products')
    .insert({ supplier, art_no: art_no || null, name, price_cents: price_cents || 0, sort: sort || 999 })
    .select().single();
}

export async function deleteProduct(id) {
  return supabase.from('supplier_products').delete().eq('id', id);
}

export function fmtEuro(cents) {
  return (cents / 100).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
}
export function parseEuro(str) {
  const n = parseFloat(String(str).replace(/[^0-9.,]/g, '').replace(',', '.'));
  return isNaN(n) ? null : Math.round(n * 100);
}
