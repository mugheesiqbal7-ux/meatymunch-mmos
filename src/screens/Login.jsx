export default function Login({ v }) {
  const { t } = v;
  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(120% 90% at 78% 0%,#2a211a 0%,#17130f 60%)', display: 'flex', flexDirection: 'column', color: '#f6f3ee', padding: '26px 22px 40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1080px', margin: '0 auto', width: '100%' }}>
        <div style={{ font: "600 11px 'IBM Plex Mono',monospace", letterSpacing: '.24em', textTransform: 'uppercase', color: 'rgba(246,243,238,.5)' }}>MMOS · Mitarbeiter-App</div>
        <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', borderRadius: '9px', padding: '4px' }}>
          <button onClick={v.setLangDe} style={v.lg_de}>DE</button>
          <button onClick={v.setLangEn} style={v.lg_en}>EN</button>
          <button onClick={v.setLangTr} style={v.lg_tr}>TR</button>
          <button onClick={v.setLangAr} style={v.lg_ar}>AR</button>
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', maxWidth: '760px', margin: '0 auto', width: '100%', padding: '32px 0' }} dir={v.dir}>
        <img src={`${import.meta.env.BASE_URL}assets/logo-icon.jpeg`} alt="MeatyMunch" style={{ width: '110px', height: '110px', borderRadius: '24px', objectFit: 'cover', boxShadow: '0 18px 50px rgba(0,0,0,.5)', animation: 'mmpop .5s ease' }} />
        <div style={{ fontFamily: 'Archivo', fontWeight: 900, fontSize: 'clamp(34px,7vw,52px)', letterSpacing: '-.02em', margin: '22px 0 2px', textAlign: 'center', lineHeight: 1 }}>MEATY<span style={{ color: '#f07f13' }}>MUNCH</span></div>
        <div style={{ font: "600 12px 'IBM Plex Mono',monospace", letterSpacing: '.34em', textTransform: 'uppercase', color: '#b8912e' }}>{t.tagline}</div>
        <div style={{ fontSize: '16px', color: 'rgba(246,243,238,.7)', margin: '20px 0 30px', textAlign: 'center', maxWidth: '440px', lineHeight: 1.5 }}>{t.login_sub}</div>
        <div style={{ font: "600 11px 'IBM Plex Mono',monospace", letterSpacing: '.18em', textTransform: 'uppercase', color: 'rgba(246,243,238,.45)', marginBottom: '14px' }}>{t.login_choose}</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '14px', width: '100%' }}>
          <button onClick={v.loginMa} style={{ textAlign: 'left', background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.12)', borderTop: '3px solid #f07f13', borderRadius: '14px', padding: '22px 20px', color: '#f6f3ee', cursor: 'pointer', transition: '.15s' }}>
            <div style={{ font: "600 11px 'IBM Plex Mono',monospace", letterSpacing: '.14em', color: '#f5a11f' }}>01</div>
            <div style={{ fontFamily: 'Archivo', fontWeight: 800, fontSize: '21px', margin: '6px 0 4px' }}>{t.role_ma}</div>
            <div style={{ fontSize: '13px', color: 'rgba(246,243,238,.6)', lineHeight: 1.45 }}>{t.role_ma_d}</div>
          </button>
          <button onClick={v.loginSl} style={{ textAlign: 'left', background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.12)', borderTop: '3px solid #7C3AED', borderRadius: '14px', padding: '22px 20px', color: '#f6f3ee', cursor: 'pointer', transition: '.15s' }}>
            <div style={{ font: "600 11px 'IBM Plex Mono',monospace", letterSpacing: '.14em', color: '#a879f5' }}>02</div>
            <div style={{ fontFamily: 'Archivo', fontWeight: 800, fontSize: '21px', margin: '6px 0 4px' }}>{t.role_sl}</div>
            <div style={{ fontSize: '13px', color: 'rgba(246,243,238,.6)', lineHeight: 1.45 }}>{t.role_sl_d}</div>
          </button>
          <button onClick={v.loginMg} style={{ textAlign: 'left', background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.12)', borderTop: '3px solid #b8912e', borderRadius: '14px', padding: '22px 20px', color: '#f6f3ee', cursor: 'pointer', transition: '.15s' }}>
            <div style={{ font: "600 11px 'IBM Plex Mono',monospace", letterSpacing: '.14em', color: '#d8b45c' }}>03</div>
            <div style={{ fontFamily: 'Archivo', fontWeight: 800, fontSize: '21px', margin: '6px 0 4px' }}>{t.role_mgmt}</div>
            <div style={{ fontSize: '13px', color: 'rgba(246,243,238,.6)', lineHeight: 1.45 }}>{t.role_mgmt_d}</div>
          </button>
        </div>
        <div style={{ marginTop: '22px', font: "500 12px 'IBM Plex Mono',monospace", color: 'rgba(246,243,238,.4)', letterSpacing: '.05em' }}>{t.login_pinhint}</div>
      </div>
    </div>
  );
}
