import { useState, useEffect, useCallback } from 'react';
import { suppliers, orderCalendar, supplierById, openPoints } from '../data/suppliers.js';
import { fetchSupplierProducts, updateProductPrice, addProduct, deleteProduct, fmtEuro, parseEuro } from '../lib/supplierProducts.js';

const typeStyle = {
  order: { bg: '#fbe9d6', border: '#f0c79a', color: '#b1470f', label: 'Bestellen', icon: '📞' },
  delivery: { bg: '#e8f0fb', border: '#c3d8f0', color: '#2b5f8a', label: 'Lieferung', icon: '🚚' },
  buy: { bg: '#e8f5ec', border: '#bfe3cb', color: '#1c6d3c', label: 'Einkauf', icon: '🛒' },
};

export default function Suppliers({ v }) {
  const { t } = v;
  const jsDow = new Date().getDay(); // 0=So..6=Sa
  const today = orderCalendar.find((d) => d.dow === jsDow) || null;
  const isMgmt = v.role === 'mgmt';

  const [products, setProducts] = useState(null);
  const reload = useCallback(async () => { setProducts(await fetchSupplierProducts()); }, []);
  useEffect(() => { reload(); }, [reload]);
  const bySupplier = (products || []).reduce((acc, p) => { (acc[p.supplier] ||= []).push(p); return acc; }, {});
  const orderTasksToday = today ? today.tasks.filter((x) => x.type === 'order') : [];

  return (
    <div style={{ animation: 'mmfade .3s ease', maxWidth: '900px' }}>
      <button onClick={v.backBetrieb} style={v.backBtnStyle}>← {t.back}</button>
      <h1 style={{ fontFamily: 'Archivo', fontWeight: 800, fontSize: 'clamp(24px,4vw,32px)', margin: '14px 0 4px', color: '#17130f', letterSpacing: '-.02em' }}>{t.sup_h}</h1>
      <div style={{ fontSize: '14px', color: '#7c756c', marginBottom: '18px' }}>{t.sup_sub}</div>

      {/* HEUTE — was ansteht */}
      <div style={{ background: 'linear-gradient(110deg,#1e1813,#2c221a)', color: '#f6f3ee', borderRadius: '18px', padding: '22px 24px', marginBottom: '18px' }}>
        <div style={{ font: "600 11px 'IBM Plex Mono'", letterSpacing: '.14em', textTransform: 'uppercase', color: '#f5a11f', marginBottom: '6px' }}>{t.sup_today} · {today ? today.day : t.sup_closed}</div>
        {orderTasksToday.length > 0 ? (
          <>
            <div style={{ fontFamily: 'Archivo', fontWeight: 800, fontSize: '20px', marginBottom: '14px' }}>{t.sup_today_todo}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {orderTasksToday.map((task, i) => {
                const s = supplierById[task.supplierId];
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(240,127,19,.12)', border: '1px solid rgba(240,127,19,.35)', borderRadius: '12px', padding: '13px 16px' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: s.color, flex: 'none' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '15px' }}>{s.name}</div>
                      <div style={{ fontSize: '13px', color: 'rgba(246,243,238,.7)' }}>{task.text}</div>
                    </div>
                    <span style={{ fontSize: '18px' }}>📞</span>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div style={{ fontSize: '15px', color: 'rgba(246,243,238,.75)' }}>{today ? t.sup_today_none : t.sup_today_closed}</div>
        )}
        {/* zusätzliche Infos heute (Lieferung/Einkauf) */}
        {today && today.tasks.some((x) => x.type !== 'order') && (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '14px' }}>
            {today.tasks.filter((x) => x.type !== 'order').map((task, i) => {
              const s = supplierById[task.supplierId];
              return <span key={i} style={{ font: "600 11px 'Inter'", background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.12)', borderRadius: '20px', padding: '5px 11px', color: 'rgba(246,243,238,.8)' }}>{typeStyle[task.type].icon} {s.name}: {task.text}</span>;
            })}
          </div>
        )}
      </div>

      {/* Bestellkalender */}
      <div style={{ font: "600 11px 'IBM Plex Mono'", letterSpacing: '.12em', textTransform: 'uppercase', color: '#7c756c', margin: '4px 0 10px' }}>{t.sup_calendar}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,150px),1fr))', gap: '10px', marginBottom: '22px' }}>
        {orderCalendar.map((d) => {
          const isToday = d.dow === jsDow;
          return (
            <div key={d.short} style={{ background: '#fff', border: `1px solid ${isToday ? '#f07f13' : '#e4ded4'}`, borderRadius: '14px', overflow: 'hidden', boxShadow: isToday ? '0 6px 18px rgba(240,127,19,.14)' : 'none' }}>
              <div style={{ padding: '9px 13px', background: isToday ? '#f07f13' : '#faf7f2', color: isToday ? '#17130f' : '#17130f', font: "800 13px 'Archivo'", borderBottom: '1px solid #f0eae0' }}>{d.day}</div>
              <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '7px' }}>
                {d.tasks.map((task, i) => {
                  const s = supplierById[task.supplierId];
                  const ts = typeStyle[task.type];
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '7px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: s.color, flex: 'none', marginTop: '4px' }} />
                      <div style={{ fontSize: '12px', lineHeight: 1.35 }}>
                        <span style={{ fontWeight: 700, color: '#17130f' }}>{s.name}</span>
                        <span style={{ color: task.type === 'order' ? ts.color : '#7c756c', fontWeight: task.type === 'order' ? 600 : 400 }}> · {task.text}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Lieferanten mit Sortiment & Preisen */}
      <div style={{ font: "600 11px 'IBM Plex Mono'", letterSpacing: '.12em', textTransform: 'uppercase', color: '#7c756c', margin: '4px 0 10px' }}>{t.sup_list}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {suppliers.map((s) => (
          <SupplierCard key={s.id} s={s} products={bySupplier[s.id]} isMgmt={isMgmt} reload={reload} showToast={v.showToast} t={t} />
        ))}
      </div>

      {/* Offene Punkte */}
      <div style={{ background: '#f7f0e2', border: '1px solid #e5d6b3', borderLeft: '3px solid #b8912e', borderRadius: '12px', padding: '16px 18px', marginTop: '18px' }}>
        <div style={{ font: "600 11px 'IBM Plex Mono'", letterSpacing: '.12em', textTransform: 'uppercase', color: '#8a6a15', marginBottom: '8px' }}>{t.sup_open}</div>
        {openPoints.map((p, i) => (
          <div key={i} style={{ fontSize: '13.5px', color: '#5c5340', lineHeight: 1.5, marginBottom: '4px' }}>• {p}</div>
        ))}
      </div>
    </div>
  );
}

function SupplierCard({ s, products, isMgmt, reload, showToast, t }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({});
  const [busy, setBusy] = useState(false);

  const list = products || [];

  function startEdit() {
    const d = {};
    list.forEach((p) => { d[p.id] = (p.price_cents / 100).toFixed(2).replace('.', ','); });
    setDraft(d);
    setEditing(true);
  }

  async function save() {
    setBusy(true);
    for (const p of list) {
      const cents = parseEuro(draft[p.id]);
      if (cents != null && cents !== p.price_cents) {
        const { error } = await updateProductPrice(p.id, cents);
        if (error) { showToast(error.message); setBusy(false); return; }
      }
    }
    await reload();
    setBusy(false);
    setEditing(false);
    showToast(t.sup_saved);
  }

  async function addRow() {
    const name = window.prompt(t.sup_add_name);
    if (!name) return;
    const artNo = window.prompt(t.sup_add_artno) || null;
    const priceStr = window.prompt(t.sup_add_price) || '0';
    const { error } = await addProduct({ supplier: s.id, art_no: artNo, name, price_cents: parseEuro(priceStr) || 0, sort: (list.length + 1) });
    if (error) { showToast(error.message); return; }
    await reload();
    showToast(t.sup_added);
  }

  async function removeRow(p) {
    if (!window.confirm(t.sup_delete_confirm + '\n\n' + p.name)) return;
    const { error } = await deleteProduct(p.id);
    if (error) { showToast(error.message); return; }
    await reload();
  }

  return (
    <div style={{ background: '#fff', border: '1px solid #e4ded4', borderRadius: '16px', overflow: 'hidden', borderTop: `3px solid ${s.color}` }}>
      <div style={{ padding: '16px 18px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '180px' }}>
          <div style={{ fontFamily: 'Archivo', fontWeight: 800, fontSize: '19px', color: '#17130f' }}>{s.name}</div>
          <div style={{ font: "600 11px 'IBM Plex Mono'", color: s.color, marginTop: '3px' }}>{s.rhythm}</div>
          <div style={{ fontSize: '13px', color: '#7c756c', marginTop: '8px', display: 'flex', gap: '7px' }}><span>📅</span><span>{s.order}</span></div>
        </div>
        {isMgmt && !editing && list.length > 0 && (
          <button onClick={startEdit} className="mm-press" style={miniBtn}>✏️ {t.sup_edit}</button>
        )}
      </div>

      <div style={{ borderTop: '1px solid #f0eae0', padding: '10px 12px 14px' }}>
        <div style={{ font: "600 10px 'IBM Plex Mono'", letterSpacing: '.1em', textTransform: 'uppercase', color: '#a49c90', margin: '4px 6px 6px' }}>{t.sup_products} {products == null ? '…' : `· ${list.length}`}</div>

        {products == null && <div style={{ padding: '8px', color: '#a49c90', fontSize: '13px' }}>{t.time_loading}</div>}

        {list.map((p) => (
          <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 6px', borderBottom: '1px solid #f4efe6' }}>
            {p.art_no && <span style={{ font: "500 11px 'IBM Plex Mono'", color: '#a49c90', width: '92px', flex: 'none', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.art_no}</span>}
            <span style={{ flex: 1, fontSize: '13.5px', color: '#2a2620', lineHeight: 1.3 }}>{p.name}</span>
            {editing ? (
              <input value={draft[p.id] ?? ''} onChange={(e) => setDraft((d) => ({ ...d, [p.id]: e.target.value }))} inputMode="decimal" style={{ width: '74px', flex: 'none', background: '#faf7f2', border: '1px solid #e4ded4', borderRadius: '8px', padding: '6px 8px', fontSize: '13px', textAlign: 'right', fontFamily: "'IBM Plex Mono', monospace" }} />
            ) : (
              <span style={{ font: "700 13px 'IBM Plex Mono'", color: '#17130f', width: '74px', flex: 'none', textAlign: 'right' }}>{fmtEuro(p.price_cents)}</span>
            )}
            {editing && <button onClick={() => removeRow(p)} className="mm-press" aria-label="Löschen" style={{ background: 'transparent', border: 'none', color: '#b1470f', cursor: 'pointer', fontSize: '16px', flex: 'none', padding: '2px 4px' }}>×</button>}
          </div>
        ))}

        {editing && (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px', padding: '0 6px' }}>
            <button onClick={save} disabled={busy} className="mm-press" style={{ ...miniBtn, background: '#f07f13', color: '#17130f', border: 'none', opacity: busy ? 0.7 : 1 }}>{busy ? '…' : '✓ ' + t.sup_save}</button>
            <button onClick={() => setEditing(false)} className="mm-press" style={miniBtn}>{t.sup_cancel}</button>
            <button onClick={addRow} className="mm-press" style={miniBtn}>+ {t.sup_add}</button>
          </div>
        )}
      </div>
    </div>
  );
}

const miniBtn = { background: '#f4f1ec', border: '1px solid #e4ded4', borderRadius: '8px', padding: '7px 13px', font: "700 12.5px Inter", color: '#17130f', cursor: 'pointer', whiteSpace: 'nowrap' };
