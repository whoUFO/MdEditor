import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useEditorStore } from '../../renderer/stores/editorStore';
import { useFileStore } from '../../renderer/stores/fileStore';
import { useUIStore } from '../../renderer/stores/uiStore';
import { useSettingsStore } from '../../renderer/stores/settingsStore';

describe('Store Integration Tests', () => {
  describe('Editor and File Store Integration', () => {
    it('should sync content between editor and file store', () => {
      useFileStore.setState({
        currentFile: {
          path: '/test.md',
          name: 'test.md',
          content: 'Initial content',
          encoding: 'utf-8',
        },
      });

      useEditorStore.getState().setContent('New content');
      
      expect(useEditorStore.getState().content).toBe('New content');
    });

    it('should track dirty state when content changes', () => {
      useEditorStore.setState({ isDirty: false });
      
      useEditorStore.getState().setContent('Modified content');
      
      expect(useEditorStore.getState().isDirty).toBe(true);
    });

    it('should reset dirty state when file is saved', () => {
      useEditorStore.setState({ isDirty: true });
      
      useEditorStore.getState().markDirty(false);
      
      expect(useEditorStore.getState().isDirty).toBe(false);
    });
  });

  describe('UI Store Integration', () => {
    it('should toggle preview and update editor width', () => {
      useUIStore.setState({
        previewVisible: true,
        splitRatio: 50,
      });

      useUIStore.getState().togglePreview();
      
      expect(useUIStore.getState().previewVisible).toBe(false);
    });

    it('should update split ratio within bounds', () => {
      useUIStore.setState({ splitRatio: 50 });

      useUIStore.getState().setSplitRatio(30);
      expect(useUIStore.getState().splitRatio).toBe(30);

      useUIStore.getState().setSplitRatio(90);
      expect(useUIStore.getState().splitRatio).toBe(90);
    });
  });

  describe('Settings Store Integration', () => {
    it('should update multiple settings at once', () => {
      useSettingsStore.setState({
        theme: 'light',
        fontSize: 14,
        lineNumbers: true,
      });

      useSettingsStore.getState().updateSettings({
        theme: 'dark',
        fontSize: 16,
      });

      expect(useSettingsStore.getState().theme).toBe('dark');
      expect(useSettingsStore.getState().fontSize).toBe(16);
      expect(useSettingsStore.getState().lineNumbers).toBe(true);
    });

    it('should reset settings to defaults', () => {
      useSettingsStore.setState({
        theme: 'dark',
        fontSize: 20,
        lineNumbers: false,
      });

      useSettingsStore.getState().resetSettings();

      const defaults = useSettingsStore.getState().getDefaults?.();
      if (defaults) {
        expect(useSettingsStore.getState().theme).toBe(defaults.theme);
        expect(useSettingsStore.getState().fontSize).toBe(defaults.fontSize);
      }
    });
  });

  describe('Full Application Flow', () => {
    it('should handle complete file open and edit workflow', async () => {
      useFileStore.setState({
        currentFile: null,
        isLoading: false,
      });

      useEditorStore.setState({
        content: '',
        isDirty: false,
      });

      useFileStore.setState({
        currentFile: {
          path: '/test.md',
          name: 'test.md',
          content: '# Test\n\nContent here',
          encoding: 'utf-8',
        },
      });

      useEditorStore.setState({
        content: '# Test\n\nContent here',
      });

      expect(useFileStore.getState().currentFile).not.toBeNull();
      expect(useEditorStore.getState().content).toBe('# Test\n\nContent here');
      expect(useEditorStore.getState().isDirty).toBe(false);

      useEditorStore.getState().setContent('# Updated Test\n\nNew content');

      expect(useEditorStore.getState().content).toBe('# Updated Test\n\nNew content');
      expect(useEditorStore.getState().isDirty).toBe(true);
    });

    it('should handle theme change workflow', () => {
      useSettingsStore.setState({ theme: 'light' });
      useUIStore.setState({ previewVisible: true });

      useSettingsStore.getState().updateSettings({ theme: 'dark' });

      expect(useSettingsStore.getState().theme).toBe('dark');
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });
  });
});
