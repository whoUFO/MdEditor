import React from 'react';
import { useEditorStore } from '../../stores/editorStore';
import { useFileStore } from '../../stores/fileStore';
import { useSettingsStore } from '../../stores/settingsStore';
import { countWords, countLines } from '@shared/utils';
import './StatusBar.css';

export function StatusBar(): React.JSX.Element {
  const { content, isDirty } = useEditorStore();
  const { currentFile } = useFileStore();
  const { theme } = useSettingsStore();

  const wordCount = countWords(content);
  const lineCount = countLines(content);

  return (
    <div className="status-bar" data-testid="status-bar">
      <div className="status-left">
        <span className="file-name">
          {currentFile?.name || '未命名'}
          {isDirty && <span className="dirty-indicator">*</span>}
        </span>
        <span className="separator">|</span>
        <span className="word-count">{wordCount} 字</span>
        <span className="separator">|</span>
        <span className="line-count">{lineCount} 行</span>
      </div>
      
      <div className="status-right">
        <span className="encoding">{currentFile?.encoding || 'UTF-8'}</span>
        <span className="separator">|</span>
        <span className="theme">{theme === 'light' ? '明亮' : '暗黑'}</span>
        <span className="separator">|</span>
        <span className="version">v0.1.0</span>
      </div>
    </div>
  );
}
