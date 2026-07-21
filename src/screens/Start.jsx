export default function Start({ v }) {
  const { t } = v;
  return (
    <div style={{ animation: 'mmfade .3s ease' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '14px', marginBottom: '22px' }}>
        <div>
          <div style={{ font: "600 12px 'IBM Plex Mono',monospace", letterSpacing: '.12em', textTransform: 'uppercase', color: '#b8912e' }}>{v.dateLabel}</div>
          <h1 style={{ fontFamily: 'Archivo', fontWeight: 800, fontSize: 'clamp(26px,4.5vw,38px)', letterSpacing: '-.02em', margin: '6px 0 0', color: '#17130f' }}>{v.greeting}, {v.userName}.</h1>
          <div style={{ fontSize: '15px', color: '#7c756c', marginTop: '4px' }}>{t.home_sub}</div>
        </div>
        <div style={{ display: 'flex', gap: '4px', background: '#fff', border: '1px solid #e4ded4', borderRadius: '10px', padding: '4px' }}>
          <button onClick={v.hv0} style={v.hv_0}>{t.hv_focus}</button>
          <button onClick={v.hv1} style={v.hv_1}>{t.hv_cards}</button>
          <button onClick={v.hv2} style={v.hv_2}>{t.hv_dash}</button>
        </div>
      </div>

      {v.homeFocus && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,300px),1fr))', gap: '16px', alignItems: 'start' }}>
          <div style={{ gridColumn: '1/-1', background: 'linear-gradient(110deg,#1e1813,#2c221a)', color: '#f6f3ee', borderRadius: '18px', padding: '26px 26px', display: 'flex', gap: '26px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', width: '120px', height: '120px', flex: 'none' }}>
              <svg viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="12" />
                <circle cx="60" cy="60" r="52" fill="none" stroke="#f07f13" strokeWidth="12" strokeLinecap="round" strokeDasharray="326.7" strokeDashoffset={v.ringOffset} style={{ transition: '.6s' }} />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontFamily: 'Archivo', fontWeight: 900, fontSize: '30px' }}>{v.openPct}%</div>
                <div style={{ font: "600 9px 'IBM Plex Mono'", letterSpacing: '.1em', color: 'rgba(246,243,238,.55)', textTransform: 'uppercase' }}>{t.today}</div>
              </div>
            </div>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <div style={{ font: "600 11px 'IBM Plex Mono'", letterSpacing: '.14em', textTransform: 'uppercase', color: '#f5a11f' }}>{t.priority}</div>
              <div style={{ fontFamily: 'Archivo', fontWeight: 800, fontSize: '23px', margin: '5px 0 4px' }}>{t.cl_oeffnen}</div>
              <div style={{ fontSize: '14px', color: 'rgba(246,243,238,.68)', marginBottom: '16px' }}>{v.openDone} / {v.openTotal} {t.steps_done}</div>
              <button onClick={v.openOeffnen} style={{ background: '#f07f13', color: '#17130f', border: 'none', borderRadius: '10px', padding: '12px 22px', font: "700 14px Inter", cursor: 'pointer' }}>{t.continue} →</button>
            </div>
          </div>
          <div style={{ background: '#fff', border: '1px solid #e4ded4', borderRadius: '16px', padding: '20px' }}>
            <div style={{ font: "600 11px 'IBM Plex Mono'", letterSpacing: '.12em', textTransform: 'uppercase', color: '#7c756c', marginBottom: '14px' }}>{t.quickactions}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button onClick={v.goCheck} style={v.qaStyle}><span style={v.qaIcon1}>✓</span>{t.nav_check}</button>
              <button onClick={v.openSopList} style={v.qaStyle}><span style={v.qaIcon2}>?</span>{t.qa_sop}</button>
              <button onClick={v.openRezList} style={v.qaStyle}><span style={v.qaIcon3}>◆</span>{t.qa_recipe}</button>
              <button onClick={v.openTemp} style={v.qaStyle}><span style={v.qaIcon4}>°</span>{t.qa_temp}</button>
              <button onClick={v.openSick} style={v.qaStyle}><span style={v.qaIcon5}>+</span>{t.qa_sick}</button>
              <button onClick={v.openReport} style={v.qaStyle}><span style={v.qaIcon6}>!</span>{t.qa_report}</button>
            </div>
          </div>
          <div style={{ background: '#fff', border: '1px solid #e4ded4', borderRadius: '16px', padding: '20px' }}>
            <div style={{ font: "600 11px 'IBM Plex Mono'", letterSpacing: '.12em', textTransform: 'uppercase', color: '#7c756c', marginBottom: '14px' }}>{t.myshift}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
              <div style={{ fontFamily: 'Archivo', fontWeight: 800, fontSize: '32px', color: '#17130f' }}>{v.shiftToday}</div>
              <div style={{ fontSize: '13px', color: '#7c756c' }}>{v.shiftRole}</div>
            </div>
            <div style={{ height: '1px', background: '#eee7dc', margin: '14px 0' }} />
            <div style={{ font: "600 11px 'IBM Plex Mono'", letterSpacing: '.12em', textTransform: 'uppercase', color: '#7c756c', marginBottom: '10px' }}>{t.badges}</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {v.badges.map((b, i) => (<div key={i} title={b.name} style={b.style}>{b.icon}</div>))}
            </div>
          </div>
        </div>
      )}

      {v.homeCards && (
        <div style={{ columns: '320px', columnGap: '16px' }}>
          {v.feedCards.map((c, i) => (
            <div key={i} style={{ breakInside: 'avoid', marginBottom: '16px', background: '#fff', border: '1px solid #e4ded4', borderRadius: '16px', overflow: 'hidden', borderTop: `3px solid ${c.accent}` }}>
              <div style={{ padding: '18px 20px' }}>
                <div style={{ font: "600 10px 'IBM Plex Mono'", letterSpacing: '.14em', textTransform: 'uppercase', color: c.accent }}>{c.kicker}</div>
                <div style={{ fontFamily: 'Archivo', fontWeight: 800, fontSize: '19px', margin: '6px 0 6px', color: '#17130f' }}>{c.title}</div>
                <div style={{ fontSize: '14px', color: '#6c655c', lineHeight: 1.5 }}>{c.body}</div>
                <button onClick={c.action} style={{ marginTop: '14px', background: '#f4f1ec', border: '1px solid #e4ded4', borderRadius: '9px', padding: '9px 16px', font: "700 13px Inter", color: '#17130f', cursor: 'pointer' }}>{c.cta} →</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {v.homeDash && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: '12px', marginBottom: '16px' }}>
            {v.statTiles.map((s, i) => (
              <div key={i} style={{ background: '#fff', border: '1px solid #e4ded4', borderRadius: '14px', padding: '16px 18px', borderLeft: `3px solid ${s.accent}` }}>
                <div style={{ font: "600 10px 'IBM Plex Mono'", letterSpacing: '.1em', textTransform: 'uppercase', color: '#7c756c' }}>{s.label}</div>
                <div style={{ fontFamily: 'Archivo', fontWeight: 900, fontSize: '28px', color: '#17130f', marginTop: '5px' }}>{s.value}</div>
                <div style={{ fontSize: '12px', color: s.accent, fontWeight: 600, marginTop: '2px' }}>{s.delta}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,320px),1fr))', gap: '16px' }}>
            <div style={{ background: '#fff', border: '1px solid #e4ded4', borderRadius: '16px', padding: '20px' }}>
              <div style={{ font: "600 11px 'IBM Plex Mono'", letterSpacing: '.12em', textTransform: 'uppercase', color: '#7c756c', marginBottom: '12px' }}>{t.checklist_status}</div>
              {v.clStatus.map((cs, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '9px 0', borderBottom: '1px solid #f0eae0' }}>
                  <div style={{ flex: 1, fontSize: '14px', fontWeight: 600, color: '#17130f' }}>{cs.title}</div>
                  <div style={{ width: '110px', height: '7px', background: '#f0eae0', borderRadius: '5px', overflow: 'hidden' }}><div style={cs.barStyle} /></div>
                  <div style={{ font: "600 12px 'IBM Plex Mono'", color: '#7c756c', width: '42px', textAlign: 'right' }}>{cs.pct}%</div>
                </div>
              ))}
            </div>
            <div style={{ background: '#fff', border: '1px solid #e4ded4', borderRadius: '16px', padding: '20px' }}>
              <div style={{ font: "600 11px 'IBM Plex Mono'", letterSpacing: '.12em', textTransform: 'uppercase', color: '#7c756c', marginBottom: '12px' }}>{t.open_reports}</div>
              {v.meldungen.map((m, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', padding: '10px 0', borderBottom: '1px solid #f0eae0' }}>
                  <span style={m.dotStyle} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', color: '#2a2620' }}>{m.text}</div>
                    <div style={{ font: "500 11px 'IBM Plex Mono'", color: '#a49c90', marginTop: '2px' }}>{m.meta}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
