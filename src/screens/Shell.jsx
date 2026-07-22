import { IconHome, IconCheck, IconBook, IconCalendar, IconGear, IconDots } from './Icons.jsx';
import Start from './Start.jsx';
import { ChecklistList, ChecklistDetail } from './Checklists.jsx';
import { WissenHub, SopDetail, ChapterDetail, RecipeDetail } from './Wissen.jsx';
import { BetriebLanding, BetriebShift, BetriebSick, BetriebInventory, BetriebTemp, BetriebReport, BetriebOnboarding } from './Betrieb.jsx';
import TimeSheet from './TimeSheet.jsx';
import Suppliers from './Suppliers.jsx';
import Mehr from './Mehr.jsx';

function Content({ v }) {
  if (v.isStart) return <Start v={v} />;
  if (v.clDetail) return <ChecklistDetail v={v} />;
  if (v.isCheck) return <ChecklistList v={v} />;
  if (v.isWissen) return <WissenHub v={v} />;
  if (v.sopDetail) return <SopDetail v={v} />;
  if (v.chDetail) return <ChapterDetail v={v} />;
  if (v.rezDetail) return <RecipeDetail v={v} />;
  if (v.isBetrieb) return <BetriebLanding v={v} />;
  if (v.bTime) return <TimeSheet v={v} />;
  if (v.bSuppliers) return <Suppliers v={v} />;
  if (v.bShift) return <BetriebShift v={v} />;
  if (v.bSick) return <BetriebSick v={v} />;
  if (v.bInv) return <BetriebInventory v={v} />;
  if (v.bTemp) return <BetriebTemp v={v} />;
  if (v.bReport) return <BetriebReport v={v} />;
  if (v.bOnboard) return <BetriebOnboarding v={v} />;
  if (v.isMehr) return <Mehr v={v} />;
  return null;
}

export default function Shell({ v }) {
  const { t } = v;
  return (
    <div dir={v.dir} style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#f4f1ec', overflow: 'hidden' }}>
      {/* TOP BAR */}
      <header style={{ flex: 'none', background: '#17130f', color: '#f6f3ee', display: 'flex', alignItems: 'center', gap: '14px', padding: 'env(safe-area-inset-top) calc(16px + env(safe-area-inset-right)) 0 calc(16px + env(safe-area-inset-left))', height: 'calc(60px + env(safe-area-inset-top))', borderBottom: '1px solid rgba(255,255,255,.08)', zIndex: 20 }}>
        <button onClick={v.goStart} className="mm-press" style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#f6f3ee', padding: 0 }}>
          <img src={`${import.meta.env.BASE_URL}assets/logo-icon.jpeg`} alt="Home" style={{ width: '38px', height: '38px', borderRadius: '9px', objectFit: 'cover', flex: 'none' }} />
          <div style={{ lineHeight: 1, textAlign: 'left' }}>
            <div style={{ fontFamily: 'Archivo', fontWeight: 900, fontSize: '17px', letterSpacing: '-.01em' }}>MEATY<span style={{ color: '#f07f13' }}>MUNCH</span></div>
            <div style={v.taglineStyle}>{t.tagline}</div>
          </div>
        </button>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', gap: '3px', background: 'rgba(255,255,255,.06)', borderRadius: '8px', padding: '3px' }}>
          <button onClick={v.setLangDe} style={v.lg2_de}>DE</button>
          <button onClick={v.setLangEn} style={v.lg2_en}>EN</button>
          <button onClick={v.setLangTr} style={v.lg2_tr}>TR</button>
          <button onClick={v.setLangAr} style={v.lg2_ar}>AR</button>
        </div>
        <button onClick={v.goMehr} style={{ display: 'flex', alignItems: 'center', gap: '9px', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', borderRadius: '30px', padding: '5px 6px 5px 12px', color: '#f6f3ee', cursor: 'pointer' }}>
          <span style={v.roleDotStyle} />
          <span style={{ font: "600 12px Inter", letterSpacing: '.02em' }}>{v.roleLabel}</span>
          <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#f07f13', color: '#17130f', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Archivo', fontWeight: 800, fontSize: '13px' }}>{v.userInitial}</span>
        </button>
      </header>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* SIDEBAR (desktop) */}
        {v.showSidebar && (
          <nav style={{ flex: 'none', width: '236px', background: '#1e1813', borderRight: '1px solid rgba(255,255,255,.06)', padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '5px', overflowY: 'auto' }}>
            <div style={{ font: "600 10px 'IBM Plex Mono',monospace", letterSpacing: '.16em', textTransform: 'uppercase', color: 'rgba(246,243,238,.32)', padding: '6px 14px 8px' }}>Navigation</div>
            <button onClick={v.goStart} style={v.ns_start}><IconHome />{t.nav_start}</button>
            <button onClick={v.goCheck} style={v.ns_check}><IconCheck />{t.nav_check}</button>
            <button onClick={v.goWissen} style={v.ns_wissen}><IconBook />{t.nav_wissen}</button>
            <button onClick={v.goBetrieb} style={v.ns_betrieb}><IconCalendar />{t.nav_betrieb}</button>
            <button onClick={v.goMehr} style={v.ns_mehr}><IconGear />{t.nav_mehr}</button>
            <div style={{ flex: 1 }} />
            <div style={{ background: 'rgba(240,127,19,.1)', border: '1px solid rgba(240,127,19,.25)', borderRadius: '12px', padding: '14px', margin: '8px 4px' }}>
              <div style={{ font: "600 10px 'IBM Plex Mono',monospace", letterSpacing: '.12em', textTransform: 'uppercase', color: '#f5a11f', marginBottom: '6px' }}>{t.level} {v.level}</div>
              <div style={{ height: '7px', background: 'rgba(255,255,255,.12)', borderRadius: '5px', overflow: 'hidden' }}><div style={v.xpBarStyle} /></div>
              <div style={{ fontSize: '11px', color: 'rgba(246,243,238,.6)', marginTop: '7px' }}>{v.xp} / {v.xpNext} XP · {v.streak}🔥</div>
            </div>
          </nav>
        )}

        {/* MAIN CONTENT */}
        <main style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
          <div style={v.mainPadStyle} key={v.routeKey}>
            <Content v={v} />
          </div>
        </main>
      </div>

      {/* BOTTOM NAV (mobile) */}
      {v.showBottomNav && (
        <nav style={{ flex: 'none', background: '#17130f', borderTop: '1px solid rgba(255,255,255,.08)', display: 'flex', padding: '6px calc(4px + env(safe-area-inset-right)) calc(6px + env(safe-area-inset-bottom)) calc(4px + env(safe-area-inset-left))', zIndex: 20 }}>
          <button onClick={v.goStart} style={v.nb_start}><IconHome size={21} />{t.nav_start}</button>
          <button onClick={v.goCheck} style={v.nb_check}><IconCheck size={21} />{t.nav_check}</button>
          <button onClick={v.goWissen} style={v.nb_wissen}><IconBook size={21} />{t.nav_wissen}</button>
          <button onClick={v.goBetrieb} style={v.nb_betrieb}><IconCalendar size={21} />{t.nav_betrieb}</button>
          <button onClick={v.goMehr} style={v.nb_mehr}><IconDots size={21} />{t.nav_mehr}</button>
        </nav>
      )}

      {/* TOAST */}
      {v.hasToast && (
        <div style={{ position: 'fixed', left: '50%', bottom: '84px', transform: 'translateX(-50%)', background: '#17130f', color: '#f6f3ee', padding: '13px 22px', borderRadius: '30px', font: "600 14px Inter", boxShadow: '0 12px 34px rgba(0,0,0,.4)', zIndex: 60, display: 'flex', alignItems: 'center', gap: '9px', animation: 'mmtoast .3s ease', border: '1px solid rgba(240,127,19,.4)' }}>
          <span style={{ color: '#f5a11f', fontSize: '16px' }}>✓</span>{v.toast}
        </div>
      )}
    </div>
  );
}
