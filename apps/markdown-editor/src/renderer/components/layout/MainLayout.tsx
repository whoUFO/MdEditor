import React from 'react';
import { Editor } from '../editor/Editor';
import { Preview } from '../preview/Preview';
import { Toolbar } from './Toolbar';
import { StatusBar } from './StatusBar';
import { FileTree } from '../file-tree/FileTree';
import { useUIStore } from '../../stores/uiStore';
import './MainLayout.css';

export function MainLayout(): React.JSX.Element {
  const { previewVisible, splitRatio, sidebarVisible } = useUIStore();

  return (
    <div className="main-layout">
      <Toolbar />
      <div className="editor-container">
        {sidebarVisible && (
          <div className="sidebar">
            <FileTree />
          </div>
        )}
        <div 
          className="editor-pane" 
          style={{ 
            flex: previewVisible ? splitRatio : 1,
            transition: 'flex 0.2s ease'
          }}
        >
          <Editor />
        </div>
        {previewVisible && (
          <>
            <div className="resizer" />
            <div 
              className="preview-pane" 
              style={{ flex: 100 - splitRatio }}
            >
              <Preview />
            </div>
          </>
        )}
      </div>
      <StatusBar />
    </div>
  );
}
