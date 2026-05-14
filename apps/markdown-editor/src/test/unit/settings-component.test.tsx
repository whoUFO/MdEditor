import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Settings } from '../../renderer/components/settings/Settings';
import { useSettingsStore } from '../../renderer/stores/settingsStore';

vi.mock('../../renderer/stores/settingsStore', () => ({
  useSettingsStore: vi.fn(),
}));

describe('Settings Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useSettingsStore as unknown as Mock).mockReturnValue({
      theme: 'light',
      fontSize: 14,
      lineNumbers: true,
      wordWrap: true,
      spellCheck: true,
      autoSave: false,
      autoSaveInterval: 30,
      updateSettings: vi.fn(),
    });
  });

  it('should not render when isOpen is false', () => {
    render(<Settings isOpen={false} onClose={vi.fn()} />);
    expect(screen.queryByTestId('settings-panel')).not.toBeInTheDocument();
  });

  it('should render when isOpen is true', () => {
    render(<Settings isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByTestId('settings-panel')).toBeInTheDocument();
  });

  it('should have close button', () => {
    render(<Settings isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByTestId('settings-close')).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(<Settings isOpen={true} onClose={onClose} />);
    
    fireEvent.click(screen.getByTestId('settings-close'));
    expect(onClose).toHaveBeenCalled();
  });

  it('should display theme toggle', () => {
    render(<Settings isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText('深色模式')).toBeInTheDocument();
  });

  it('should display font size control', () => {
    render(<Settings isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText('字体大小')).toBeInTheDocument();
  });

  it('should display line numbers toggle', () => {
    render(<Settings isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText('行号')).toBeInTheDocument();
  });

  it('should display word wrap toggle', () => {
    render(<Settings isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText('自动换行')).toBeInTheDocument();
  });

  it('should display spell check toggle', () => {
    render(<Settings isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText('拼写检查')).toBeInTheDocument();
  });

  it('should toggle theme when theme button is clicked', () => {
    const updateSettings = vi.fn();
    (useSettingsStore as unknown as Mock).mockReturnValue({
      theme: 'light',
      fontSize: 14,
      lineNumbers: true,
      wordWrap: true,
      spellCheck: true,
      autoSave: false,
      autoSaveInterval: 30,
      updateSettings,
    });

    render(<Settings isOpen={true} onClose={vi.fn()} />);
    
    const themeToggle = screen.getByTestId('theme-toggle');
    fireEvent.click(themeToggle);
    
    expect(updateSettings).toHaveBeenCalledWith({ theme: 'dark' });
  });

  it('should increase font size when plus button is clicked', () => {
    const updateSettings = vi.fn();
    (useSettingsStore as unknown as Mock).mockReturnValue({
      theme: 'light',
      fontSize: 14,
      lineNumbers: true,
      wordWrap: true,
      spellCheck: true,
      autoSave: false,
      autoSaveInterval: 30,
      updateSettings,
    });

    render(<Settings isOpen={true} onClose={vi.fn()} />);
    
    const plusButton = screen.getByText('+').closest('button');
    fireEvent.click(plusButton!);
    
    expect(updateSettings).toHaveBeenCalledWith({ fontSize: 15 });
  });

  it('should decrease font size when minus button is clicked', () => {
    const updateSettings = vi.fn();
    (useSettingsStore as unknown as Mock).mockReturnValue({
      theme: 'light',
      fontSize: 14,
      lineNumbers: true,
      wordWrap: true,
      spellCheck: true,
      autoSave: false,
      autoSaveInterval: 30,
      updateSettings,
    });

    render(<Settings isOpen={true} onClose={vi.fn()} />);
    
    const minusButton = screen.getByText('-').closest('button');
    fireEvent.click(minusButton!);
    
    expect(updateSettings).toHaveBeenCalledWith({ fontSize: 13 });
  });

  it('should close when clicking overlay', () => {
    const onClose = vi.fn();
    render(<Settings isOpen={true} onClose={onClose} />);
    
    const overlay = screen.getByTestId('settings-overlay');
    fireEvent.click(overlay);
    
    expect(onClose).toHaveBeenCalled();
  });
});
