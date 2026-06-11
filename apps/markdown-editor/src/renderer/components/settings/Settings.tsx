import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useSettingsStore } from '../../stores/settingsStore';
import type { PageMargins, FontSettings } from '@shared/types';
import './Settings.css';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'general' | 'export';

const PAPER_SIZES = [
  { value: 'A4', label: 'A4 (210×297mm)' },
  { value: 'Letter', label: 'Letter (8.5×11英寸)' },
  { value: 'Legal', label: 'Legal (8.5×14英寸)' },
  { value: 'A3', label: 'A3 (297×420mm)' },
  { value: 'A5', label: 'A5 (148×210mm)' },
  { value: 'custom', label: '自定义' },
] as const;

const LINE_HEIGHT_OPTIONS = [
  { value: 'single', label: '单倍行距' },
  { value: '1.5x', label: '1.5倍行距' },
  { value: 'double', label: '双倍行距' },
  { value: 'custom', label: '自定义' },
] as const;

const PAGE_NUMBER_POSITIONS = [
  { value: 'bottom-right', label: '右下角' },
  { value: 'bottom-center', label: '底部居中' },
  { value: 'bottom-left', label: '左下角' },
  { value: 'top-right', label: '右上角' },
  { value: 'top-center', label: '顶部居中' },
  { value: 'top-left', label: '左上角' },
] as const;

const PAGE_NUMBER_FORMATS = [
  { value: 'page', label: '页码 (1, 2, 3...)' },
  { value: 'page/total', label: '页码/总数 (1/3, 2/3...)' },
  { value: 'page of total', label: '第X页，共Y页' },
] as const;

export function Settings({ isOpen, onClose }: SettingsProps): React.JSX.Element | null {
  const settings = useSettingsStore();
  const [activeTab, setActiveTab] = useState<TabType>('general');

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleMarginsChange = (key: keyof PageMargins, value: number) => {
    settings.setExportPageSettings({
      margins: { ...settings.exportPageSettings.margins, [key]: value },
    });
  };

  const handleSetAllMargins = (value: number) => {
    settings.setExportPageSettings({
      margins: { top: value, right: value, bottom: value, left: value },
    });
  };

  const handleFontsChange = (key: keyof FontSettings, value: string | number) => {
    settings.setExportPageSettings({
      fonts: { ...settings.exportPageSettings.fonts, [key]: value },
    });
  };

  const handlePageNumbersChange = (key: keyof typeof settings.exportPageSettings.pageNumbers, value: boolean | string | number) => {
    settings.setExportPageSettings({
      pageNumbers: { ...settings.exportPageSettings.pageNumbers, [key]: value },
    });
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

        <div className="settings-tabs">
          <button
            className={`settings-tab ${activeTab === 'general' ? 'active' : ''}`}
            onClick={() => setActiveTab('general')}
          >
            常规
          </button>
          <button
            className={`settings-tab ${activeTab === 'export' ? 'active' : ''}`}
            onClick={() => setActiveTab('export')}
          >
            导出设置
          </button>
        </div>

        <div className="settings-content">
          {activeTab === 'general' && (
            <>
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
            </>
          )}

          {activeTab === 'export' && (
            <>
              <div className="settings-section">
                <h3 className="settings-section-title">页面大小</h3>

                <div className="settings-item">
                  <div className="settings-item-label">
                    <span>纸张尺寸</span>
                  </div>
                  <div className="settings-control">
                    <select
                      className="settings-select"
                      value={settings.exportPageSettings.paperSize}
                      onChange={(e) => settings.setExportPageSettings({ paperSize: e.target.value as typeof settings.exportPageSettings.paperSize })}
                    >
                      {PAPER_SIZES.map((size) => (
                        <option key={size.value} value={size.value}>
                          {size.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {settings.exportPageSettings.paperSize === 'custom' && (
                  <>
                    <div className="settings-item">
                      <div className="settings-item-label">
                        <span>自定义宽度</span>
                      </div>
                      <div className="settings-control">
                        <div className="settings-input-group">
                          <input
                            type="number"
                            className="settings-input"
                            value={settings.exportPageSettings.customWidth}
                            onChange={(e) => settings.setExportPageSettings({ customWidth: Number(e.target.value) })}
                            min="10"
                            max="1000"
                          />
                          <span className="settings-input-unit">mm</span>
                        </div>
                      </div>
                    </div>
                    <div className="settings-item">
                      <div className="settings-item-label">
                        <span>自定义高度</span>
                      </div>
                      <div className="settings-control">
                        <div className="settings-input-group">
                          <input
                            type="number"
                            className="settings-input"
                            value={settings.exportPageSettings.customHeight}
                            onChange={(e) => settings.setExportPageSettings({ customHeight: Number(e.target.value) })}
                            min="10"
                            max="1000"
                          />
                          <span className="settings-input-unit">mm</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="settings-section">
                <h3 className="settings-section-title">页边距</h3>

                <div className="settings-item">
                  <div className="settings-item-label">
                    <span>统一设置边距</span>
                  </div>
                  <div className="settings-control">
                    <div className="settings-input-group">
                      <input
                        type="number"
                        className="settings-input"
                        value={settings.exportPageSettings.margins.top}
                        onChange={(e) => handleSetAllMargins(Number(e.target.value))}
                        min="0"
                        max="100"
                      />
                      <span className="settings-input-unit">{settings.exportPageSettings.marginUnit}</span>
                    </div>
                  </div>
                </div>

                <div className="settings-margins-grid">
                  <div className="settings-margin-item">
                    <span className="settings-margin-label">上</span>
                    <input
                      type="number"
                      className="settings-input small"
                      value={settings.exportPageSettings.margins.top}
                      onChange={(e) => handleMarginsChange('top', Number(e.target.value))}
                      min="0"
                      max="100"
                    />
                  </div>
                  <div className="settings-margin-item">
                    <span className="settings-margin-label">下</span>
                    <input
                      type="number"
                      className="settings-input small"
                      value={settings.exportPageSettings.margins.bottom}
                      onChange={(e) => handleMarginsChange('bottom', Number(e.target.value))}
                      min="0"
                      max="100"
                    />
                  </div>
                  <div className="settings-margin-item">
                    <span className="settings-margin-label">左</span>
                    <input
                      type="number"
                      className="settings-input small"
                      value={settings.exportPageSettings.margins.left}
                      onChange={(e) => handleMarginsChange('left', Number(e.target.value))}
                      min="0"
                      max="100"
                    />
                  </div>
                  <div className="settings-margin-item">
                    <span className="settings-margin-label">右</span>
                    <input
                      type="number"
                      className="settings-input small"
                      value={settings.exportPageSettings.margins.right}
                      onChange={(e) => handleMarginsChange('right', Number(e.target.value))}
                      min="0"
                      max="100"
                    />
                  </div>
                </div>

                <div className="settings-item">
                  <div className="settings-item-label">
                    <span>单位</span>
                  </div>
                  <div className="settings-control">
                    <div className="settings-radio-group">
                      {(['mm', 'cm', 'inch'] as const).map((unit) => (
                        <label key={unit} className="settings-radio-label">
                          <input
                            type="radio"
                            name="marginUnit"
                            value={unit}
                            checked={settings.exportPageSettings.marginUnit === unit}
                            onChange={(e) => settings.setExportPageSettings({ marginUnit: e.target.value as typeof settings.exportPageSettings.marginUnit })}
                          />
                          <span>{unit}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="settings-section">
                <h3 className="settings-section-title">字体设置</h3>

                <div className="settings-item">
                  <div className="settings-item-label">
                    <span>标题字体</span>
                    <div className="settings-item-description">支持系统字体或 Web Font URL</div>
                  </div>
                  <div className="settings-control">
                    <input
                      type="text"
                      className="settings-input"
                      value={settings.exportPageSettings.fonts.titleFont}
                      onChange={(e) => handleFontsChange('titleFont', e.target.value)}
                      placeholder="如：Times New Roman"
                    />
                  </div>
                </div>

                <div className="settings-item">
                  <div className="settings-item-label">
                    <span>标题字号</span>
                  </div>
                  <div className="settings-control">
                    <div className="settings-input-group">
                      <button
                        className="settings-btn"
                        onClick={() => handleFontsChange('titleSize', Math.max(12, settings.exportPageSettings.fonts.titleSize - 1))}
                      >
                        -
                      </button>
                      <span className="settings-input-value">{settings.exportPageSettings.fonts.titleSize}px</span>
                      <button
                        className="settings-btn"
                        onClick={() => handleFontsChange('titleSize', Math.min(72, settings.exportPageSettings.fonts.titleSize + 1))}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="settings-item">
                  <div className="settings-item-label">
                    <span>正文字体</span>
                    <div className="settings-item-description">支持系统字体或 Web Font URL</div>
                  </div>
                  <div className="settings-control">
                    <input
                      type="text"
                      className="settings-input"
                      value={settings.exportPageSettings.fonts.bodyFont}
                      onChange={(e) => handleFontsChange('bodyFont', e.target.value)}
                      placeholder="如：Times New Roman"
                    />
                  </div>
                </div>

                <div className="settings-item">
                  <div className="settings-item-label">
                    <span>正文字号</span>
                  </div>
                  <div className="settings-control">
                    <div className="settings-input-group">
                      <button
                        className="settings-btn"
                        onClick={() => handleFontsChange('bodySize', Math.max(10, settings.exportPageSettings.fonts.bodySize - 1))}
                      >
                        -
                      </button>
                      <span className="settings-input-value">{settings.exportPageSettings.fonts.bodySize}px</span>
                      <button
                        className="settings-btn"
                        onClick={() => handleFontsChange('bodySize', Math.min(36, settings.exportPageSettings.fonts.bodySize + 1))}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="settings-item">
                  <div className="settings-item-label">
                    <span>行间距</span>
                  </div>
                  <div className="settings-control">
                    <select
                      className="settings-select"
                      value={settings.exportPageSettings.fonts.lineHeight}
                      onChange={(e) => handleFontsChange('lineHeight', e.target.value as typeof settings.exportPageSettings.fonts.lineHeight)}
                    >
                      {LINE_HEIGHT_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {settings.exportPageSettings.fonts.lineHeight === 'custom' && (
                  <div className="settings-item">
                    <div className="settings-item-label">
                      <span>自定义行间距倍数</span>
                    </div>
                    <div className="settings-control">
                      <div className="settings-input-group">
                        <input
                          type="number"
                          className="settings-input"
                          value={settings.exportPageSettings.fonts.customLineHeight}
                          onChange={(e) => handleFontsChange('customLineHeight', Number(e.target.value))}
                          min="0.5"
                          max="3"
                          step="0.1"
                        />
                        <span className="settings-input-unit">倍</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="settings-section">
                <h3 className="settings-section-title">页码设置</h3>

                <div className="settings-item">
                  <div className="settings-item-label">
                    <span>添加页码</span>
                    <div className="settings-item-description">在导出的PDF页面上添加页码</div>
                  </div>
                  <div className="settings-control">
                    <button
                      className={`settings-toggle ${settings.exportPageSettings.pageNumbers.enabled ? 'active' : ''}`}
                      onClick={() => handlePageNumbersChange('enabled', !settings.exportPageSettings.pageNumbers.enabled)}
                    />
                  </div>
                </div>

                {settings.exportPageSettings.pageNumbers.enabled && (
                  <>
                    <div className="settings-item">
                      <div className="settings-item-label">
                        <span>页码位置</span>
                      </div>
                      <div className="settings-control">
                        <select
                          className="settings-select"
                          value={settings.exportPageSettings.pageNumbers.position}
                          onChange={(e) => handlePageNumbersChange('position', e.target.value)}
                        >
                          {PAGE_NUMBER_POSITIONS.map((position) => (
                            <option key={position.value} value={position.value}>
                              {position.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="settings-item">
                      <div className="settings-item-label">
                        <span>页码格式</span>
                      </div>
                      <div className="settings-control">
                        <select
                          className="settings-select"
                          value={settings.exportPageSettings.pageNumbers.format}
                          onChange={(e) => handlePageNumbersChange('format', e.target.value)}
                        >
                          {PAGE_NUMBER_FORMATS.map((format) => (
                            <option key={format.value} value={format.value}>
                              {format.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="settings-item">
                      <div className="settings-item-label">
                        <span>页码字号</span>
                      </div>
                      <div className="settings-control">
                        <div className="settings-input-group">
                          <button
                            className="settings-btn"
                            onClick={() => handlePageNumbersChange('fontSize', Math.max(8, settings.exportPageSettings.pageNumbers.fontSize - 1))}
                          >
                            -
                          </button>
                          <span className="settings-input-value">{settings.exportPageSettings.pageNumbers.fontSize}px</span>
                          <button
                            className="settings-btn"
                            onClick={() => handlePageNumbersChange('fontSize', Math.min(24, settings.exportPageSettings.pageNumbers.fontSize + 1))}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="settings-item">
                      <div className="settings-item-label">
                        <span>页码颜色</span>
                      </div>
                      <div className="settings-control">
                        <div className="settings-input-group">
                          <input
                            type="color"
                            className="settings-color-input"
                            value={settings.exportPageSettings.pageNumbers.fontColor}
                            onChange={(e) => handlePageNumbersChange('fontColor', e.target.value)}
                          />
                          <input
                            type="text"
                            className="settings-input small"
                            value={settings.exportPageSettings.pageNumbers.fontColor}
                            onChange={(e) => handlePageNumbersChange('fontColor', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="settings-section">
                <button
                  className="settings-reset-btn"
                  onClick={() => settings.resetExportPageSettings()}
                >
                  重置为默认设置
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
