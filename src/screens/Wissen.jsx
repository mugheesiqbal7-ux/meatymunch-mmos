export function WissenHub({ v }) {
  const { t } = v;
  return (
    <div style={{ animation: 'mmfade .3s ease' }}>
      <div style={{ marginBottom: '18px' }}>
        <div style={{ font: "600 12px 'IBM Plex Mono'", letterSpacing: '.12em', textTransform: 'uppercase', color: '#b8912e' }}>{t.nav_wissen}</div>
        <h1 style={{ fontFamily: 'Archivo', fontWeight: 800, fontSize: 'clamp(24px,4vw,34px)', margin: '6px 0 0', color: '#17130f', letterSpacing: '-.02em' }}>{t.wissen_h}</h1>
      </div>
      <input value={v.query} onChange={v.onQuery} placeholder={t.search_ph} style={{ width: '100%', maxWidth: '520px', background: '#fff', border: '1px solid #e4ded4', borderRadius: '11px', padding: '13px 16px', fontSize: '15px', color: '#2a2620', marginBottom: '16px' }} />
      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button onClick={v.wsubSop} style={v.ws_sop}>{t.tab_sop}</button>
        <button onClick={v.wsubHb} style={v.ws_hb}>{t.tab_hb}</button>
        <button onClick={v.wsubRez} style={v.ws_rez}>{t.tab_rez}</button>
      </div>

      {v.wIsSop && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,240px),1fr))', gap: '14px' }}>
          {v.sopsF.map((s, i) => (
            <button key={i} onClick={s.open} className="mm-card" style={{ textAlign: 'left', background: '#fff', border: '1px solid #e4ded4', borderRadius: '16px', overflow: 'hidden', cursor: 'pointer', padding: 0 }}>
              {s.img ? (
                <div style={{ height: '150px', background: `#eee url('${s.img}') center/cover` }} />
              ) : (
                <div style={{ height: '86px', background: `linear-gradient(120deg, ${s.accent || '#17130f'}, #17130f)`, display: 'flex', alignItems: 'center', padding: '0 18px' }}>
                  <span style={{ fontFamily: 'Archivo', fontWeight: 900, fontSize: '40px', color: 'rgba(255,255,255,.9)', lineHeight: 1 }}>SOP {s.no}</span>
                </div>
              )}
              <div style={{ padding: '16px 18px' }}>
                <div style={{ font: "600 11px 'IBM Plex Mono'", letterSpacing: '.1em', color: s.accent || '#f07f13' }}>SOP {s.no}</div>
                <div style={{ fontFamily: 'Archivo', fontWeight: 800, fontSize: '18px', color: '#17130f', margin: '4px 0 4px' }}>{s.title}</div>
                <div style={{ fontSize: '13px', color: '#7c756c', lineHeight: 1.4 }}>{s.summary}</div>
              </div>
            </button>
          ))}
        </div>
      )}

      {v.wIsHb && (
        <div style={{ background: '#fff', border: '1px solid #e4ded4', borderRadius: '16px', overflow: 'hidden', maxWidth: '760px' }}>
          {v.chaptersF.map((c, i) => (
            <button key={i} onClick={c.open} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '16px', padding: '15px 18px', background: 'transparent', border: 'none', borderBottom: '1px solid #f0eae0', cursor: 'pointer', textAlign: 'left' }}>
              <span style={{ fontFamily: 'Archivo', fontWeight: 800, fontSize: '18px', color: '#17130f', width: '30px', flex: 'none' }}>{c.no}</span>
              <span style={{ flex: 1 }}>
                <span style={{ display: 'block', fontWeight: 600, fontSize: '15px', color: '#17130f' }}>{c.title}</span>
                <span style={{ display: 'block', fontSize: '13px', color: '#7c756c', marginTop: '2px' }}>{c.desc}</span>
              </span>
              <span style={c.statusStyle}>{c.statusLabel}</span>
            </button>
          ))}
        </div>
      )}

      {v.wIsRez && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,260px),1fr))', gap: '14px' }}>
          {v.recipesF.map((r, i) => (
            <button key={i} onClick={r.open} style={{ textAlign: 'left', background: '#fff', border: '1px solid #e4ded4', borderRadius: '16px', overflow: 'hidden', cursor: 'pointer', padding: 0, transition: '.15s' }}>
              <div style={{ height: '220px', background: `#f2ead9 url('${r.img}') center/cover` }} />
              <div style={{ padding: '16px 18px' }}>
                <div style={{ font: "600 11px 'IBM Plex Mono'", letterSpacing: '.1em', color: '#7C3AED' }}>{t.buildcard}</div>
                <div style={{ fontFamily: 'Archivo', fontWeight: 800, fontSize: '20px', color: '#17130f', margin: '4px 0 4px' }}>{r.name}</div>
                <div style={{ fontSize: '13px', color: '#7c756c' }}>{r.steps.length} {t.layers} · {r.patty}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function SopDetail({ v }) {
  const { t, sop } = v;
  if (!sop) return null;
  return (
    <div style={{ animation: 'mmfade .3s ease', maxWidth: '760px' }}>
      <button onClick={v.back} style={v.backBtnStyle}>← {t.back}</button>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', margin: '14px 0 4px' }}><span style={{ font: "600 13px 'IBM Plex Mono'", letterSpacing: '.1em', color: sop.accent || '#f07f13' }}>SOP {sop.no}</span></div>
      <h1 style={{ fontFamily: 'Archivo', fontWeight: 800, fontSize: 'clamp(26px,4.5vw,38px)', margin: '0 0 6px', color: '#17130f', letterSpacing: '-.02em' }}>{sop.title}</h1>
      {sop.summary && <div style={{ fontSize: '15px', color: '#7c756c', marginBottom: '18px' }}>{sop.summary}</div>}
      {sop.img && <img src={sop.img} alt={sop.title} style={{ width: '100%', borderRadius: '14px', border: '1px solid #e4ded4', boxShadow: '0 8px 24px rgba(0,0,0,.08)', marginBottom: '20px' }} />}

      {(sop.sections || []).map((sec, si) => (
        <div key={si} style={{ marginBottom: '20px' }}>
          <h2 style={{ fontFamily: 'Archivo', fontWeight: 800, fontSize: '18px', color: '#17130f', margin: '0 0 12px', lineHeight: 1.25 }}>{sec.heading}</h2>
          {sec.blocks.map((b, bi) => <Block key={bi} b={b} />)}
        </div>
      ))}
    </div>
  );
}

function Block({ b }) {
  if (b.t === 'lead') return <p style={{ fontSize: '16px', lineHeight: 1.6, color: '#3a352e', fontWeight: 600, margin: '0 0 12px' }}>{b.text}</p>;
  if (b.t === 'p') return <p style={{ fontSize: '15px', lineHeight: 1.62, color: '#3a352e', margin: '0 0 12px' }}>{b.text}</p>;
  if (b.t === 'steps') return (
    <div style={{ margin: '0 0 14px' }}>
      {b.items.map((st, i) => (
        <div key={i} style={{ display: 'flex', gap: '12px', padding: '8px 0', borderBottom: i < b.items.length - 1 ? '1px solid #f3ede3' : 'none' }}>
          <span style={{ flex: 'none', width: '26px', height: '26px', borderRadius: '50%', background: '#17130f', color: '#f6f3ee', display: 'flex', alignItems: 'center', justifyContent: 'center', font: "800 12px 'Archivo'", marginTop: '1px' }}>{st.n}</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: '14.5px', color: '#17130f' }}>{st.title}</div>
            {st.text && <div style={{ fontSize: '14px', color: '#5c5340', lineHeight: 1.5, marginTop: '2px' }}>{st.text}</div>}
          </div>
        </div>
      ))}
    </div>
  );
  if (b.t === 'ul') return (
    <div style={{ margin: '0 0 12px' }}>
      {b.items.map((it, i) => (
        <div key={i} style={{ display: 'flex', gap: '10px', padding: '5px 0' }}><span style={{ color: '#f07f13', fontWeight: 800, flex: 'none', lineHeight: 1.5 }}>▸</span><span style={{ fontSize: '15px', color: '#2a2620', lineHeight: 1.55 }}>{it}</span></div>
      ))}
    </div>
  );
  if (b.t === 'box') return (
    <div style={{ background: '#f7f0e2', border: '1px solid #e5d6b3', borderLeft: '3px solid #b8912e', borderRadius: '12px', padding: '14px 16px', margin: '4px 0 14px' }}>
      {b.label && <div style={{ font: "600 11px 'IBM Plex Mono'", letterSpacing: '.1em', textTransform: 'uppercase', color: '#8a6a15', marginBottom: '6px' }}>{b.label}</div>}
      <div style={{ fontSize: '14.5px', color: '#5c5340', lineHeight: 1.55 }}>{b.text}</div>
    </div>
  );
  if (b.t === 'table') return (
    <div style={{ overflowX: 'auto', margin: '0 0 14px' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: '14px' }}>
        <tbody>
          {b.rows.map((r, i) => (
            <tr key={i}>
              {r.map((c, j) => (
                <td key={j} style={{ border: '1px solid #eae3d6', padding: '8px 11px', color: j === 0 ? '#17130f' : '#3a352e', fontWeight: j === 0 ? 600 : 400, verticalAlign: 'top', background: i === 0 ? '#faf7f2' : '#fff' }}>{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  return null;
}

export function ChapterDetail({ v }) {
  const { t, chapter } = v;
  if (!chapter) return null;
  return (
    <div style={{ animation: 'mmfade .3s ease', maxWidth: '760px' }}>
      <button onClick={v.back} style={v.backBtnStyle}>← {t.back}</button>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', margin: '14px 0 2px' }}><span style={{ fontFamily: 'Archivo', fontWeight: 900, fontSize: '44px', color: '#e9e2d6', lineHeight: .9 }}>{chapter.no}</span></div>
      <h1 style={{ fontFamily: 'Archivo', fontWeight: 800, fontSize: 'clamp(24px,4vw,34px)', margin: '0 0 6px', color: '#17130f', letterSpacing: '-.02em' }}>{chapter.title}</h1>
      {chapter.readtime && <div style={{ font: "500 12px 'IBM Plex Mono'", color: '#a49c90', marginBottom: '16px' }}>{t.readtime} {chapter.readtime}</div>}
      {chapter.thesis && <p style={{ fontSize: '17px', lineHeight: 1.6, color: '#3a352e', margin: '0 0 24px', fontWeight: 500 }}>{chapter.thesis}</p>}

      {chapter.sections.map((sec, si) => (
        <div key={si} style={{ marginBottom: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
            {sec.index && <span style={{ font: "600 12px 'IBM Plex Mono'", color: '#e8631a', letterSpacing: '.06em' }}>{sec.index}</span>}
            {sec.eyebrow && <span style={{ font: "600 11px 'IBM Plex Mono'", letterSpacing: '.14em', textTransform: 'uppercase', color: '#b8912e' }}>{sec.eyebrow}</span>}
          </div>
          <h2 style={{ fontFamily: 'Archivo', fontWeight: 800, fontSize: '19px', color: '#17130f', margin: '0 0 12px', lineHeight: 1.2 }}>{sec.heading}</h2>
          {sec.blocks.map((b, bi) => <Block key={bi} b={b} />)}
        </div>
      ))}
    </div>
  );
}

export function RecipeDetail({ v }) {
  const { t, recipe } = v;
  if (!recipe) return null;
  return (
    <div style={{ animation: 'mmfade .3s ease', maxWidth: '920px' }}>
      <button onClick={v.back} style={v.backBtnStyle}>← {t.back}</button>
      <h1 style={{ fontFamily: 'Archivo', fontWeight: 900, fontSize: 'clamp(28px,5vw,42px)', margin: '14px 0 4px', color: '#17130f', letterSpacing: '-.02em' }}>{recipe.name}</h1>
      <div style={{ fontSize: '15px', color: '#7c756c', marginBottom: '18px' }}>{recipe.bun} · {recipe.patty} · {t.tap_steps}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,300px),1fr))', gap: '20px', alignItems: 'start' }}>
        <img src={recipe.img} alt={recipe.name} style={{ width: '100%', borderRadius: '14px', border: '1px solid #e4ded4', boxShadow: '0 8px 24px rgba(0,0,0,.08)' }} />
        <div style={{ background: '#fff', border: '1px solid #e4ded4', borderRadius: '16px', overflow: 'hidden' }}>
          <div style={{ background: '#2a1c47', color: '#fff', padding: '13px 18px', fontFamily: 'Archivo', fontWeight: 800, fontSize: '15px', letterSpacing: '.02em' }}>{t.build_order}</div>
          {recipe.steps.map((st, i) => (
            <button key={i} onClick={st.toggle} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '13px', padding: '12px 18px', background: 'transparent', border: 'none', borderBottom: '1px solid #f0eae0', cursor: 'pointer', textAlign: 'left' }}>
              <span style={st.numStyle}>{st.n}</span>
              <span style={st.textStyle}>{st.text}</span>
              {st.checked && <span style={{ color: '#2e9e57', fontWeight: 800 }}>✓</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
