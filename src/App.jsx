import { useAppState } from './state/useAppState.js';
import Login from './screens/Login.jsx';
import Shell from './screens/Shell.jsx';

export default function App() {
  const { vals } = useAppState();
  if (vals.notLoggedIn) return <Login v={vals} />;
  return <Shell v={vals} />;
}
