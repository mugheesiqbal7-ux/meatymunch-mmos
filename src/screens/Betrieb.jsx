import { useState, useEffect, useCallback } from 'react';
import { CheckMark } from './Icons.jsx';
import { fetchInventory, addItem, updateItem, deleteItem, invStatus } from '../lib/inventory.js';

export function BetriebLanding({ v }) {
  const { t } = v;
  return (
    <div style={{ animation: 'mmfade .3s ease' }}>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ font: "600 12px 'IBM Plex Mono'", letterSpacing: '.12em', textTransform: 'uppercase', color: '#b8912e' }}>{t.nav_betrieb}</div>
        <h1 style={{ fontFamily: 'Archivo', fontWeight: 800, fontSize: 'clamp(24px,4vw,34px)', margin: '6px 0 0', color: '#17130f', letterSpacing: '-.02em' }}>{t.betrieb_h}</h1>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,240px),1fr))', gap: '14px' }}>
        {v.betriebTiles.map((b, i) => (
          <button key={i} onClick={b.open} style={{ textAlign: 'left', background: '#fff', border: '1px solid #e4ded4', borderRadius: '16px', padding: '22px 20px', cursor: 'pointer', transition: '.15s' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: b.tint, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginBottom: '14px' }}>{b.icon}</div>
            <div style={{ fontFamily: 'Archivo', fontWeight: 800, fontSize: '18px', color: '#17130f' }}>{b.title}</div>
            <div style={{ fontSize: '13px', color: '#7c756c', marginTop: '4px', lineHeight: 1.45 }}>{b.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

export function BetriebShift({ v }) {
  const { t } = v;
  return (
    <div style={{ animation: 'mmfade .3s ease', maxWidth: '760px' }}>
      <button onClick={v.backBetrieb} style={v.backBtnStyle}>← {t.back}</button>
      <h1 style={{ fontFamily: 'Archivo', fontWeight: 800, fontSize: 'clamp(24px,4vw,32px)', margin: '14px 0 4px', color: '#17130f', letterSpacing: '-.02em' }}>{t.b_shift}</h1>
      <div style={{ fontSize: '14px', color: '#7c756c', marginBottom: '18px' }}>{t.opening_hours}: Mo–Sa · 10:30–20:00</div>
      <div style={{ background: '#fff', border: '1px solid #e4ded4', borderRadius: '16px', overflow: 'hidden' }}>
        {v.shifts.map((d, i) => (
          <div key={i} style={d.rowStyle}>
            <div style={{ width: '120px', flex: 'none' }}>
              <div style={{ fontWeight: 700, color: '#17130f' }}>{d.day}</div>
              <div style={{ font: "500 11px 'IBM Plex Mono'", color: '#a49c90' }}>{d.date}</div>
            </div>
            <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {d.slots.map((sl, j) => (<span key={j} style={sl.style}>{sl.name} · {sl.time}</span>))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function BetriebSick({ v }) {
  const { t } = v;
  return (
    <div style={{ animation: 'mmfade .3s ease', maxWidth: '560px' }}>
      <button onClick={v.backBetrieb} style={v.backBtnStyle}>← {t.back}</button>
      <h1 style={{ fontFamily: 'Archivo', fontWeight: 800, fontSize: 'clamp(24px,4vw,32px)', margin: '14px 0 4px', color: '#17130f', letterSpacing: '-.02em' }}>{t.b_sick}</h1>
      <div style={{ fontSize: '14px', color: '#7c756c', marginBottom: '18px' }}>{t.sick_sub}</div>
      <div style={{ background: '#fff', border: '1px solid #e4ded4', borderRadius: '16px', padding: '22px' }}>
        <label style={v.labelStyle}>{t.sick_from}</label>
        <input type="date" value={v.sickFrom} onChange={v.onSickFrom} style={v.inputStyle} />
        <label style={v.labelStyle}>{t.sick_to}</label>
        <input type="date" value={v.sickTo} onChange={v.onSickTo} style={v.inputStyle} />
        <label style={v.labelStyle}>{t.sick_reason}</label>
        <textarea value={v.sickReason} onChange={v.onSickReason} placeholder={t.sick_ph} style={v.textareaStyle} />
        <button onClick={v.submitSick} style={v.primaryBtnStyle}>{t.submit}</button>
      </div>
      {v.hasSick && (
        <div style={{ marginTop: '18px' }}>
          <div style={{ font: "600 11px 'IBM Plex Mono'", letterSpacing: '.12em', textTransform: 'uppercase', color: '#7c756c', marginBottom: '8px' }}>{t.sick_list}</div>
          {v.sickList.map((s, i) => (
            <div key={i} style={{ background: '#fff', border: '1px solid #e4ded4', borderRadius: '12px', padding: '14px 16px', marginBottom: '8px' }}>
              <div style={{ fontWeight: 600, color: '#17130f' }}>{s.range}</div>
              <div style={{ fontSize: '13px', color: '#7c756c', marginTop: '2px' }}>{s.reason}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const numOr = (s, fb) => { const n = parseFloat(String(s).replace(',', '.')); return isNaN(n) ? fb : n; };
const invBtn = { background: '#f4f1ec', border: '1px solid #e4ded4', borderRadius: '8px', padding: '7px 13px', font: "700 12.5px Inter", color: '#17130f', cursor: 'pointer', whiteSpace: 'nowrap' };

export function BetriebInventory({ v }) {
  const { t } = v;
  const isMgmt = v.role === 'mgmt';
  const [items, setItems] = useState(null);
  const [ordered, setOrdered] = useState({});
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({});
  const [busy, setBusy] = useState(false);

  const reload = useCallback(async () => { setItems(await fetchInventory()); }, []);
  useEffect(() => { reload(); }, [reload]);

  function order(it) {
    setOrdered((o) => ({ ...o, [it.id]: true }));
    v.showToast(t.ordered + ': ' + it.name);
  }

  function startEdit() {
    const d = {};
    (items || []).forEach((i) => { d[i.id] = { name: i.name, min_qty: String(i.min_qty), max_qty: String(i.max_qty), current_qty: String(i.current_qty) }; });
    setDraft(d); setEditing(true);
  }
  async function save() {
    setBusy(true);
    for (const i of items) {
      const d = draft[i.id]; if (!d) continue;
      const patch = { name: d.name.trim(), min_qty: numOr(d.min_qty, i.min_qty), max_qty: numOr(d.max_qty, i.max_qty), current_qty: numOr(d.current_qty, i.current_qty) };
      if (patch.name !== i.name || patch.min_qty !== i.min_qty || patch.max_qty !== i.max_qty || patch.current_qty !== i.current_qty) {
        const { error } = await updateItem(i.id, patch);
        if (error) { v.showToast(error.message); setBusy(false); return; }
      }
    }
    await reload(); setBusy(false); setEditing(false); v.showToast(t.inv_saved);
  }
  async function addRow() {
    const name = window.prompt(t.inv_add_name); if (!name) return;
    const min = numOr(window.prompt(t.inv_add_min) || '0', 0);
    const max = numOr(window.prompt(t.inv_add_max) || '0', 0);
    const cur = numOr(window.prompt(t.inv_add_cur) || '0', 0);
    const { error } = await addItem({ name, min_qty: min, max_qty: max, current_qty: cur, sort: (items ? items.length + 1 : 1) });
    if (error) { v.showToast(error.message); return; }
    await reload(); v.showToast(t.inv_added);
  }
  async function removeRow(it) {
    if (!window.confirm(t.inv_delete_confirm + '\n\n' + it.name)) return;
    const { error } = await deleteItem(it.id);
    if (error) { v.showToast(error.message); return; }
    await reload();
  }

  const cellNum = { width: '58px', textAlign: 'center', background: '#faf7f2', border: '1px solid #e4ded4', borderRadius: '7px', padding: '6px 4px', fontSize: '13px', fontFamily: "'IBM Plex Mono', monospace" };

  return (
    <div style={{ animation: 'mmfade .3s ease', maxWidth: '760px' }}>
      <button onClick={v.backBetrieb} style={v.backBtnStyle}>← {t.back}</button>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '10px', margin: '14px 0 4px' }}>
        <h1 style={{ fontFamily: 'Archivo', fontWeight: 800, fontSize: 'clamp(24px,4vw,32px)', margin: 0, color: '#17130f', letterSpacing: '-.02em' }}>{t.b_inv}</h1>
        {isMgmt && !editing && <button onClick={startEdit} className="mm-press" style={invBtn}>✏️ {t.inv_edit}</button>}
      </div>
      <div style={{ fontSize: '14px', color: '#7c756c', marginBottom: '18px' }}>{t.inv_sub}</div>

      <div style={{ background: '#fff', border: '1px solid #e4ded4', borderRadius: '16px', overflow: 'hidden' }}>
        <div style={{ display: 'flex', padding: '11px 18px', background: '#faf7f2', borderBottom: '2px solid #17130f', font: "600 10.5px 'IBM Plex Mono'", letterSpacing: '.1em', textTransform: 'uppercase', color: '#7c756c' }}>
          <span style={{ flex: 1 }}>{t.article}</span>
          <span style={{ width: '62px', textAlign: 'center' }}>MIN</span>
          <span style={{ width: '62px', textAlign: 'center' }}>MAX</span>
          <span style={{ width: '66px', textAlign: 'center' }}>{t.stock}</span>
          <span style={{ width: editing ? '36px' : '110px' }} />
        </div>

        {items == null && <div style={{ padding: '16px 18px', color: '#a49c90' }}>{t.time_loading}</div>}
        {items != null && items.length === 0 && <div style={{ padding: '16px 18px', color: '#a49c90', fontSize: '14px' }}>{t.inv_empty}</div>}

        {(items || []).map((i) => {
          const st = invStatus(Number(i.min_qty), Number(i.current_qty));
          const critical = Number(i.current_qty) <= Number(i.min_qty);
          const ord = ordered[i.id];
          const d = draft[i.id] || {};
          return (
            <div key={i.id} style={{ display: 'flex', alignItems: 'center', padding: '10px 18px', borderBottom: '1px solid #f0eae0', gap: '4px' }}>
              <span style={{ flex: 1, minWidth: 0 }}>
                {editing ? (
                  <input value={d.name ?? ''} onChange={(e) => setDraft((x) => ({ ...x, [i.id]: { ...x[i.id], name: e.target.value } }))} style={{ width: '100%', background: '#faf7f2', border: '1px solid #e4ded4', borderRadius: '7px', padding: '6px 8px', fontSize: '13px' }} />
                ) : (<>
                  <span style={{ display: 'block', fontWeight: 600, color: '#17130f', fontSize: '14px' }}>{i.name}</span>
                  <span style={{ display: 'inline-block', marginTop: '3px', font: "600 10px 'IBM Plex Mono'", letterSpacing: '.06em', textTransform: 'uppercase', padding: '2px 8px', borderRadius: '20px', background: st.bg, color: st.col }}>{st.label}</span>
                </>)}
              </span>
              {editing ? (
                <input value={d.min_qty ?? ''} onChange={(e) => setDraft((x) => ({ ...x, [i.id]: { ...x[i.id], min_qty: e.target.value } }))} inputMode="decimal" style={cellNum} />
              ) : <span style={{ width: '62px', textAlign: 'center', font: "500 13px 'IBM Plex Mono'", color: '#a49c90' }}>{Number(i.min_qty)}</span>}
              {editing ? (
                <input value={d.max_qty ?? ''} onChange={(e) => setDraft((x) => ({ ...x, [i.id]: { ...x[i.id], max_qty: e.target.value } }))} inputMode="decimal" style={cellNum} />
              ) : <span style={{ width: '62px', textAlign: 'center', font: "500 13px 'IBM Plex Mono'", color: '#a49c90' }}>{Number(i.max_qty)}</span>}
              {editing ? (
                <input value={d.current_qty ?? ''} onChange={(e) => setDraft((x) => ({ ...x, [i.id]: { ...x[i.id], current_qty: e.target.value } }))} inputMode="decimal" style={cellNum} />
              ) : <span style={{ width: '66px', textAlign: 'center', font: "700 15px 'IBM Plex Mono'", color: '#17130f' }}>{Number(i.current_qty)}</span>}
              {editing ? (
                <button onClick={() => removeRow(i)} className="mm-press" aria-label="Löschen" style={{ width: '32px', flex: 'none', background: 'transparent', border: 'none', color: '#b1470f', cursor: 'pointer', fontSize: '17px' }}>×</button>
              ) : (
                <span style={{ width: '110px', textAlign: 'right' }}>
                  <button onClick={() => order(i)} style={{ padding: '7px 13px', borderRadius: '8px', border: 'none', cursor: ord ? 'default' : 'pointer', font: "700 12px 'Inter'", background: ord ? '#e8f5ec' : (critical ? '#f07f13' : '#f0eae0'), color: ord ? '#1c6d3c' : (critical ? '#17130f' : '#7c756c') }}>{ord ? t.ordered : t.order}</button>
                </span>
              )}
            </div>
          );
        })}
      </div>

      {editing && (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '14px' }}>
          <button onClick={save} disabled={busy} className="mm-press" style={{ ...invBtn, background: '#f07f13', color: '#17130f', border: 'none', opacity: busy ? 0.7 : 1 }}>{busy ? '…' : '✓ ' + t.inv_save}</button>
          <button onClick={() => setEditing(false)} className="mm-press" style={invBtn}>{t.inv_cancel}</button>
          <button onClick={addRow} className="mm-press" style={invBtn}>+ {t.inv_add}</button>
        </div>
      )}
    </div>
  );
}

export function BetriebTemp({ v }) {
  const { t } = v;
  return (
    <div style={{ animation: 'mmfade .3s ease', maxWidth: '680px' }}>
      <button onClick={v.backBetrieb} style={v.backBtnStyle}>← {t.back}</button>
      <h1 style={{ fontFamily: 'Archivo', fontWeight: 800, fontSize: 'clamp(24px,4vw,32px)', margin: '14px 0 4px', color: '#17130f', letterSpacing: '-.02em' }}>{t.b_temp}</h1>
      <div style={{ fontSize: '14px', color: '#7c756c', marginBottom: '18px' }}>{t.temp_sub}</div>
      <div style={{ background: '#fff', border: '1px solid #e4ded4', borderRadius: '16px', padding: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div style={{ flex: 1, minWidth: '150px' }}>
          <label style={v.labelStyle}>{t.temp_station}</label>
          <select value={v.tempStation} onChange={v.onTempStation} style={v.inputStyle}>
            <option value="Kühlschrank">Kühlschrank (2–7°C)</option>
            <option value="Bain Marie">Bain Marie (&gt;63°C)</option>
            <option value="Tiefkühler">Tiefkühler (&lt;-18°C)</option>
            <option value="Salattheke">Salattheke (2–7°C)</option>
          </select>
        </div>
        <div style={{ width: '120px' }}>
          <label style={v.labelStyle}>{t.temp_value} °C</label>
          <input type="number" value={v.tempValue} onChange={v.onTempValue} placeholder="0" style={v.inputStyle} />
        </div>
        <button onClick={v.submitTemp} style={v.primaryBtnStyle}>{t.temp_log}</button>
      </div>
      {v.hasTemp && (
        <div style={{ marginTop: '18px', background: '#fff', border: '1px solid #e4ded4', borderRadius: '16px', overflow: 'hidden' }}>
          {v.tempLog.map((e, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '13px 18px', borderBottom: '1px solid #f0eae0' }}>
              <span style={e.dotStyle} />
              <span style={{ flex: 1, fontWeight: 600, color: '#17130f' }}>{e.station}</span>
              <span style={{ font: "700 15px 'IBM Plex Mono'", color: e.color }}>{e.value}°C</span>
              <span style={e.tagStyle}>{e.tag}</span>
              <span style={{ font: "500 11px 'IBM Plex Mono'", color: '#a49c90', width: '52px', textAlign: 'right' }}>{e.time}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function BetriebReport({ v }) {
  const { t } = v;
  return (
    <div style={{ animation: 'mmfade .3s ease', maxWidth: '600px' }}>
      <button onClick={v.backBetrieb} style={v.backBtnStyle}>← {t.back}</button>
      <h1 style={{ fontFamily: 'Archivo', fontWeight: 800, fontSize: 'clamp(24px,4vw,32px)', margin: '14px 0 4px', color: '#17130f', letterSpacing: '-.02em' }}>{t.b_report}</h1>
      <div style={{ fontSize: '14px', color: '#7c756c', marginBottom: '18px' }}>{t.report_sub}</div>
      <div style={{ background: '#fff', border: '1px solid #e4ded4', borderRadius: '16px', padding: '20px', display: 'flex', gap: '10px' }}>
        <textarea value={v.reportText} onChange={v.onReport} placeholder={t.report_ph} style={{ ...v.textareaStyle, margin: 0, flex: 1, minHeight: '52px' }} />
        <button onClick={v.submitReport} style={{ ...v.primaryBtnStyle, margin: 0, alignSelf: 'stretch' }}>{t.send}</button>
      </div>
      <div style={{ marginTop: '18px' }}>
        {v.meldungen.map((m, i) => (
          <div key={i} style={{ background: '#fff', border: '1px solid #e4ded4', borderRadius: '12px', padding: '14px 16px', marginBottom: '8px', display: 'flex', gap: '12px' }}>
            <span style={m.dotStyle} />
            <div style={{ flex: 1 }}>
              <div style={{ color: '#2a2620' }}>{m.text}</div>
              <div style={{ font: "500 11px 'IBM Plex Mono'", color: '#a49c90', marginTop: '3px' }}>{m.meta}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function BetriebOnboarding({ v }) {
  const { t } = v;
  return (
    <div style={{ animation: 'mmfade .3s ease', maxWidth: '720px' }}>
      <button onClick={v.backBetrieb} style={v.backBtnStyle}>← {t.back}</button>
      <h1 style={{ fontFamily: 'Archivo', fontWeight: 800, fontSize: 'clamp(24px,4vw,32px)', margin: '14px 0 4px', color: '#17130f', letterSpacing: '-.02em' }}>{t.b_onboard}</h1>
      <div style={{ height: '9px', background: '#e9e2d6', borderRadius: '6px', overflow: 'hidden', margin: '14px 0 6px' }}><div style={v.onbBarStyle} /></div>
      <div style={{ font: "600 12px 'IBM Plex Mono'", color: '#7c756c', marginBottom: '18px' }}>{v.onbDone} / {v.onbTotal} {t.modules_done}</div>
      <div style={{ background: '#fff', border: '1px solid #e4ded4', borderRadius: '16px', overflow: 'hidden' }}>
        {v.modules.map((m, i) => (
          <button key={i} onClick={m.toggle} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '14px', padding: '15px 18px', background: 'transparent', border: 'none', borderBottom: '1px solid #f0eae0', cursor: 'pointer', textAlign: 'left' }}>
            <span style={m.boxStyle}>{m.checked && <CheckMark />}</span>
            <span style={{ flex: 1 }}>
              <span style={m.textStyle}>{m.title}</span>
              <span style={{ display: 'block', fontSize: '12.5px', color: '#a49c90', marginTop: '2px' }}>{m.day}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
