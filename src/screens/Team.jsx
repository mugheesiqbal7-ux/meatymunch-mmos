import { useState, useEffect } from 'react';

const ROLES = ['ma', 'sl', 'mgmt'];

export default function Team({ v }) {
  const { t } = v;
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('ma');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { v.refreshTeam(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const roleLabel = (r) => (r === 'ma' ? t.role_ma : r === 'sl' ? t.role_sl : t.role_mgmt);

  async function create(e) {
    e.preventDefault();
    setError('');
    if (!/^[a-z0-9._-]{3,32}$/.test(username.trim().toLowerCase())) { setError(t.team_err_username); return; }
    if (password.length < 6) { setError(t.team_err_password); return; }
    setBusy(true);
    const res = await v.createAccount({ username: username.trim().toLowerCase(), display_name: name.trim(), password, role });
    setBusy(false);
    if (res.error) { setError(res.error); return; }
    v.showToast(t.team_created + ': ' + username.trim().toLowerCase());
    setUsername(''); setName(''); setPassword(''); setRole('ma');
  }

  async function changeRole(u, newRole) {
    const res = await v.setRoleFor(u.id, newRole);
    if (res.error) v.showToast(res.error);
  }
  async function resetPw(u) {
    const pw = window.prompt(t.team_resetpw_prompt);
    if (!pw) return;
    if (pw.length < 6) { v.showToast(t.team_err_password); return; }
    const res = await v.setPasswordFor(u.id, pw);
    v.showToast(res.error ? res.error : t.team_pw_set);
  }
  async function toggleActive(u) {
    if (u.active && !window.confirm(t.team_confirm_deactivate)) return;
    const res = await v.setActiveFor(u.id, !u.active);
    if (res.error) v.showToast(res.error);
  }

  const others = v.teamUsers.filter((u) => u.username !== (v.profile?.username));

  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={cardHead}>
        <div style={{ fontFamily: 'Archivo', fontWeight: 800, fontSize: '18px', color: '#17130f' }}>{t.team_h}</div>
        <div style={{ fontSize: '13px', color: '#7c756c', marginTop: '3px' }}>{t.team_sub}</div>
      </div>

      {/* Neues Konto */}
      <form onSubmit={create} style={{ background: '#fff', border: '1px solid #e4ded4', borderRadius: '16px', padding: '20px', marginBottom: '16px' }}>
        <div style={{ font: "600 11px 'IBM Plex Mono'", letterSpacing: '.12em', textTransform: 'uppercase', color: '#7c756c', marginBottom: '14px' }}>{t.team_new}</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,180px),1fr))', gap: '12px' }}>
          <div>
            <label style={lbl}>{t.team_username}</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} autoCapitalize="none" spellCheck={false} placeholder="yusuf" style={inp} />
          </div>
          <div>
            <label style={lbl}>{t.team_name}</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Yusuf K." style={inp} />
          </div>
          <div>
            <label style={lbl}>{t.team_password}</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="min. 6" style={inp} />
          </div>
          <div>
            <label style={lbl}>{t.team_role}</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} style={inp}>
              {ROLES.map((r) => <option key={r} value={r}>{roleLabel(r)}</option>)}
            </select>
          </div>
        </div>
        {error && <div style={{ background: '#fbe9d6', border: '1px solid #f0c79a', color: '#b1470f', borderRadius: '9px', padding: '9px 12px', fontSize: '13px', marginTop: '12px' }}>{error}</div>}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', marginTop: '14px' }}>
          <button type="submit" disabled={busy} style={{ background: '#f07f13', color: '#17130f', border: 'none', borderRadius: '10px', padding: '11px 22px', font: "700 14px Inter", cursor: busy ? 'default' : 'pointer', opacity: busy ? 0.7 : 1 }}>{busy ? '…' : t.team_create}</button>
          <span style={{ fontSize: '12.5px', color: '#a49c90', lineHeight: 1.4, flex: 1, minWidth: '180px' }}>{t.team_hint}</span>
        </div>
      </form>

      {/* Konten-Liste */}
      <div style={{ background: '#fff', border: '1px solid #e4ded4', borderRadius: '16px', overflow: 'hidden' }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid #f0eae0', font: "600 11px 'IBM Plex Mono'", letterSpacing: '.12em', textTransform: 'uppercase', color: '#7c756c' }}>{t.team_list} · {v.teamUsers.length}</div>
        {/* eigenes Konto zuerst, nicht editierbar */}
        {v.profile && (
          <Row self label={`${v.profile.display_name || v.profile.username} ${t.team_you}`} sub={`@${v.profile.username} · ${roleLabel(v.profile.role)}`} />
        )}
        {others.length === 0 && (
          <div style={{ padding: '18px', fontSize: '13.5px', color: '#a49c90' }}>{t.team_none}</div>
        )}
        {others.map((u) => (
          <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '13px 18px', borderTop: '1px solid #f0eae0', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '150px' }}>
              <div style={{ fontWeight: 600, color: '#17130f', fontSize: '14px' }}>{u.display_name || u.username}</div>
              <div style={{ font: "500 11px 'IBM Plex Mono'", color: '#a49c90', marginTop: '2px' }}>@{u.username}{u.active ? '' : ' · ' + t.team_inactive}</div>
            </div>
            <select value={u.role} onChange={(e) => changeRole(u, e.target.value)} style={{ ...inp, width: 'auto', marginBottom: 0, padding: '7px 10px', fontSize: '13px' }}>
              {ROLES.map((r) => <option key={r} value={r}>{roleLabel(r)}</option>)}
            </select>
            <button onClick={() => resetPw(u)} style={miniBtn}>{t.team_resetpw}</button>
            <button onClick={() => toggleActive(u)} style={{ ...miniBtn, color: u.active ? '#b1470f' : '#1c6d3c', borderColor: u.active ? '#f0c79a' : '#bfe3cb', background: u.active ? '#fbe9d6' : '#e8f5ec' }}>{u.active ? t.team_deactivate : t.team_activate}</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Row({ label, sub }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '13px 18px' }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, color: '#17130f', fontSize: '14px' }}>{label}</div>
        <div style={{ font: "500 11px 'IBM Plex Mono'", color: '#a49c90', marginTop: '2px' }}>{sub}</div>
      </div>
      <span style={{ font: "600 10px 'IBM Plex Mono'", letterSpacing: '.08em', textTransform: 'uppercase', color: '#8a6a15', background: '#f7f0e2', border: '1px solid #e5d6b3', borderRadius: '20px', padding: '3px 10px' }}>mgmt</span>
    </div>
  );
}

const cardHead = { marginBottom: '14px' };
const lbl = { display: 'block', font: "600 11px 'IBM Plex Mono'", letterSpacing: '.08em', textTransform: 'uppercase', color: '#7c756c', marginBottom: '6px' };
const inp = { width: '100%', background: '#faf7f2', border: '1px solid #e4ded4', borderRadius: '10px', padding: '10px 12px', fontSize: '14px', color: '#2a2620', marginBottom: 0, fontFamily: 'inherit' };
const miniBtn = { background: '#f4f1ec', border: '1px solid #e4ded4', borderRadius: '8px', padding: '7px 12px', font: "600 12.5px Inter", color: '#17130f', cursor: 'pointer', whiteSpace: 'nowrap' };
