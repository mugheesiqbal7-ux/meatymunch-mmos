import { useState, useEffect } from 'react';
import { fetchEntriesSince, fetchBreaksSince, startOfWeekISO, entryNetMinutes, fmtHM, fmtClock } from '../lib/timeclock.js';

const roleColors = { ma: '#f5a11f', sl: '#a879f5', mgmt: '#d8b45c' };

// Echtes Management-Dashboard: Team aus den Konten + Live-Dienststatus + Wochenstunden.
export default function MgmtDashboard({ v }) {
  const { t } = v;
  const [entries, setEntries] = useState([]);
  const [breaks, setBreaks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      await v.refreshTeam();
      const since = startOfWeekISO();
      const [e, b] = await Promise.all([fetchEntriesSince(since), fetchBreaksSince(since)]);
      if (!active) return;
      setEntries(e); setBreaks(b); setLoading(false);
    })();
    return () => { active = false; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const roleLabel = (r) => (r === 'ma' ? t.role_ma : r === 'sl' ? t.role_sl : t.role_mgmt);
  const accounts = v.teamUsers.filter((u) => u.active);

  const openByUser = {}; const weekMinByUser = {};
  entries.forEach((e) => {
    if (!e.clock_out) openByUser[e.user_id] = e;
    weekMinByUser[e.user_id] = (weekMinByUser[e.user_id] || 0) + entryNetMinutes(e, breaks);
  });
  const onDutyCount = Object.keys(openByUser).length;
  const weekTotal = Object.values(weekMinByUser).reduce((a, b) => a + b, 0);

  const tiles = [
    { label: t.dash_active, value: accounts.length, delta: t.team_h },
    { label: t.dash_onduty, value: onDutyCount, delta: t.time_active_now, hot: onDutyCount > 0 },
    { label: t.dash_weekhours, value: fmtHM(weekTotal), delta: t.clock_week },
    { label: t.dash_revenue, value: '—', delta: t.dash_soon, muted: true },
  ];

  return (
    <div style={{ background: '#17130f', color: '#f6f3ee', borderRadius: '18px', padding: '24px', marginBottom: '20px' }}>
      <div style={{ font: "600 11px 'IBM Plex Mono'", letterSpacing: '.14em', textTransform: 'uppercase', color: '#f5a11f', marginBottom: '16px' }}>{t.mgmt_dash} · Idar-Oberstein</div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))', gap: '12px', marginBottom: '20px' }}>
        {tiles.map((k, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: '12px', padding: '15px 16px' }}>
            <div style={{ font: "600 10px 'IBM Plex Mono'", letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(246,243,238,.5)' }}>{k.label}</div>
            <div style={{ fontFamily: 'Archivo', fontWeight: 900, fontSize: '26px', marginTop: '5px', color: k.muted ? 'rgba(246,243,238,.4)' : '#f6f3ee' }}>{k.value}</div>
            <div style={{ fontSize: '12px', color: k.hot ? '#7fd39b' : 'rgba(246,243,238,.45)', fontWeight: 600, marginTop: '2px' }}>{k.delta}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <div style={{ font: "600 10px 'IBM Plex Mono'", letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(246,243,238,.5)' }}>{t.team} · {accounts.length}</div>
        <button onClick={v.openTimeSheet} className="mm-press" style={{ font: "600 11px Inter", color: '#f5a11f', background: 'rgba(245,161,31,.12)', border: '1px solid rgba(245,161,31,.3)', borderRadius: '8px', padding: '5px 11px', cursor: 'pointer' }}>{t.b_time} →</button>
      </div>

      {loading && <div style={{ color: 'rgba(246,243,238,.5)', fontSize: '13px', padding: '8px 0' }}>{t.time_loading}</div>}
      {!loading && accounts.length === 0 && <div style={{ color: 'rgba(246,243,238,.5)', fontSize: '13px', padding: '8px 0' }}>{t.team_none}</div>}

      {!loading && accounts.map((u) => {
        const open = openByUser[u.id];
        const wk = weekMinByUser[u.id] || 0;
        return (
          <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,.07)' }}>
            <span style={{ width: '30px', height: '30px', borderRadius: '50%', background: roleColors[u.role] || '#f5a11f', color: '#17130f', display: 'flex', alignItems: 'center', justifyContent: 'center', font: "800 12px 'Archivo'", flex: 'none' }}>{(u.display_name || u.username)[0].toUpperCase()}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '14px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.display_name || u.username}</div>
              <div style={{ font: "500 11px 'IBM Plex Mono'", color: 'rgba(246,243,238,.45)' }}>{roleLabel(u.role)}</div>
            </div>
            {open ? (
              <span style={{ font: "600 10px 'IBM Plex Mono'", letterSpacing: '.05em', textTransform: 'uppercase', color: '#7fd39b', background: 'rgba(46,158,87,.18)', border: '1px solid rgba(127,211,155,.35)', borderRadius: '20px', padding: '3px 9px', whiteSpace: 'nowrap' }}>● {t.clock_since} {fmtClock(open.clock_in)}</span>
            ) : (
              <span style={{ font: "500 11px 'IBM Plex Mono'", color: 'rgba(246,243,238,.35)', whiteSpace: 'nowrap' }}>{t.dash_notonduty}</span>
            )}
            <div style={{ font: "700 13px 'IBM Plex Mono'", color: '#f6f3ee', width: '58px', textAlign: 'right' }}>{fmtHM(wk)}</div>
          </div>
        );
      })}
    </div>
  );
}
