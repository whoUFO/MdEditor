import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MainLayout } from '../../renderer/components/layout/MainLayout';
import { useUIStore } from '../../renderer/stores/uiStore';

vi.mock('../../renderer/stores/uiStore', () => ({
  useUIStore: vi.fn(),
}));

vi.mock('../../renderer/components/editor/Editor', () => ({
  Editor: () => <div data-testid="editor-mock">Editor</div>,
}));

vi.mock('../../renderer/components/preview/Preview', () => ({
  Preview: () => <div data-testid="preview-mock">Preview</div>,
}));

describe('MainLayout Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useUIStore as unknown as Mock).mockReturnValue({
      sidebarVisible: true,
      previewVisible: true,
      splitRatio: 50,
      setSplitRatio: vi.fn(),
      toggleSidebar: vi.fn(),
      togglePreview: vi.fn(),
    });
  });

  it('should render main layout container', () => {
    render(<MainLayout />);
    expect(screen.getByTestId('main-layout')).toBeInTheDocument();
  });

  it('should display sidebar when visible', () => {
    render(<MainLayout />);
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
  });

  it('should hide sidebar when not visible', () => {
    (useUIStore as unknown as Mock).mockReturnValue({
      sidebarVisible: false,
      previewVisible: true,
      splitRatio: 50,
      setSplitRatio: vi.fn(),
      toggleSidebar: vi.fn(),
      togglePreview: vi.fn(),
    });

    render(<MainLayout />);
    expect(screen.queryByTestId('sidebar')).not.toBeInTheDocument();
  });

  it('should display editor pane', () => {
    render(<MainLayout />);
    expect(screen.getByTestId('editor-pane')).toBeInTheDocument();
  });

  it('should display preview pane', () => {
    render(<MainLayout />);
    expect(screen.getByTestId('preview-pane')).toBeInTheDocument();
  });

  it('should hide preview when not visible', () => {
    (useUIStore as unknown as Mock).mockReturnValue({
      sidebarVisible: true,
      previewVisible: false,
      splitRatio: 50,
      setSplitRatio: vi.fn(),
      toggleSidebar: vi.fn(),
      togglePreview: vi.fn(),
    });

    render(<MainLayout />);
    expect(screen.queryByTestId('preview-pane')).not.toBeInTheDocument();
  });

  it('should display toolbar', () => {
    render(<MainLayout />);
    expect(screen.getByTestId('toolbar')).toBeInTheDocument();
  });

  it('should display status bar', () => {
    render(<MainLayout />);
    expect(screen.getByTestId('status-bar')).toBeInTheDocument();
  });

  it('should display resizer between panes', () => {
    render(<MainLayout />);
    expect(screen.getByTestId('resizer')).toBeInTheDocument();
  });
});
