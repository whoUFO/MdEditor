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
    <div className="settings-overlay" onClick={handleOverlayClick} data-testid="settings-overlay">
      <div className="settings-panel" data-testid="settings-panel">
        <div className="settings-header">
          <h2>设置</h2>
          <button className="settings-close" onClick={onClose} data-testid="settings-close">
            <X size={20} />
          </button>
        </div>

        <div className="settings-content">
          <div className="settings-section">
            <h3 className="settings-section-title">外观</h3>

            <div className="settings-item">
              <div className="settings-item-label">
                <span>深色模式</span>
                <div className="settings-item-description">切换深色/浅色主题</div>
              </div>
              <div className="settings-control">
                <button
                  className={`settings-toggle ${settings.theme === 'dark' ? 'active' : ''}`}
                  onClick={() => settings.updateSettings({
                    theme: settings.theme === 'light' ? 'dark' : 'light'
                  })}
                  data-testid="theme-toggle"
                />
              </div>
            </div>

            <div className="settings-item">
              <div className="settings-item-label">
                <span>字体大小</span>
                <div className="settings-item-description">编辑器字体大小 (12-24px)</div>
              </div>
              <div className="settings-control">
                <div className="settings-input-group">
                  <button
                    className="settings-btn"
                    onClick={() => settings.updateSettings({ 
                      fontSize: Math.max(12, settings.fontSize - 1) 
                    })}
                  >
                    -
                  </button>
                  <span className="settings-input-value">{settings.fontSize}px</span>
                  <button
                    className="settings-btn"
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
            <h3 className="settings-section-title">编辑器</h3>

            <div className="settings-item">
              <div className="settings-item-label">
                <span>行号</span>
                <div className="settings-item-description">显示行号</div>
              </div>
              <div className="settings-control">
                <button
                  className={`settings-toggle ${settings.lineNumbers ? 'active' : ''}`}
                  onClick={() => settings.updateSettings({ 
                    lineNumbers: !settings.lineNumbers 
                  })}
                />
              </div>
            </div>

            <div className="settings-item">
              <div className="settings-item-label">
                <span>自动换行</span>
                <div className="settings-item-description">长行自动换行</div>
              </div>
              <div className="settings-control">
                <button
                  className={`settings-toggle ${settings.wordWrap ? 'active' : ''}`}
                  onClick={() => settings.updateSettings({ 
                    wordWrap: !settings.wordWrap 
                  })}
                />
              </div>
            </div>

            <div className="settings-item">
              <div className="settings-item-label">
                <span>拼写检查</span>
                <div className="settings-item-description">启用拼写检查</div>
              </div>
              <div className="settings-control">
                <button
                  className={`settings-toggle ${settings.spellCheck ? 'active' : ''}`}
                  onClick={() => settings.updateSettings({ 
                    spellCheck: !settings.spellCheck 
                  })}
                />
              </div>
            </div>
          </div>

          <div className="settings-section">
            <h3 className="settings-section-title">自动保存</h3>

            <div className="settings-item">
              <div className="settings-item-label">
                <span>启用自动保存</span>
                <div className="settings-item-description">定期自动保存文档</div>
              </div>
              <div className="settings-control">
                <button
                  className={`settings-toggle ${settings.autoSave ? 'active' : ''}`}
                  onClick={() => settings.updateSettings({ 
                    autoSave: !settings.autoSave 
                  })}
                />
              </div>
            </div>

            {settings.autoSave && (
              <div className="settings-item">
                <div className="settings-item-label">
                  <span>自动保存间隔</span>
                  <div className="settings-item-description">保存间隔时间（秒）</div>
                </div>
                <div className="settings-control">
                  <div className="settings-input-group">
                    <button
                      className="settings-btn"
                      onClick={() => settings.updateSettings({ 
                        autoSaveInterval: Math.max(10, settings.autoSaveInterval - 10) 
                      })}
                    >
                      -
                    </button>
                    <span className="settings-input-value">{settings.autoSaveInterval}s</span>
                    <button
                      className="settings-btn"
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
