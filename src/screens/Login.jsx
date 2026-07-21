import { useState } from 'react';

export default function Login({ v }) {
  const { t } = v;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function submit(e) {
    e.preventDefault();
    // Versehentliche Leerzeichen (Handy-Autovervollständigung) entfernen.
    const u = username.trim();
    const p = password.trim();
    if (!u || !p || submitting) return;
    setSubmitting(true);
    await v.signIn(u, p);
    setSubmitting(false);
  }

  const errorText = v.authError === 'invalid' ? t.login_error
    : v.authError === 'deactivated' ? t.login_deactivated
    : v.authError === 'not_configured' ? t.login_notconfigured
    : '';

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
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', maxWidth: '420px', margin: '0 auto', width: '100%', padding: '32px 0' }} dir={v.dir}>
        <img src={`${import.meta.env.BASE_URL}assets/logo-icon.jpeg`} alt="MeatyMunch" style={{ width: '96px', height: '96px', borderRadius: '22px', objectFit: 'cover', boxShadow: '0 18px 50px rgba(0,0,0,.5)', animation: 'mmpop .5s ease' }} />
        <div style={{ fontFamily: 'Archivo', fontWeight: 900, fontSize: 'clamp(30px,7vw,44px)', letterSpacing: '-.02em', margin: '20px 0 2px', textAlign: 'center', lineHeight: 1 }}>MEATY<span style={{ color: '#f07f13' }}>MUNCH</span></div>
        <div style={{ font: "600 12px 'IBM Plex Mono',monospace", letterSpacing: '.34em', textTransform: 'uppercase', color: '#b8912e' }}>{t.tagline}</div>
        <div style={{ fontSize: '15px', color: 'rgba(246,243,238,.7)', margin: '18px 0 26px', textAlign: 'center', lineHeight: 1.5 }}>{t.login_signin_sub}</div>

        <form onSubmit={submit} style={{ width: '100%' }}>
          <label style={loginLabel}>{t.login_username}</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoCapitalize="none" autoCorrect="off" spellCheck={false}
            placeholder={t.login_username_ph}
            style={loginInput}
          />
          <label style={loginLabel}>{t.login_password}</label>
          <div style={{ position: 'relative', marginBottom: '14px' }}>
            <input
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoCapitalize="none" autoCorrect="off" spellCheck={false}
              placeholder="••••••••"
              style={{ ...loginInput, marginBottom: 0, paddingRight: '46px' }}
            />
            <button
              type="button"
              onClick={() => setShowPw((s) => !s)}
              aria-label={showPw ? 'Passwort verbergen' : 'Passwort anzeigen'}
              style={{ position: 'absolute', right: '6px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px', fontSize: '17px', lineHeight: 1, color: 'rgba(246,243,238,.8)' }}
            >{showPw ? '🙈' : '👁'}</button>
          </div>
          {errorText && (
            <div style={{ background: 'rgba(232,99,26,.15)', border: '1px solid rgba(232,99,26,.4)', color: '#f5a11f', borderRadius: '10px', padding: '10px 14px', fontSize: '13px', margin: '2px 0 14px' }}>{errorText}</div>
          )}
          <button type="submit" disabled={submitting || v.authBusy} style={{ width: '100%', background: '#f07f13', color: '#17130f', border: 'none', borderRadius: '11px', padding: '14px', font: "700 15px Inter", cursor: submitting ? 'default' : 'pointer', opacity: submitting || v.authBusy ? 0.7 : 1, marginTop: '4px' }}>
            {submitting || v.authBusy ? '…' : t.login_signin}
          </button>
        </form>
        <div style={{ marginTop: '20px', font: "500 12px 'IBM Plex Mono',monospace", color: 'rgba(246,243,238,.4)', letterSpacing: '.03em', textAlign: 'center', lineHeight: 1.5 }}>{t.login_help}</div>
      </div>
    </div>
  );
}

const loginLabel = { display: 'block', font: "600 11px 'IBM Plex Mono',monospace", letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(246,243,238,.55)', margin: '0 0 6px' };
const loginInput = { width: '100%', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.14)', borderRadius: '10px', padding: '13px 14px', fontSize: '15px', color: '#f6f3ee', marginBottom: '14px' };
