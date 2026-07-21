import { useState, useEffect } from 'react';
import { fmtClock } from '../lib/timeclock.js';

// Live-Stempelkarte fürs eigene Handy. Zeigt laufende Arbeitszeit (abzüglich Pause).
export default function ClockCard({ v }) {
  const { t } = v;
  const [, setTick] = useState(0);

  // Sekundentakt nur, wenn eingestempelt (für die laufende Anzeige).
  useEffect(() => {
    if (!v.clockedIn) return;
    const id = setInterval(() => setTick((x) => x + 1), 1000);
    return () => clearInterval(id);
  }, [v.clockedIn]);

  if (!v.clockLoaded) {
    return <div style={wrap}><div style={{ color: 'rgba(246,243,238,.6)', fontSize: '14px' }}>{t.time_loading}</div></div>;
  }

  if (!v.clockedIn) {
    return (
      <div style={wrap}>
        <div style={{ flex: 1, minWidth: '160px' }}>
          <div style={kicker}>{t.b_time}</div>
          <div style={{ fontFamily: 'Archivo', fontWeight: 800, fontSize: '22px', marginTop: '4px' }}>{t.clock_notclocked}</div>
          <div style={{ fontSize: '13px', color: 'rgba(246,243,238,.6)', marginTop: '3px' }}>{t.clock_worktime}</div>
        </div>
        <button onClick={v.clockIn} style={bigBtn('#2e9e57')}>▶ {t.clock_start_shift}</button>
      </div>
    );
  }

  const now = Date.now();
  const inMs = new Date(v.clockEntry.clock_in).getTime();
  // laufende Pause abziehen (nur die aktuelle offene Pause wird live im Timer berücksichtigt)
  let elapsed = Math.max(0, now - inMs);
  const onBreak = v.onBreak;
  const running = formatDur(elapsed);

  return (
    <div style={{ ...wrap, flexDirection: 'column', alignItems: 'stretch', gap: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '160px' }}>
          <div style={kicker}>{onBreak ? t.clock_onbreak : t.clock_working} · {t.clock_since} {fmtClock(v.clockEntry.clock_in)}</div>
          <div style={{ fontFamily: 'Archivo', fontWeight: 900, fontSize: '40px', letterSpacing: '-.02em', marginTop: '4px', color: onBreak ? '#f5a11f' : '#f6f3ee' }}>{running}</div>
        </div>
        <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: onBreak ? '#f5a11f' : '#2e9e57', flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>{onBreak ? '⏸' : '⏱️'}</div>
      </div>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {!onBreak && <button onClick={v.startBreak} style={bigBtn('#f5a11f', true)}>⏸ {t.clock_break}</button>}
        {onBreak && <button onClick={v.endBreak} style={bigBtn('#2e9e57')}>▶ {t.clock_break_end}</button>}
        <button onClick={v.clockOut} style={bigBtn('#e8631a')}>■ {t.clock_out}</button>
      </div>
    </div>
  );
}

function formatDur(ms) {
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

const wrap = { background: 'linear-gradient(110deg,#1e1813,#2c221a)', color: '#f6f3ee', borderRadius: '18px', padding: '22px 24px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '16px' };
const kicker = { font: "600 11px 'IBM Plex Mono'", letterSpacing: '.12em', textTransform: 'uppercase', color: '#f5a11f' };
const bigBtn = (bg, dark) => ({ background: bg, color: dark ? '#17130f' : '#fff', border: 'none', borderRadius: '11px', padding: '13px 22px', font: "700 15px Inter", cursor: 'pointer', flex: '1', minWidth: '130px' });
