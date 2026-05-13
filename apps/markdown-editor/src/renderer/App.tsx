import { useEffect, useState } from 'react';
import { MainLayout } from './components/layout/MainLayout';
import { Settings } from './components/settings/Settings';
import { useShortcuts } from './hooks/useShortcuts';
import { useSettingsStore } from './stores/settingsStore';

function App() {
  const { theme } = useSettingsStore();
  const [settingsOpen, setSettingsOpen] = useState(false);

  useShortcuts();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <>
      <MainLayout />
      <Settings isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
}

export default App;
