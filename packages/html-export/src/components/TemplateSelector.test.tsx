import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TemplateSelector } from './TemplateSelector';
import { ExportTemplate } from '../types';

const mockTemplates: ExportTemplate[] = [
  {
    id: 'default',
    name: 'Default Template',
    description: 'Simple and clean template',
    template: '<html>{{content}}</html>',
    defaultOptions: {
      theme: 'light',
      fontFamily: 'system-ui',
      fontSize: 16,
      lineHeight: 1.6,
      maxWidth: '800px',
      showTOC: false,
      showPageNumbers: false,
      printOptimized: false,
      highlightTheme: 'github',
      mathEnabled: false,
    },
  },
  {
    id: 'minimal',
    name: 'Minimal Template',
    description: 'Minimal and clean template',
    template: '<html>{{content}}</html>',
    defaultOptions: {
      theme: 'light',
      fontFamily: 'system-ui',
      fontSize: 16,
      lineHeight: 1.6,
      maxWidth: '720px',
      showTOC: false,
      showPageNumbers: false,
      printOptimized: false,
      highlightTheme: 'github',
      mathEnabled: false,
    },
  },
];

describe('TemplateSelector', () => {
  it('should render template cards', () => {
    render(
      <TemplateSelector
        templates={mockTemplates}
        selectedId="default"
        onSelect={() => {}}
      />
    );

    expect(screen.getByText('Default Template')).toBeTruthy();
    expect(screen.getByText('Minimal Template')).toBeTruthy();
  });

  it('should call onSelect when clicking a template', () => {
    const onSelect = vi.fn();
    render(
      <TemplateSelector
        templates={mockTemplates}
        selectedId="default"
        onSelect={onSelect}
      />
    );

    fireEvent.click(screen.getByText('Minimal Template'));
    expect(onSelect).toHaveBeenCalledWith('minimal');
  });

  it('should show checkmark on selected template', () => {
    render(
      <TemplateSelector
        templates={mockTemplates}
        selectedId="minimal"
        onSelect={() => {}}
      />
    );

    const minimalCard = screen.getByText('Minimal Template').closest('.template-card');
    expect(minimalCard?.className).toContain('selected');
  });

  it('should handle keyboard navigation', () => {
    const onSelect = vi.fn();
    render(
      <TemplateSelector
        templates={mockTemplates}
        selectedId="default"
        onSelect={onSelect}
      />
    );

    const minimalCard = screen.getByText('Minimal Template').closest('[role="button"]');
    if (minimalCard) {
      fireEvent.keyDown(minimalCard, { key: 'Enter' });
      expect(onSelect).toHaveBeenCalledWith('minimal');
    }
  });
});
