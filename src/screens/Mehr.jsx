export default function Mehr({ v }) {
  const { t } = v;
  return (
    <div style={{ animation: 'mmfade .3s ease', maxWidth: '900px' }}>
      <div style={{ marginBottom: '18px' }}>
        <div style={{ font: "600 12px 'IBM Plex Mono'", letterSpacing: '.12em', textTransform: 'uppercase', color: '#b8912e' }}>{t.nav_mehr}</div>
        <h1 style={{ fontFamily: 'Archivo', fontWeight: 800, fontSize: 'clamp(24px,4vw,34px)', margin: '6px 0 0', color: '#17130f', letterSpacing: '-.02em' }}>{t.mehr_h}</h1>
      </div>

      {v.canMgmt && (
        <div style={{ background: '#17130f', color: '#f6f3ee', borderRadius: '18px', padding: '24px', marginBottom: '20px' }}>
          <div style={{ font: "600 11px 'IBM Plex Mono'", letterSpacing: '.14em', textTransform: 'uppercase', color: '#f5a11f', marginBottom: '16px' }}>{t.mgmt_dash} · Idar-Oberstein</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))', gap: '12px', marginBottom: '20px' }}>
            {v.kpis.map((k, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: '12px', padding: '15px 16px' }}>
                <div style={{ font: "600 10px 'IBM Plex Mono'", letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(246,243,238,.5)' }}>{k.label}</div>
                <div style={{ fontFamily: 'Archivo', fontWeight: 900, fontSize: '26px', marginTop: '5px' }}>{k.value}</div>
                <div style={{ fontSize: '12px', color: '#7fd39b', fontWeight: 600, marginTop: '2px' }}>{k.delta}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,240px),1fr))', gap: '16px' }}>
            <div>
              <div style={{ font: "600 10px 'IBM Plex Mono'", letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(246,243,238,.5)', marginBottom: '10px' }}>{t.standorte}</div>
              {v.standorte.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,.07)' }}>
                  <span style={s.dotStyle} />
                  <span style={{ flex: 1, fontSize: '14px' }}>{s.name}</span>
                  <span style={{ font: "500 11px 'IBM Plex Mono'", color: 'rgba(246,243,238,.5)' }}>{s.status}</span>
                </div>
              ))}
            </div>
            <div>
              <div style={{ font: "600 10px 'IBM Plex Mono'", letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(246,243,238,.5)', marginBottom: '10px' }}>{t.team}</div>
              {v.team.map((p, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,.07)' }}>
                  <span style={{ width: '26px', height: '26px', borderRadius: '50%', background: p.color, color: '#17130f', display: 'flex', alignItems: 'center', justifyContent: 'center', font: "800 11px 'Archivo'" }}>{p.initial}</span>
                  <span style={{ flex: 1, fontSize: '14px' }}>{p.name}</span>
                  <span style={{ font: "500 11px 'IBM Plex Mono'", color: 'rgba(246,243,238,.5)' }}>{p.role}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {v.mgmtLocked && (
        <div style={{ background: '#f7f0e2', border: '1px dashed #e5d6b3', borderRadius: '16px', padding: '22px', marginBottom: '20px', display: 'flex', gap: '14px', alignItems: 'center' }}>
          <span style={{ fontSize: '24px' }}>🔒</span>
          <div>
            <div style={{ fontFamily: 'Archivo', fontWeight: 800, fontSize: '17px', color: '#8a6a15' }}>{t.mgmt_dash}</div>
            <div style={{ fontSize: '13.5px', color: '#8a7f66', marginTop: '3px' }}>{t.mgmt_locked}</div>
          </div>
        </div>
      )}

      <div style={{ background: '#fff', border: '1px solid #e4ded4', borderRadius: '16px', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0eae0' }}>
          <div style={{ font: "600 11px 'IBM Plex Mono'", letterSpacing: '.12em', textTransform: 'uppercase', color: '#7c756c', marginBottom: '10px' }}>{t.roleswitch}</div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <button onClick={v.setRoleMa} style={v.rs_ma}>{t.role_ma}</button>
            <button onClick={v.setRoleSl} style={v.rs_sl}>{t.role_sl}</button>
            <button onClick={v.setRoleMg} style={v.rs_mg}>{t.role_mgmt}</button>
          </div>
        </div>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0eae0' }}>
          <div style={{ font: "600 11px 'IBM Plex Mono'", letterSpacing: '.12em', textTransform: 'uppercase', color: '#7c756c', marginBottom: '10px' }}>{t.language}</div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <button onClick={v.setLangDe} style={v.rl_de}>Deutsch</button>
            <button onClick={v.setLangEn} style={v.rl_en}>English</button>
            <button onClick={v.setLangTr} style={v.rl_tr}>Türkçe</button>
            <button onClick={v.setLangAr} style={v.rl_ar}>العربية</button>
          </div>
          <div style={{ fontSize: '12px', color: '#a49c90', marginTop: '10px', lineHeight: 1.4 }}>{t.i18n_note}</div>
        </div>
        <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div style={{ fontWeight: 600, color: '#17130f' }}>MeatyMunch MMOS · v1.0</div>
            <div style={{ fontSize: '12.5px', color: '#a49c90' }}>{t.confidential}</div>
          </div>
          <button onClick={v.logout} style={{ background: '#fbe9d6', border: '1px solid #f0c79a', borderRadius: '10px', padding: '10px 20px', font: "700 13px Inter", color: '#b1470f', cursor: 'pointer' }}>{t.logout}</button>
        </div>
      </div>
    </div>
  );
}
