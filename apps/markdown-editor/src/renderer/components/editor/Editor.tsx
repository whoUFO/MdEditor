import React, { useEffect, useRef } from 'react';
import { EditorView, lineNumbers } from '@codemirror/view';
import { EditorSelection } from '@codemirror/state';
import { basicSetup } from 'codemirror';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { useEditorStore } from '../../stores/editorStore';
import { useUIStore } from '../../stores/uiStore';
import { useSettingsStore } from '../../stores/settingsStore';
import './Editor.css';

let editorScrollHandler: ((scrollTop: number) => void) | null = null;

export function setEditorScrollHandler(handler: (scrollTop: number) => void) {
  editorScrollHandler = handler;
}

export function Editor(): React.JSX.Element {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const { content, setContent, setCursorPosition, setSelection, cursorPosition } = useEditorStore();
  const { syncScroll } = useUIStore();
  const { wordWrap, lineNumbers: showLineNumbers } = useSettingsStore();
  const isSyncingRef = useRef(false);
  const lastProgrammaticLineRef = useRef<number | null>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    const extensions = [
      markdown({ base: markdownLanguage, codeLanguages: languages }),
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          setContent(update.state.doc.toString());
        }

        const cursor = update.state.selection.main.head;
        const line = update.state.doc.lineAt(cursor);
        const newLine = line.number;
        const newColumn = cursor - line.from + 1;

        if (lastProgrammaticLineRef.current === newLine) {
          lastProgrammaticLineRef.current = null;
        } else {
          setCursorPosition({
            line: newLine,
            column: newColumn,
          });
        }

        const selection = update.state.selection;
        if (selection.ranges.length > 0 && !selection.main.empty) {
          setSelection({
            from: selection.main.from,
            to: selection.main.to,
          });
        } else {
          setSelection(null);
        }
      }),
    ];

    if (showLineNumbers) {
      extensions.push(lineNumbers());
    }

    if (wordWrap) {
      extensions.push(EditorView.lineWrapping);
    }

    const view = new EditorView({
      doc: content,
      extensions,
      parent: editorRef.current,
    });

    viewRef.current = view;

    const scrollEl = view.scrollDOM;
    if (scrollEl) {
      const handleScroll = () => {
        if (!isSyncingRef.current && editorScrollHandler && syncScroll) {
          const scrollHeight = scrollEl.scrollHeight - scrollEl.clientHeight;
          const scrollPercent = scrollHeight > 0 ? scrollEl.scrollTop / scrollHeight : 0;
          editorScrollHandler(scrollPercent);
        }
      };

      scrollEl.addEventListener('scroll', handleScroll);

      return () => {
        scrollEl.removeEventListener('scroll', handleScroll);
        view.destroy();
        window.syncEditorScroll = undefined;
      };
    }

    return () => {
      view.destroy();
      window.syncEditorScroll = undefined;
    };
  }, [syncScroll, wordWrap, showLineNumbers]);

  useEffect(() => {
    if (viewRef.current && viewRef.current.state.doc.toString() !== content) {
      viewRef.current.dispatch({
        changes: {
          from: 0,
          to: viewRef.current.state.doc.length,
          insert: content,
        },
      });
    }
  }, [content]);

  useEffect(() => {
    if (!viewRef.current) return;
    const view = viewRef.current;
    const doc = view.state.doc;

    if (cursorPosition.line < 1 || cursorPosition.line > doc.lines) return;

    const line = doc.line(cursorPosition.line);
    const pos = line.from + Math.max(0, cursorPosition.column - 1);

    if (lastProgrammaticLineRef.current === cursorPosition.line) return;
    lastProgrammaticLineRef.current = cursorPosition.line;

    view.dispatch({
      selection: EditorSelection.cursor(pos),
      scrollIntoView: true,
    });

    view.focus();
  }, [cursorPosition.line, cursorPosition.column]);

  return <div ref={editorRef} className="editor" />;
}