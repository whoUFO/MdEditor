import { useEffect } from 'react';
import { MainLayout } from './components/layout/MainLayout';
import { useShortcuts } from './hooks/useShortcuts';
import { useSettingsStore } from './stores/settingsStore';

function App() {
  const { theme } = useSettingsStore();

  useShortcuts();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return <MainLayout />;
}

export default App;
