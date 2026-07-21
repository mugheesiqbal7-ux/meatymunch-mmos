import { useAppState } from './state/useAppState.js';
import Login from './screens/Login.jsx';
import Shell from './screens/Shell.jsx';

export default function App() {
  const { vals } = useAppState();
  if (!vals.authReady) return <Splash />;
  if (vals.notLoggedIn) return <Login v={vals} />;
  return <Shell v={vals} />;
}

function Splash() {
  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(120% 90% at 78% 0%,#2a211a 0%,#17130f 60%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <img src={`${import.meta.env.BASE_URL}assets/logo-icon.jpeg`} alt="" style={{ width: '84px', height: '84px', borderRadius: '20px', objectFit: 'cover', animation: 'mmpop .6s ease' }} />
    </div>
  );
}
