import { useState, useEffect, useMemo, useCallback } from 'react';
import { getT } from '../data/translations.js';
import { supabase, isSupabaseConfigured, usernameToEmail } from '../lib/supabase.js';
import { adminCall } from '../lib/admin.js';
import { fetchOpenEntry, fetchOpenBreak, clockInDb, clockOutDb, startBreakDb, endBreakDb } from '../lib/timeclock.js';
import { handbookChapters } from '../data/handbook.js';
import { sops as sopsData } from '../data/sops.js';
import {
  getChecklists, recipes as recipesData,
  inventory as inventoryData, shifts as shiftsData, modules as modulesData,
  kpis, standorteRaw, team, baseMeld, roleColors, userNames,
} from '../data/content.js';

const initialState = {
  loggedIn: false, role: 'ma', lang: 'de', tab: 'start', homeVar: 0,
  wsub: 'sop', open: null, bsub: null, checks: {}, ordered: {}, mods: {},
  vw: typeof window !== 'undefined' ? window.innerWidth : 1200,
  query: '', tempStation: 'Kühlschrank', tempValue: '', tempLog: [],
  sickFrom: '', sickTo: '', sickReason: '', sickList: [],
  reportText: '', extraMeld: [], toast: null,
  // auth
  authReady: false, profile: null, authError: null, authErrorDetail: null, authBusy: false, uid: null,
  // team management (mgmt)
  teamUsers: [],
  // Stempeluhr
  clockEntry: null, clockBreak: null, clockLoaded: false,
};

// ---------- STYLE HELPERS ----------
function navSide(tab, id) {
  const base = { display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 14px', borderRadius: '10px', cursor: 'pointer', border: 'none', background: 'transparent', color: 'rgba(246,243,238,.6)', font: "600 14.5px 'Inter',sans-serif", width: '100%', textAlign: 'left' };
  return tab === id ? { ...base, background: '#f07f13', color: '#17130f' } : base;
}
function navBot(tab, id) {
  const a = tab === id;
  return { flex: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', padding: '7px 2px', background: 'transparent', border: 'none', cursor: 'pointer', color: a ? '#f5a11f' : 'rgba(246,243,238,.5)', font: "600 10px 'Inter'" };
}
function langBtn(lang, l, big) {
  const a = lang === l; const pad = big ? '6px 11px' : '5px 9px';
  return { padding: pad, borderRadius: '6px', border: 'none', cursor: 'pointer', font: "600 12px 'IBM Plex Mono'", background: a ? '#f07f13' : 'transparent', color: a ? '#17130f' : 'rgba(246,243,238,.6)' };
}
function hvBtn(homeVar, n) {
  const a = homeVar === n;
  return { padding: '7px 13px', borderRadius: '7px', border: 'none', cursor: 'pointer', font: "600 12.5px 'Inter'", background: a ? '#17130f' : 'transparent', color: a ? '#f6f3ee' : '#7c756c' };
}
function wsubBtn(wsub, s) {
  const a = wsub === s;
  return { padding: '9px 16px', borderRadius: '9px', border: '1px solid ' + (a ? '#17130f' : '#e4ded4'), cursor: 'pointer', font: "600 13.5px 'Inter'", background: a ? '#17130f' : '#fff', color: a ? '#f6f3ee' : '#7c756c', whiteSpace: 'nowrap' };
}
function pill(active, accent) {
  return { padding: '8px 15px', borderRadius: '8px', border: '1px solid ' + (active ? accent : '#e4ded4'), cursor: 'pointer', font: "600 13px 'Inter'", background: active ? accent : '#fff', color: active ? '#fff' : '#7c756c' };
}
function barStyle(pct, color) {
  return { height: '100%', width: pct + '%', background: color, borderRadius: '5px', transition: '.4s' };
}
function roleName(role, t) {
  return role === 'ma' ? t.role_ma : role === 'sl' ? t.role_sl : t.role_mgmt;
}
function shiftForRole(role) {
  return role === 'mgmt' ? '10:30–20:00' : role === 'sl' ? '11:30–19:30' : '11:30–19:30';
}
function tempOk(st, v) {
  if (st === 'Bain Marie') return v >= 63;
  if (st === 'Tiefkühler') return v <= -18;
  return v >= 2 && v <= 7;
}

export function useAppState() {
  const [state, setStateRaw] = useState(initialState);

  const setState = useCallback((patch) => {
    setStateRaw((s) => ({ ...s, ...(typeof patch === 'function' ? patch(s) : patch) }));
  }, []);

  useEffect(() => {
    const onResize = () => setState({ vw: window.innerWidth });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [setState]);

  // Auth: initiale Session prüfen + auf Änderungen hören; Rolle kommt aus profiles.
  useEffect(() => {
    if (!isSupabaseConfigured) { setState({ authReady: true }); return; }
    let active = true;
    async function loadProfile(userId) {
      const { data } = await supabase
        .from('profiles').select('username, display_name, role, active').eq('id', userId).single();
      if (!active) return;
      if (data && data.active) {
        setState({ loggedIn: true, role: data.role, profile: data, uid: userId, authReady: true, authError: null });
      } else if (data && !data.active) {
        await supabase.auth.signOut();
        setState({ loggedIn: false, role: 'ma', profile: null, uid: null, authReady: true, authError: 'deactivated' });
      } else {
        setState({ authReady: true });
      }
    }
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!active) return;
      if (session?.user) loadProfile(session.user.id);
      else setState({ authReady: true });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) loadProfile(session.user.id);
      else setState({ loggedIn: false, role: 'ma', profile: null, uid: null, clockEntry: null, clockBreak: null, clockLoaded: false });
    });
    return () => { active = false; sub.subscription.unsubscribe(); };
  }, [setState]);

  // Stempeluhr-Status laden, sobald eingeloggt.
  useEffect(() => {
    if (!isSupabaseConfigured || !state.uid) return;
    let active = true;
    (async () => {
      const entry = await fetchOpenEntry(state.uid);
      const brk = entry ? await fetchOpenBreak(entry.id) : null;
      if (active) setState({ clockEntry: entry, clockBreak: brk, clockLoaded: true });
    })();
    return () => { active = false; };
  }, [state.uid, setState]);

  const toastTimer = useMemo(() => ({ id: null }), []);
  const showToast = useCallback((msg) => {
    setState({ toast: msg });
    if (toastTimer.id) clearTimeout(toastTimer.id);
    toastTimer.id = setTimeout(() => setState({ toast: null }), 2600);
  }, [setState, toastTimer]);

  const actions = useMemo(() => ({
    login: (role) => setState({ loggedIn: true, role, tab: 'start', open: null, bsub: null }),
    setLang: (lang) => setState({ lang }),
    setRole: (role) => setState({ role }),
    go: (tab) => setState({ tab, open: null, bsub: null, wsub: 'sop' }),
    openDetail: (type, id) => setState({ open: { type, id } }),
    back: () => setState({ open: null }),
    openBetrieb: (sub) => setState({ tab: 'betrieb', bsub: sub, open: null }),
    backBetrieb: () => setState({ bsub: null }),
    toggleCheck: (key) => setState((s) => ({ checks: { ...s.checks, [key]: !s.checks[key] } })),
    toggleMod: (id) => setState((s) => ({ mods: { ...s.mods, [id]: !s.mods[id] } })),
    resetChecklist: (clId) => setState((s) => {
      const c = { ...s.checks };
      Object.keys(c).forEach((k) => { if (k.indexOf(clId + ':') === 0) delete c[k]; });
      return { checks: c };
    }),
    setState,
    showToast,
    signIn: async (username, password) => {
      if (!isSupabaseConfigured) return { error: 'not_configured' };
      setState({ authBusy: true, authError: null, authErrorDetail: null });
      try {
        const email = usernameToEmail(username);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          setState({ authBusy: false, authError: 'invalid', authErrorDetail: `${error.status || ''} ${error.code || error.name || ''}: ${error.message || ''}`.trim() });
          return { error: 'invalid' };
        }
        // onAuthStateChange lädt das Profil und setzt loggedIn.
        setState({ authBusy: false });
        return {};
      } catch (e) {
        setState({ authBusy: false, authError: 'invalid', authErrorDetail: 'NETZWERK/BLOCKIERT: ' + (e?.message || String(e)) });
        return { error: 'net' };
      }
    },
    logout: async () => {
      if (isSupabaseConfigured) await supabase.auth.signOut();
      setState({ loggedIn: false, role: 'ma', profile: null });
    },
  }), [setState, showToast]);

  const submitTemp = useCallback(() => {
    const v = parseFloat(state.tempValue);
    if (isNaN(v)) return;
    const st = state.tempStation;
    const ok = tempOk(st, v);
    const now = new Date();
    const time = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
    setState((s) => ({ tempLog: [{ station: st, value: v, ok, time }, ...s.tempLog], tempValue: '' }));
    showToast(getT(state.lang).temp_log + ' ✓');
  }, [state.tempValue, state.tempStation, state.lang, setState, showToast]);

  const submitSick = useCallback(() => {
    if (!state.sickFrom) return;
    const range = state.sickFrom + (state.sickTo ? ' – ' + state.sickTo : '');
    setState((s) => ({ sickList: [{ range, reason: s.sickReason || '—' }, ...s.sickList], sickFrom: '', sickTo: '', sickReason: '' }));
    showToast(getT(state.lang).submit + ' ✓');
  }, [state.sickFrom, state.sickTo, state.lang, setState, showToast]);

  const submitReport = useCallback(() => {
    const txt = state.reportText.trim();
    if (!txt) return;
    setState((s) => ({ extraMeld: [{ text: txt, meta: 'gerade eben · ' + roleName(s.role, getT(s.lang)), sev: 'neu' }, ...s.extraMeld], reportText: '' }));
    showToast(getT(state.lang).send + ' ✓');
  }, [state.reportText, state.lang, setState, showToast]);

  const orderItem = useCallback((name) => {
    setState((s) => ({ ordered: { ...s.ordered, [name]: true } }));
    showToast(getT(state.lang).ordered + ': ' + name);
  }, [state.lang, setState, showToast]);

  // ----- Team-Verwaltung (nur mgmt; läuft über die Edge Function) -----
  const refreshTeam = useCallback(async () => {
    const res = await adminCall('list');
    if (res.data?.users) setState({ teamUsers: res.data.users });
    return res;
  }, [setState]);
  const createAccount = useCallback(async (payload) => {
    const res = await adminCall('create', payload);
    if (!res.error) await refreshTeam();
    return res;
  }, [refreshTeam]);
  const setRoleFor = useCallback(async (user_id, role) => {
    const res = await adminCall('set_role', { user_id, role });
    if (!res.error) await refreshTeam();
    return res;
  }, [refreshTeam]);
  const setPasswordFor = useCallback(async (user_id, password) => {
    return adminCall('set_password', { user_id, password });
  }, []);
  const setActiveFor = useCallback(async (user_id, active) => {
    const res = await adminCall('set_active', { user_id, active });
    if (!res.error) await refreshTeam();
    return res;
  }, [refreshTeam]);

  // ----- Stempeluhr -----
  const clockIn = useCallback(async () => {
    if (!state.uid || state.clockEntry) return;
    try {
      const entry = await clockInDb(state.uid);
      setState({ clockEntry: entry, clockBreak: null });
      showToast(getT(state.lang).clock_in_done);
    } catch (e) { showToast(String(e.message || e)); }
  }, [state.uid, state.clockEntry, state.lang, setState, showToast]);
  const clockOut = useCallback(async () => {
    if (!state.clockEntry) return;
    if (state.clockBreak) await endBreakDb(state.clockBreak.id);
    await clockOutDb(state.clockEntry.id);
    setState({ clockEntry: null, clockBreak: null });
    showToast(getT(state.lang).clock_out_done);
  }, [state.clockEntry, state.clockBreak, state.lang, setState, showToast]);
  const startBreak = useCallback(async () => {
    if (!state.uid || !state.clockEntry || state.clockBreak) return;
    const brk = await startBreakDb(state.uid, state.clockEntry.id);
    setState({ clockBreak: brk });
  }, [state.uid, state.clockEntry, state.clockBreak, setState]);
  const endBreak = useCallback(async () => {
    if (!state.clockBreak) return;
    await endBreakDb(state.clockBreak.id);
    setState({ clockBreak: null });
  }, [state.clockBreak, setState]);

  const signIn = actions.signIn;
  const vals = useMemo(
    () => deriveVals(state, {
      ...actions, submitTemp, submitSick, submitReport, orderItem, signIn,
      refreshTeam, createAccount, setRoleFor, setPasswordFor, setActiveFor,
      clockIn, clockOut, startBreak, endBreak,
    }),
    [state, actions, submitTemp, submitSick, submitReport, orderItem, signIn,
      refreshTeam, createAccount, setRoleFor, setPasswordFor, setActiveFor,
      clockIn, clockOut, startBreak, endBreak]
  );

  return { state, vals };
}

// ---------- DERIVATION (ported from renderVals) ----------
function deriveVals(s, a) {
  const t = getT(s.lang);
  const isMobile = s.vw < 900;
  const cls = getChecklists(s.lang, t);
  const doneCount = (cl) => cl.items.filter((i) => s.checks[cl.id + ':' + i.id]).length;
  const pctOf = (cl) => Math.round(doneCount(cl) / cl.items.length * 100);
  const oeff = cls[0];
  const openDone = doneCount(oeff), openTotal = oeff.items.length, openPct = pctOf(oeff);

  // XP / gamification
  const totalDone = cls.reduce((acc, cl) => acc + doneCount(cl), 0);
  const modDone = modulesData.filter((m) => s.mods[m.id]).length;
  const xp = totalDone * 15 + modDone * 40;
  const level = Math.floor(xp / 200) + 1;
  const xpBase = (level - 1) * 200;
  const xpNext = level * 200;
  const badges = [
    { name: 'Erste Schicht', icon: '🏁', earned: true },
    { name: 'Saubere Station', icon: '✨', earned: totalDone >= 3 },
    { name: 'SOP-Profi', icon: '📘', earned: modDone >= 3 },
    { name: 'Team-Player', icon: '🤝', earned: s.sickList.length >= 0 },
    { name: 'Streak x5', icon: '🔥', earned: false },
  ].map((b) => ({ ...b, style: { width: '42px', height: '42px', borderRadius: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', background: b.earned ? '#fbe9d6' : '#f0eae0', border: '1px solid ' + (b.earned ? '#f0c79a' : '#e4ded4'), filter: b.earned ? 'none' : 'grayscale(1) opacity(.5)' } }));

  // checklist cards
  const checklistCards = cls.map((cl) => {
    const d = doneCount(cl), tot = cl.items.length, pct = Math.round(d / tot * 100);
    return { title: cl.title, desc: cl.desc, accent: cl.accent, done: d, total: tot, barStyle: barStyle(pct, cl.accent), badgeStyle: { font: "700 12px 'IBM Plex Mono'", padding: '3px 9px', borderRadius: '20px', background: pct === 100 ? '#e8f5ec' : '#f0eae0', color: pct === 100 ? '#1c6d3c' : '#7c756c', flex: 'none' }, open: () => a.openDetail('cl', cl.id) };
  });

  // active checklist detail
  let cl = null;
  if (s.open && s.open.type === 'cl') {
    const found = cls.find((c) => c.id === s.open.id);
    if (found) {
      const d = doneCount(found), tot = found.items.length, pct = Math.round(d / tot * 100);
      cl = {
        title: found.title, done: d, total: tot, pct, complete: d === tot, weekly: found.weekly || '', barStyle: barStyle(pct, found.accent),
        items: found.items.map((it) => {
          const key = found.id + ':' + it.id; const ch = !!s.checks[key];
          return { text: it.text, checked: ch, boxStyle: { flex: 'none', width: '24px', height: '24px', borderRadius: '7px', border: '2px solid ' + (ch ? '#2e9e57' : '#c9c0b2'), background: ch ? '#2e9e57' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '1px' }, textStyle: { fontSize: '15px', lineHeight: '1.5', color: ch ? '#a49c90' : '#2a2620', textDecoration: ch ? 'line-through' : 'none' }, toggle: () => a.toggleCheck(key) };
        }),
      };
    }
  }

  // sops
  const q = s.query.toLowerCase();
  const blockText = (b) => {
    if (b.t === 'steps') return b.items.map((it) => it.title + ' ' + it.text).join(' ');
    if (b.t === 'ul') return b.items.join(' ');
    if (b.t === 'table') return b.rows.flat().join(' ');
    return (b.label || '') + ' ' + (b.text || '');
  };
  const sopSearchText = (x) => (x.no + ' ' + x.title + ' ' + x.summary + ' ' + (x.sections || []).map((sec) => sec.heading + ' ' + (sec.blocks || []).map(blockText).join(' ')).join(' ')).toLowerCase();
  const sopsAll = sopsData.map((x) => ({ ...x, open: () => a.openDetail('sop', x.id) }));
  const sopsF = q ? sopsAll.filter((x) => sopSearchText(x).includes(q)) : sopsAll;
  let sop = null;
  if (s.open && s.open.type === 'sop') sop = sopsData.find((x) => x.id === s.open.id);

  // chapters — vollständiges Handbuch (Band 1)
  const chStatusStyle = { font: "600 10px 'IBM Plex Mono'", letterSpacing: '.06em', textTransform: 'uppercase', padding: '3px 9px', borderRadius: '20px', whiteSpace: 'nowrap', background: '#f0e6cd', color: '#8a6a15' };
  const chSearchText = (c) => (c.no + ' ' + c.title + ' ' + c.thesis + ' ' + c.sections.map((sec) => sec.heading + ' ' + sec.eyebrow + ' ' + sec.blocks.map((b) => b.text || (b.items || []).join(' ') || (b.rows ? b.rows.flat().join(' ') : '')).join(' ')).join(' ')).toLowerCase();
  const chMapped = handbookChapters.map((c) => ({ no: c.no, title: c.title, desc: c.thesis, read: c.readtime, statusLabel: 'fertig', statusStyle: chStatusStyle, open: () => a.openDetail('ch', c.no) }));
  const chaptersF = q ? chMapped.filter((c, i) => chSearchText(handbookChapters[i]).includes(q)) : chMapped;
  let chapter = null;
  if (s.open && s.open.type === 'ch') chapter = handbookChapters.find((c) => c.no === s.open.id);

  // recipes
  const recAll = recipesData.map((r) => ({ ...r, open: () => a.openDetail('rez', r.id) }));
  const recipesF = q ? recAll.filter((r) => r.name.toLowerCase().includes(q)) : recAll;
  let recipe = null;
  if (s.open && s.open.type === 'rez') {
    const r = recipesData.find((x) => x.id === s.open.id);
    if (r) {
      recipe = {
        ...r,
        steps: r.steps.map((txt, i) => {
          const key = 'rez_' + r.id + '_' + i; const ch = !!s.checks[key];
          return { n: i + 1, text: txt, checked: ch, numStyle: { flex: 'none', width: '26px', height: '26px', borderRadius: '50%', background: ch ? '#2e9e57' : '#2a1c47', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', font: "800 12px 'Archivo'" }, textStyle: { flex: '1', fontSize: '14.5px', color: ch ? '#a49c90' : '#2a2620', textDecoration: ch ? 'line-through' : 'none' }, toggle: () => a.toggleCheck(key) };
        }),
      };
    }
  }

  // inventory
  const inventory = inventoryData.map((i) => {
    const ord = !!s.ordered[i.name]; let status, col, bg;
    if (i.current <= i.min) { status = 'kritisch'; col = '#b1470f'; bg = '#fbe9d6'; }
    else if (i.current < i.min * 1.4) { status = 'niedrig'; col = '#8a6a15'; bg = '#f7f0e2'; }
    else { status = 'ok'; col = '#1c6d3c'; bg = '#e8f5ec'; }
    return { ...i, statusLabel: status, statusStyle: { display: 'inline-block', marginTop: '3px', font: "600 10px 'IBM Plex Mono'", letterSpacing: '.06em', textTransform: 'uppercase', padding: '2px 8px', borderRadius: '20px', background: bg, color: col }, order: () => a.orderItem(i.name), btnLabel: ord ? t.ordered : t.order, btnStyle: { padding: '7px 13px', borderRadius: '8px', border: 'none', cursor: ord ? 'default' : 'pointer', font: "700 12px 'Inter'", background: ord ? '#e8f5ec' : (i.current <= i.min ? '#f07f13' : '#f0eae0'), color: ord ? '#1c6d3c' : (i.current <= i.min ? '#17130f' : '#7c756c') } };
  });

  // shifts
  const shifts = shiftsData.map((d, idx) => ({ ...d, rowStyle: { display: 'flex', gap: '14px', padding: '14px 18px', borderBottom: idx < 5 ? '1px solid #f0eae0' : 'none', alignItems: 'flex-start' }, slots: d.slots.map((sl) => ({ ...sl, style: { font: "600 12px 'Inter'", padding: '5px 11px', borderRadius: '20px', background: '#f4f1ec', border: '1px solid #e4ded4', color: '#2a2620', whiteSpace: 'nowrap' } })) }));

  // temp log
  const tempLog = s.tempLog.map((e) => ({ ...e, color: e.ok ? '#1c6d3c' : '#b1470f', dotStyle: { width: '9px', height: '9px', borderRadius: '50%', background: e.ok ? '#2e9e57' : '#e8631a', flex: 'none' }, tag: e.ok ? 'OK' : 'PRÜFEN', tagStyle: { font: "600 10px 'IBM Plex Mono'", padding: '2px 8px', borderRadius: '20px', background: e.ok ? '#e8f5ec' : '#fbe9d6', color: e.ok ? '#1c6d3c' : '#b1470f' } }));

  // meldungen
  const meldungen = [...s.extraMeld, ...baseMeld].map((m) => ({ ...m, dotStyle: { width: '9px', height: '9px', borderRadius: '50%', marginTop: '5px', flex: 'none', background: m.sev === 'warn' ? '#e8631a' : m.sev === 'neu' ? '#7C3AED' : '#b8912e' } }));

  // modules / onboarding
  const modules = modulesData.map((m) => {
    const ch = !!s.mods[m.id];
    return { ...m, checked: ch, boxStyle: { flex: 'none', width: '24px', height: '24px', borderRadius: '7px', border: '2px solid ' + (ch ? '#2e9e57' : '#c9c0b2'), background: ch ? '#2e9e57' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }, textStyle: { display: 'block', fontWeight: '600', fontSize: '15px', color: ch ? '#a49c90' : '#17130f', textDecoration: ch ? 'line-through' : 'none' }, toggle: () => a.toggleMod(m.id) };
  });
  const onbDone = modDone, onbTotal = modulesData.length, onbPct = Math.round(onbDone / onbTotal * 100);

  // betrieb tiles
  const betriebTiles = [
    { key: 'time', icon: '⏱️', tint: '#e6eef7', title: t.b_time, desc: t.b_time_desc },
    { key: 'shift', icon: '📅', tint: '#e9e0f6', title: t.b_shift, desc: 'Wer wann arbeitet — diese Woche.' },
    { key: 'sick', icon: '🤒', tint: '#fbe9d6', title: t.b_sick, desc: 'Abwesenheit rechtzeitig melden.' },
    { key: 'inv', icon: '📦', tint: '#e8f0e6', title: t.b_inv, desc: 'MIN/MAX-Bestand & Nachbestellung.' },
    { key: 'suppliers', icon: '🚚', tint: '#e8f0fb', title: t.b_suppliers, desc: t.b_suppliers_desc },
    { key: 'temp', icon: '🌡️', tint: '#e6eef7', title: t.b_temp, desc: 'Temperaturen prüfen & dokumentieren.' },
    { key: 'report', icon: '📣', tint: '#f7ece0', title: t.b_report, desc: 'Probleme & Aufgaben melden.' },
    { key: 'onboard', icon: '🎓', tint: '#f0e6cd', title: t.b_onboard, desc: 'Einarbeitung & Schulungsplan.' },
  ].map((b) => ({ ...b, open: () => a.openBetrieb(b.key) }));

  // home feed cards (variant Karten)
  const feedCards = [
    { kicker: t.priority, title: t.cl_oeffnen, body: openDone + ' / ' + openTotal + ' Schritte erledigt. Mach die Station einsatzbereit.', cta: t.continue, accent: '#f07f13', action: () => a.openDetail('cl', 'oeffnen') },
    { kicker: t.myshift, title: shiftForRole(s.role), body: 'Öffnungszeiten Mo–Sa 10:30–20:00. Schichtbeginn = einsatzbereit.', cta: t.b_shift, accent: '#7C3AED', action: () => a.openBetrieb('shift') },
    { kicker: 'Build Card', title: 'Classic Smash', body: '10 Schichten, exakt nach Reihenfolge bauen. Antippen zum Nachschlagen.', cta: t.qa_recipe, accent: '#b8912e', action: () => a.openDetail('rez', 'classic') },
    { kicker: 'SOP 11', title: 'Kasse', body: 'Kundenkontakt, Sätze & Geldhandling — der Standard am Tresen.', cta: t.qa_sop, accent: '#2e9e57', action: () => a.openDetail('sop', 'kasse') },
    { kicker: t.b_onboard, title: onbDone + ' / ' + onbTotal + ' Module', body: 'Dein Schulungsfortschritt. Schließe die nächsten Module ab.', cta: t.nav_betrieb, accent: '#e8631a', action: () => a.openBetrieb('onboard') },
  ];

  // dashboard stat tiles
  const statTiles = [
    { label: t.today, value: openPct + '%', delta: t.cl_oeffnen, accent: '#f07f13' },
    { label: t.streak, value: '5 🔥', delta: 'Tage in Folge', accent: '#e8631a' },
    { label: t.level, value: level, delta: xp + ' XP', accent: '#7C3AED' },
    { label: t.b_onboard, value: onbDone + '/' + onbTotal, delta: onbPct + '%', accent: '#b8912e' },
  ];
  const clStatus = cls.map((c) => { const pct = pctOf(c); return { title: c.title, pct, barStyle: barStyle(pct, c.accent) }; });
  const standorte = standorteRaw.map((x) => ({ ...x, dotStyle: { width: '9px', height: '9px', borderRadius: '50%', flex: 'none', background: x.on ? '#2e9e57' : 'rgba(246,243,238,.3)' } }));

  const displayName = s.profile ? (s.profile.display_name || s.profile.username) : userNames[s.role];
  const now = new Date(); const h = now.getHours();
  const greeting = h < 11 ? (s.lang === 'de' ? 'Guten Morgen' : s.lang === 'en' ? 'Good morning' : s.lang === 'tr' ? 'Günaydın' : 'صباح الخير') : h < 18 ? (s.lang === 'de' ? 'Servus' : s.lang === 'en' ? 'Hello' : s.lang === 'tr' ? 'Merhaba' : 'مرحبا') : (s.lang === 'de' ? 'Guten Abend' : s.lang === 'en' ? 'Good evening' : s.lang === 'tr' ? 'İyi akşamlar' : 'مساء الخير');
  const days = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
  const dateLabel = days[now.getDay()] + ' · ' + String(now.getDate()).padStart(2, '0') + '.' + String(now.getMonth() + 1).padStart(2, '0') + '.' + now.getFullYear();

  const qaStyle = { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px', padding: '14px', background: '#f4f1ec', border: '1px solid #eee7dc', borderRadius: '12px', cursor: 'pointer', font: "600 13px 'Inter'", color: '#17130f', textAlign: 'left' };
  const qaIcon = (c) => ({ width: '30px', height: '30px', borderRadius: '8px', background: c, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', font: "800 15px 'Archivo'" });

  const inputStyle = { width: '100%', background: '#faf7f2', border: '1px solid #e4ded4', borderRadius: '10px', padding: '11px 13px', fontSize: '15px', color: '#2a2620', marginBottom: '14px' };
  const textareaStyle = { width: '100%', background: '#faf7f2', border: '1px solid #e4ded4', borderRadius: '10px', padding: '11px 13px', fontSize: '15px', color: '#2a2620', marginBottom: '14px', minHeight: '90px', resize: 'vertical', fontFamily: 'inherit' };
  const labelStyle = { display: 'block', font: "600 11px 'IBM Plex Mono'", letterSpacing: '.1em', textTransform: 'uppercase', color: '#7c756c', marginBottom: '6px' };
  const primaryBtnStyle = { background: '#f07f13', color: '#17130f', border: 'none', borderRadius: '10px', padding: '12px 24px', font: "700 14px 'Inter'", cursor: 'pointer' };
  const backBtnStyle = { background: 'transparent', border: 'none', color: '#7c756c', font: "600 13px 'Inter'", cursor: 'pointer', padding: '4px 0' };

  return {
    t, dir: s.lang === 'ar' ? 'rtl' : 'ltr',
    notLoggedIn: !s.loggedIn, loggedIn: s.loggedIn,
    // auth
    authReady: s.authReady, authError: s.authError, authErrorDetail: s.authErrorDetail, authBusy: s.authBusy,
    signIn: a.signIn, isConfigured: isSupabaseConfigured, profile: s.profile, showToast: a.showToast, uid: s.uid,
    // Stempeluhr
    clockEntry: s.clockEntry, clockBreak: s.clockBreak, clockLoaded: s.clockLoaded,
    clockedIn: !!s.clockEntry, onBreak: !!s.clockBreak,
    clockIn: a.clockIn, clockOut: a.clockOut, startBreak: a.startBreak, endBreak: a.endBreak,
    openTimeSheet: () => a.openBetrieb('time'),
    // login
    loginMa: () => a.login('ma'), loginSl: () => a.login('sl'), loginMg: () => a.login('mgmt'),
    setLangDe: () => a.setLang('de'), setLangEn: () => a.setLang('en'), setLangTr: () => a.setLang('tr'), setLangAr: () => a.setLang('ar'),
    lg_de: langBtn(s.lang, 'de', 1), lg_en: langBtn(s.lang, 'en', 1), lg_tr: langBtn(s.lang, 'tr', 1), lg_ar: langBtn(s.lang, 'ar', 1),
    lg2_de: langBtn(s.lang, 'de', 0), lg2_en: langBtn(s.lang, 'en', 0), lg2_tr: langBtn(s.lang, 'tr', 0), lg2_ar: langBtn(s.lang, 'ar', 0),
    // chrome
    roleLabel: roleName(s.role, t), userName: displayName, userInitial: (displayName || '?')[0].toUpperCase(), roleDotStyle: { width: '8px', height: '8px', borderRadius: '50%', background: roleColors[s.role] },
    taglineStyle: { font: "600 9px 'IBM Plex Mono'", letterSpacing: '.2em', textTransform: 'uppercase', color: '#b8912e', marginTop: '1px', display: isMobile ? 'none' : 'block' },
    showSidebar: !isMobile, showBottomNav: isMobile,
    mainPadStyle: { padding: isMobile ? '18px 16px 30px' : '28px 34px 40px', maxWidth: isMobile ? 'none' : '1160px', margin: '0 auto' },
    routeKey: s.tab + '_' + s.wsub + '_' + (s.open ? s.open.type + s.open.id : '') + '_' + (s.bsub || '') + '_' + s.homeVar,
    // nav
    goStart: () => a.go('start'), goCheck: () => a.go('check'), goWissen: () => a.go('wissen'), goBetrieb: () => a.go('betrieb'), goMehr: () => a.go('mehr'),
    ns_start: navSide(s.tab, 'start'), ns_check: navSide(s.tab, 'check'), ns_wissen: navSide(s.tab, 'wissen'), ns_betrieb: navSide(s.tab, 'betrieb'), ns_mehr: navSide(s.tab, 'mehr'),
    nb_start: navBot(s.tab, 'start'), nb_check: navBot(s.tab, 'check'), nb_wissen: navBot(s.tab, 'wissen'), nb_betrieb: navBot(s.tab, 'betrieb'), nb_mehr: navBot(s.tab, 'mehr'),
    level, xp, xpNext, streak: 5, xpBarStyle: { height: '100%', width: Math.min(100, Math.round((xp - xpBase) / (xpNext - xpBase) * 100)) + '%', background: '#f07f13', borderRadius: '5px', transition: '.4s' },
    // start
    isStart: s.tab === 'start' && !s.open, homeVar: s.homeVar, homeFocus: s.homeVar === 0, homeCards: s.homeVar === 1, homeDash: s.homeVar === 2,
    hv0: () => a.setState({ homeVar: 0 }), hv1: () => a.setState({ homeVar: 1 }), hv2: () => a.setState({ homeVar: 2 }),
    hv_0: hvBtn(s.homeVar, 0), hv_1: hvBtn(s.homeVar, 1), hv_2: hvBtn(s.homeVar, 2),
    greeting, dateLabel, ringOffset: 326.7 * (1 - openPct / 100), openPct, openDone, openTotal,
    openOeffnen: () => a.openDetail('cl', 'oeffnen'), openSopList: () => a.setState({ tab: 'wissen', wsub: 'sop', open: null }), openRezList: () => a.setState({ tab: 'wissen', wsub: 'rez', open: null }),
    openTemp: () => a.openBetrieb('temp'), openSick: () => a.openBetrieb('sick'), openReport: () => a.openBetrieb('report'),
    qaStyle, qaIcon1: qaIcon('#2e9e57'), qaIcon2: qaIcon('#7C3AED'), qaIcon3: qaIcon('#b8912e'), qaIcon4: qaIcon('#2b7fb8'), qaIcon5: qaIcon('#e8631a'), qaIcon6: qaIcon('#c0392b'),
    shiftToday: shiftForRole(s.role), shiftRole: roleName(s.role, t), badges, feedCards, statTiles, clStatus,
    // check
    isCheck: s.tab === 'check' && !s.open, checklistCards, clDetail: !!(s.open && s.open.type === 'cl'), cl, resetCl: () => a.resetChecklist(s.open && s.open.id), back: () => a.back(), backBtnStyle,
    // wissen
    isWissen: s.tab === 'wissen' && !s.open, query: s.query, onQuery: (e) => a.setState({ query: e.target.value }),
    wsubSop: () => a.setState({ wsub: 'sop' }), wsubHb: () => a.setState({ wsub: 'hb' }), wsubRez: () => a.setState({ wsub: 'rez' }),
    ws_sop: wsubBtn(s.wsub, 'sop'), ws_hb: wsubBtn(s.wsub, 'hb'), ws_rez: wsubBtn(s.wsub, 'rez'),
    wIsSop: s.wsub === 'sop', wIsHb: s.wsub === 'hb', wIsRez: s.wsub === 'rez',
    sopsF, chaptersF, recipesF, sopDetail: !!(s.open && s.open.type === 'sop'), sop, chDetail: !!(s.open && s.open.type === 'ch'), chapter, rezDetail: !!(s.open && s.open.type === 'rez'), recipe,
    // betrieb
    isBetrieb: s.tab === 'betrieb' && !s.bsub, betriebTiles, backBetrieb: () => a.backBetrieb(),
    bShift: s.tab === 'betrieb' && s.bsub === 'shift', shifts,
    bSick: s.tab === 'betrieb' && s.bsub === 'sick', sickFrom: s.sickFrom, sickTo: s.sickTo, sickReason: s.sickReason, sickList: s.sickList, hasSick: s.sickList.length > 0,
    onSickFrom: (e) => a.setState({ sickFrom: e.target.value }), onSickTo: (e) => a.setState({ sickTo: e.target.value }), onSickReason: (e) => a.setState({ sickReason: e.target.value }), submitSick: () => a.submitSick(),
    bInv: s.tab === 'betrieb' && s.bsub === 'inv', inventory,
    bTemp: s.tab === 'betrieb' && s.bsub === 'temp', tempStation: s.tempStation, tempValue: s.tempValue, tempLog, hasTemp: tempLog.length > 0,
    onTempStation: (e) => a.setState({ tempStation: e.target.value }), onTempValue: (e) => a.setState({ tempValue: e.target.value }), submitTemp: () => a.submitTemp(),
    bReport: s.tab === 'betrieb' && s.bsub === 'report', reportText: s.reportText, onReport: (e) => a.setState({ reportText: e.target.value }), submitReport: () => a.submitReport(), meldungen,
    bOnboard: s.tab === 'betrieb' && s.bsub === 'onboard', modules, onbDone, onbTotal, onbBarStyle: barStyle(onbPct, '#f07f13'),
    bTime: s.tab === 'betrieb' && s.bsub === 'time',
    bSuppliers: s.tab === 'betrieb' && s.bsub === 'suppliers',
    // mehr
    isMehr: s.tab === 'mehr', canMgmt: s.role === 'mgmt', mgmtLocked: s.role !== 'mgmt', kpis, standorte, team,
    rl_de: pill(s.lang === 'de', '#17130f'), rl_en: pill(s.lang === 'en', '#17130f'), rl_tr: pill(s.lang === 'tr', '#17130f'), rl_ar: pill(s.lang === 'ar', '#17130f'),
    logout: () => a.logout(),
    // team management (mgmt only)
    teamUsers: s.teamUsers,
    refreshTeam: a.refreshTeam, createAccount: a.createAccount,
    setRoleFor: a.setRoleFor, setPasswordFor: a.setPasswordFor, setActiveFor: a.setActiveFor,
    // forms shared
    inputStyle, textareaStyle, labelStyle, primaryBtnStyle,
    // toast
    hasToast: !!s.toast, toast: s.toast,
  };
}
