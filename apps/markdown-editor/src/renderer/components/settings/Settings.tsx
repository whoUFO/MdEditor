import React from 'react';
import { X } from 'lucide-react';
import { useSettingsStore } from '../../stores/settingsStore';
import './Settings.css';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Settings({ isOpen, onClose }: SettingsProps): React.JSX.Element | null {
  const settings = useSettingsStore();

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="settings-overlay" onClick={handleOverlayClick}>
      <div className="settings-panel">
        <div className="settings-header">
          <h2>设置</h2>
          <button className="settings-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="settings-content">
          <div className="settings-section">
            <h3>外观</h3>
            
            <div className="settings-item">
              <div className="settings-label">
                <span>深色模式</span>
                <small>切换深色/浅色主题</small>
              </div>
              <div className="settings-control">
                <button
                  className={`toggle-switch ${settings.theme === 'dark' ? 'active' : ''}`}
                  onClick={() => settings.updateSettings({ 
                    theme: settings.theme === 'light' ? 'dark' : 'light' 
                  })}
                />
              </div>
            </div>

            <div className="settings-item">
              <div className="settings-label">
                <span>字体大小</span>
                <small>编辑器字体大小 (12-24px)</small>
              </div>
              <div className="settings-control">
                <div className="font-size-control">
                  <button
                    className="font-size-btn"
                    onClick={() => settings.updateSettings({ 
                      fontSize: Math.max(12, settings.fontSize - 1) 
                    })}
                  >
                    -
                  </button>
                  <span className="font-size-value">{settings.fontSize}px</span>
                  <button
                    className="font-size-btn"
                    onClick={() => settings.updateSettings({ 
                      fontSize: Math.min(24, settings.fontSize + 1) 
                    })}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="settings-section">
            <h3>编辑器</h3>

            <div className="settings-item">
              <div className="settings-label">
                <span>行号</span>
                <small>显示行号</small>
              </div>
              <div className="settings-control">
                <button
                  className={`toggle-switch ${settings.lineNumbers ? 'active' : ''}`}
                  onClick={() => settings.updateSettings({ 
                    lineNumbers: !settings.lineNumbers 
                  })}
                />
              </div>
            </div>

            <div className="settings-item">
              <div className="settings-label">
                <span>自动换行</span>
                <small>长行自动换行</small>
              </div>
              <div className="settings-control">
                <button
                  className={`toggle-switch ${settings.wordWrap ? 'active' : ''}`}
                  onClick={() => settings.updateSettings({ 
                    wordWrap: !settings.wordWrap 
                  })}
                />
              </div>
            </div>

            <div className="settings-item">
              <div className="settings-label">
                <span>拼写检查</span>
                <small>启用拼写检查</small>
              </div>
              <div className="settings-control">
                <button
                  className={`toggle-switch ${settings.spellCheck ? 'active' : ''}`}
                  onClick={() => settings.updateSettings({ 
                    spellCheck: !settings.spellCheck 
                  })}
                />
              </div>
            </div>
          </div>

          <div className="settings-section">
            <h3>自动保存</h3>

            <div className="settings-item">
              <div className="settings-label">
                <span>启用自动保存</span>
                <small>定期自动保存文档</small>
              </div>
              <div className="settings-control">
                <button
                  className={`toggle-switch ${settings.autoSave ? 'active' : ''}`}
                  onClick={() => settings.updateSettings({ 
                    autoSave: !settings.autoSave 
                  })}
                />
              </div>
            </div>

            {settings.autoSave && (
              <div className="settings-item">
                <div className="settings-label">
                  <span>自动保存间隔</span>
                  <small>保存间隔时间（秒）</small>
                </div>
                <div className="settings-control">
                  <div className="font-size-control">
                    <button
                      className="font-size-btn"
                      onClick={() => settings.updateSettings({ 
                        autoSaveInterval: Math.max(10, settings.autoSaveInterval - 10) 
                      })}
                    >
                      -
                    </button>
                    <span className="font-size-value">{settings.autoSaveInterval}s</span>
                    <button
                      className="font-size-btn"
                      onClick={() => settings.updateSettings({ 
                        autoSaveInterval: Math.min(300, settings.autoSaveInterval + 10) 
                      })}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
