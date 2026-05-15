import { TOCItem } from './types';

export class TOCHelper {
  static parse(markdown: string): TOCItem[] {
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const items: TOCItem[] = [];
    let match;

    while ((match = headingRegex.exec(markdown)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = this.generateId(text);

      items.push({ id, text, level, children: [] });
    }

    return items;
  }

  static render(items: TOCItem[]): string {
    if (items.length === 0) return '';

    return `<nav class="toc">${this.renderItems(items)}</nav>`;
  }

  private static renderItems(items: TOCItem[], depth = 0): string {
    return items
      .map(item => {
        const indent = depth > 0 ? ` style="padding-left: ${depth * 16}px"` : '';
        const children = item.children?.length
          ? this.renderItems(item.children, depth + 1)
          : '';
        return `<li${indent}><a href="#${item.id}">${item.text}</a>${children}</li>`;
      })
      .join('');
  }

  private static generateId(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
  }

  static buildTree(items: TOCItem[]): TOCItem[] {
    const root: TOCItem[] = [];
    const stack: TOCItem[] = [];

    for (const item of items) {
      while (stack.length > 0 && stack[stack.length - 1].level >= item.level) {
        stack.pop();
      }

      if (stack.length === 0) {
        root.push(item);
      } else {
        const parent = stack[stack.length - 1];
        parent.children = parent.children || [];
        parent.children.push(item);
      }

      stack.push(item);
    }

    return root;
  }
}
