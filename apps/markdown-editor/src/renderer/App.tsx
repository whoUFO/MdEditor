import { useEffect, useState } from 'react';
import { MainLayout } from './components/layout/MainLayout';
import { Settings } from './components/settings/Settings';
import { useShortcuts } from './hooks/useShortcuts';
import { useSettingsStore } from './stores/settingsStore';
import { useFileStore } from './stores/fileStore';
import { useEditorStore } from './stores/editorStore';
import type { FileState } from '@shared/types';

function App() {
  const { theme } = useSettingsStore();
  const { setCurrentFile, addRecentFile } = useFileStore();
  const { loadContent, markDirty } = useEditorStore();
  const [settingsOpen, setSettingsOpen] = useState(false);

  useShortcuts();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleFileOpened = (_event: unknown, data: { path: string; name: string; content: string; encoding: string }) => {
      const file: FileState = {
        path: data.path,
        name: data.name,
        content: data.content,
        encoding: data.encoding,
      };
      setCurrentFile(file);
      addRecentFile({ path: data.path, name: data.name });
      loadContent(data.content);
      markDirty(false);
    };

    const handleMenuSave = () => {
      useFileStore.getState().saveFile();
    };

    const handleMenuSaveAs = () => {
      useFileStore.getState().saveAsFile();
    };

    window.electronAPI.onFileOpened(handleFileOpened);
    window.electronAPI.onMenuSave(handleMenuSave);
    window.electronAPI.onMenuSaveAs(handleMenuSaveAs);

    return () => {
      window.electronAPI.onFileOpened(() => {});
      window.electronAPI.onMenuSave(() => {});
      window.electronAPI.onMenuSaveAs(() => {});
    };
  }, [setCurrentFile, addRecentFile, loadContent, markDirty]);

  return (
    <>
      <MainLayout onOpenSettings={() => setSettingsOpen(true)} />
      <Settings isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
}

export default App;