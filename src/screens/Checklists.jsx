import { CheckMark } from './Icons.jsx';

export function ChecklistList({ v }) {
  const { t } = v;
  return (
    <div style={{ animation: 'mmfade .3s ease' }}>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ font: "600 12px 'IBM Plex Mono'", letterSpacing: '.12em', textTransform: 'uppercase', color: '#b8912e' }}>{t.nav_check}</div>
        <h1 style={{ fontFamily: 'Archivo', fontWeight: 800, fontSize: 'clamp(24px,4vw,34px)', margin: '6px 0 0', color: '#17130f', letterSpacing: '-.02em' }}>{t.check_h}</h1>
        <div style={{ fontSize: '15px', color: '#7c756c', marginTop: '4px' }}>{t.check_sub}</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,300px),1fr))', gap: '14px' }}>
        {v.checklistCards.map((cl, i) => (
          <button key={i} onClick={cl.open} style={{ textAlign: 'left', background: '#fff', border: '1px solid #e4ded4', borderRadius: '16px', padding: '20px', cursor: 'pointer', transition: '.15s', borderTop: `3px solid ${cl.accent}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ fontFamily: 'Archivo', fontWeight: 800, fontSize: '19px', color: '#17130f' }}>{cl.title}</div>
              <div style={cl.badgeStyle}>{cl.done}/{cl.total}</div>
            </div>
            <div style={{ fontSize: '13px', color: '#7c756c', margin: '6px 0 14px', lineHeight: 1.45 }}>{cl.desc}</div>
            <div style={{ height: '8px', background: '#f0eae0', borderRadius: '5px', overflow: 'hidden' }}><div style={cl.barStyle} /></div>
          </button>
        ))}
      </div>
    </div>
  );
}

export function ChecklistDetail({ v }) {
  const { t, cl } = v;
  if (!cl) return null;
  return (
    <div style={{ animation: 'mmfade .3s ease', maxWidth: '720px' }}>
      <button onClick={v.back} style={v.backBtnStyle}>← {t.back}</button>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '10px', margin: '14px 0 8px' }}>
        <h1 style={{ fontFamily: 'Archivo', fontWeight: 800, fontSize: 'clamp(24px,4vw,32px)', margin: 0, color: '#17130f', letterSpacing: '-.02em' }}>{cl.title}</h1>
        <button onClick={v.resetCl} style={{ background: 'transparent', border: '1px solid #e4ded4', borderRadius: '8px', padding: '7px 14px', font: "600 12px Inter", color: '#7c756c', cursor: 'pointer' }}>{t.reset}</button>
      </div>
      <div style={{ height: '9px', background: '#e9e2d6', borderRadius: '6px', overflow: 'hidden', marginBottom: '6px' }}><div style={cl.barStyle} /></div>
      <div style={{ font: "600 12px 'IBM Plex Mono'", color: '#7c756c', marginBottom: '18px' }}>{cl.done} / {cl.total} · {cl.pct}%</div>
      {cl.complete && (
        <div style={{ background: '#e8f5ec', border: '1px solid #bfe3cb', borderLeft: '3px solid #2e9e57', borderRadius: '12px', padding: '16px 18px', marginBottom: '16px', color: '#1c6d3c', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}><span style={{ fontSize: '18px' }}>✓</span>{t.check_alldone}</div>
      )}
      <div style={{ background: '#fff', border: '1px solid #e4ded4', borderRadius: '16px', overflow: 'hidden' }}>
        {cl.items.map((it, i) => (
          <button key={i} onClick={it.toggle} style={{ width: '100%', display: 'flex', alignItems: 'flex-start', gap: '14px', padding: '15px 18px', background: 'transparent', border: 'none', borderBottom: '1px solid #f0eae0', cursor: 'pointer', textAlign: 'left' }}>
            <span style={it.boxStyle}>{it.checked && <CheckMark />}</span>
            <span style={it.textStyle}>{it.text}</span>
          </button>
        ))}
      </div>
      {cl.weekly && (
        <div style={{ background: '#f7f0e2', border: '1px solid #e5d6b3', borderLeft: '3px solid #b8912e', borderRadius: '12px', padding: '16px 18px', marginTop: '16px' }}>
          <div style={{ font: "600 11px 'IBM Plex Mono'", letterSpacing: '.12em', textTransform: 'uppercase', color: '#8a6a15', marginBottom: '6px' }}>{t.weekly}</div>
          <div style={{ fontSize: '14px', color: '#5c5340', lineHeight: 1.5 }}>{cl.weekly}</div>
        </div>
      )}
    </div>
  );
}
