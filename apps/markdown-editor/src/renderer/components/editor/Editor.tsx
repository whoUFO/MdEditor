import React, { useEffect, useRef } from 'react';
import { EditorView, basicSetup } from 'codemirror';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { EditorSelection } from '@codemirror/state';
import { useEditorStore } from '../../stores/editorStore';
import './Editor.css';

export function Editor(): React.JSX.Element {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const { content, setContent, setCursorPosition, setSelection } = useEditorStore();

  useEffect(() => {
    if (!editorRef.current) return;

    const view = new EditorView({
      doc: content,
      extensions: [
        basicSetup,
        markdown({ base: markdownLanguage, codeLanguages: languages }),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            setContent(update.state.doc.toString());
          }
          
          const cursor = update.state.selection.main.head;
          const line = update.state.doc.lineAt(cursor);
          setCursorPosition({ 
            line: line.number, 
            column: cursor - line.from + 1 
          });
          
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
      ],
      parent: editorRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
    };
  }, []);

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

  return <div ref={editorRef} className="editor" />;
}
