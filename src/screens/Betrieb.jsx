import { CheckMark } from './Icons.jsx';

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

export function BetriebInventory({ v }) {
  const { t } = v;
  return (
    <div style={{ animation: 'mmfade .3s ease', maxWidth: '760px' }}>
      <button onClick={v.backBetrieb} style={v.backBtnStyle}>← {t.back}</button>
      <h1 style={{ fontFamily: 'Archivo', fontWeight: 800, fontSize: 'clamp(24px,4vw,32px)', margin: '14px 0 4px', color: '#17130f', letterSpacing: '-.02em' }}>{t.b_inv}</h1>
      <div style={{ fontSize: '14px', color: '#7c756c', marginBottom: '18px' }}>{t.inv_sub}</div>
      <div style={{ background: '#fff', border: '1px solid #e4ded4', borderRadius: '16px', overflow: 'hidden' }}>
        <div style={{ display: 'flex', padding: '11px 18px', background: '#faf7f2', borderBottom: '2px solid #17130f', font: "600 10.5px 'IBM Plex Mono'", letterSpacing: '.1em', textTransform: 'uppercase', color: '#7c756c' }}>
          <span style={{ flex: 1 }}>{t.article}</span>
          <span style={{ width: '64px', textAlign: 'center' }}>MIN</span>
          <span style={{ width: '64px', textAlign: 'center' }}>MAX</span>
          <span style={{ width: '70px', textAlign: 'center' }}>{t.stock}</span>
          <span style={{ width: '110px' }} />
        </div>
        {v.inventory.map((i, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', padding: '12px 18px', borderBottom: '1px solid #f0eae0' }}>
            <span style={{ flex: 1 }}>
              <span style={{ display: 'block', fontWeight: 600, color: '#17130f', fontSize: '14px' }}>{i.name}</span>
              <span style={i.statusStyle}>{i.statusLabel}</span>
            </span>
            <span style={{ width: '64px', textAlign: 'center', font: "500 13px 'IBM Plex Mono'", color: '#a49c90' }}>{i.min}</span>
            <span style={{ width: '64px', textAlign: 'center', font: "500 13px 'IBM Plex Mono'", color: '#a49c90' }}>{i.max}</span>
            <span style={{ width: '70px', textAlign: 'center', font: "700 15px 'IBM Plex Mono'", color: '#17130f' }}>{i.current}</span>
            <span style={{ width: '110px', textAlign: 'right' }}><button onClick={i.order} style={i.btnStyle}>{i.btnLabel}</button></span>
          </div>
        ))}
      </div>
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
