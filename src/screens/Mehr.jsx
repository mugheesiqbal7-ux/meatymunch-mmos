import Team from './Team.jsx';
import MgmtDashboard from './MgmtDashboard.jsx';

export default function Mehr({ v }) {
  const { t } = v;
  return (
    <div style={{ animation: 'mmfade .3s ease', maxWidth: '900px' }}>
      <div style={{ marginBottom: '18px' }}>
        <div style={{ font: "600 12px 'IBM Plex Mono'", letterSpacing: '.12em', textTransform: 'uppercase', color: '#b8912e' }}>{t.nav_mehr}</div>
        <h1 style={{ fontFamily: 'Archivo', fontWeight: 800, fontSize: 'clamp(24px,4vw,34px)', margin: '6px 0 0', color: '#17130f', letterSpacing: '-.02em' }}>{t.mehr_h}</h1>
      </div>

      {v.canMgmt && <MgmtDashboard v={v} />}

      {v.mgmtLocked && (
        <div style={{ background: '#f7f0e2', border: '1px dashed #e5d6b3', borderRadius: '16px', padding: '22px', marginBottom: '20px', display: 'flex', gap: '14px', alignItems: 'center' }}>
          <span style={{ fontSize: '24px' }}>🔒</span>
          <div>
            <div style={{ fontFamily: 'Archivo', fontWeight: 800, fontSize: '17px', color: '#8a6a15' }}>{t.mgmt_dash}</div>
            <div style={{ fontSize: '13.5px', color: '#8a7f66', marginTop: '3px' }}>{t.mgmt_locked}</div>
          </div>
        </div>
      )}

      {/* Team-Verwaltung — nur Geschäftsführung */}
      {v.canMgmt && <Team v={v} />}

      <div style={{ background: '#fff', border: '1px solid #e4ded4', borderRadius: '16px', overflow: 'hidden' }}>
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
