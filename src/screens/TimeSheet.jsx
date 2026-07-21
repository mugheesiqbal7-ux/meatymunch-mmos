import { useState, useEffect } from 'react';
import { fetchEntriesSince, fetchBreaksSince, fetchProfilesMap, startOfWeekISO, entryNetMinutes, fmtHM, fmtClock } from '../lib/timeclock.js';

// Zeiterfassungs-Übersicht. ma: eigene Woche. sl/mgmt: alle (RLS liefert alle).
export default function TimeSheet({ v }) {
  const { t } = v;
  const [entries, setEntries] = useState([]);
  const [breaks, setBreaks] = useState([]);
  const [names, setNames] = useState({});
  const [loading, setLoading] = useState(true);
  const isLead = v.role === 'sl' || v.role === 'mgmt';

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      const since = startOfWeekISO();
      const [e, b, n] = await Promise.all([fetchEntriesSince(since), fetchBreaksSince(since), fetchProfilesMap()]);
      if (!active) return;
      setEntries(e); setBreaks(b); setNames(n); setLoading(false);
    })();
    return () => { active = false; };
  }, []);

  const nameFor = (uid) => names[uid] || (uid === v.uid ? (v.profile?.display_name || v.profile?.username) : uid.slice(0, 6));

  // nach Nutzer gruppieren
  const byUser = {};
  for (const e of entries) {
    (byUser[e.user_id] ||= []).push(e);
  }
  const users = Object.keys(byUser).sort((a, b) => nameFor(a).localeCompare(nameFor(b)));

  function exportCsv() {
    const rows = [['Name', 'Datum', 'Start', 'Ende', 'Netto (min)']];
    for (const e of entries) {
      const d = new Date(e.clock_in);
      rows.push([
        nameFor(e.user_id),
        d.toLocaleDateString('de-DE'),
        fmtClock(e.clock_in),
        e.clock_out ? fmtClock(e.clock_out) : '',
        String(entryNetMinutes(e, breaks)),
      ]);
    }
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(';')).join('\n');
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `zeiten_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
  }

  return (
    <div style={{ animation: 'mmfade .3s ease', maxWidth: '820px' }}>
      <button onClick={v.backBetrieb} style={v.backBtnStyle}>← {t.back}</button>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '10px', margin: '14px 0 4px' }}>
        <h1 style={{ fontFamily: 'Archivo', fontWeight: 800, fontSize: 'clamp(24px,4vw,32px)', margin: 0, color: '#17130f', letterSpacing: '-.02em' }}>{t.time_h}</h1>
        {isLead && <button onClick={exportCsv} style={{ background: '#f4f1ec', border: '1px solid #e4ded4', borderRadius: '9px', padding: '9px 16px', font: "700 13px Inter", color: '#17130f', cursor: 'pointer' }}>⭳ {t.time_export}</button>}
      </div>
      <div style={{ fontSize: '14px', color: '#7c756c', marginBottom: '18px' }}>{isLead ? t.time_team : t.time_my} · {t.clock_week}</div>

      {loading && <div style={{ color: '#7c756c' }}>{t.time_loading}</div>}
      {!loading && entries.length === 0 && (
        <div style={{ background: '#fff', border: '1px solid #e4ded4', borderRadius: '16px', padding: '22px', color: '#a49c90', fontSize: '14px' }}>{t.time_none}</div>
      )}

      {!loading && users.map((uid) => {
        const list = byUser[uid];
        const weekMin = list.reduce((acc, e) => acc + entryNetMinutes(e, breaks), 0);
        const active = list.some((e) => !e.clock_out);
        return (
          <div key={uid} style={{ background: '#fff', border: '1px solid #e4ded4', borderRadius: '16px', overflow: 'hidden', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 18px', background: '#faf7f2', borderBottom: '1px solid #f0eae0' }}>
              <div style={{ flex: 1, fontFamily: 'Archivo', fontWeight: 800, fontSize: '16px', color: '#17130f' }}>{nameFor(uid)}</div>
              {active && <span style={{ font: "600 10px 'IBM Plex Mono'", letterSpacing: '.06em', textTransform: 'uppercase', color: '#1c6d3c', background: '#e8f5ec', border: '1px solid #bfe3cb', borderRadius: '20px', padding: '3px 9px' }}>{t.time_active_now}</span>}
              <div style={{ font: "700 14px 'IBM Plex Mono'", color: '#17130f' }}>{fmtHM(weekMin)}</div>
            </div>
            {list.map((e) => {
              const net = entryNetMinutes(e, breaks);
              const d = new Date(e.clock_in);
              return (
                <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 18px', borderBottom: '1px solid #f4efe6' }}>
                  <div style={{ width: '96px', flex: 'none', font: "500 12px 'IBM Plex Mono'", color: '#7c756c' }}>{d.toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit' })}</div>
                  <div style={{ flex: 1, fontSize: '14px', color: '#2a2620' }}>{fmtClock(e.clock_in)} – {e.clock_out ? fmtClock(e.clock_out) : t.time_open}</div>
                  <div style={{ font: "700 13px 'IBM Plex Mono'", color: e.clock_out ? '#17130f' : '#2e9e57' }}>{fmtHM(net)}{!e.clock_out ? ' ·' + t.time_running : ''}</div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
