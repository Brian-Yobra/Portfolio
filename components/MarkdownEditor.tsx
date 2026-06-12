'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { renderMarkdown } from '@/lib/markdown-client';

interface MarkdownEditorProps {
  name: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
}

type EditorView = 'write' | 'preview' | 'split';

export default function MarkdownEditor({
  name,
  defaultValue = '',
  placeholder,
  required,
}: MarkdownEditorProps) {
  const [content, setContent] = useState(defaultValue);
  const [preview, setPreview] = useState('');
  const [view, setView] = useState<EditorView>('split');
  const [isDragOver, setIsDragOver] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced markdown rendering for performance
  const updatePreview = useCallback((md: string) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      try {
        const html = renderMarkdown(md);
        setPreview(html);
      } catch {
        setPreview('<p style="color:#dc2626;">Error rendering markdown</p>');
      }
    }, 150);
  }, []);

  // Initial render of preview
  useEffect(() => {
    if (content) {
      updatePreview(content);
    }
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setContent(val);
    updatePreview(val);
  };

  // Handle .md file drop
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLTextAreaElement>) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files);
      const mdFile = files.find(
        (f) => f.name.endsWith('.md') || f.name.endsWith('.markdown') || f.type === 'text/markdown'
      );

      if (mdFile) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          const text = ev.target?.result as string;
          if (text) {
            setContent(text);
            updatePreview(text);
          }
        };
        reader.readAsText(mdFile);
      } else {
        // If it's plain text (e.g., pasting from clipboard)
        const text = e.dataTransfer.getData('text/plain');
        if (text) {
          setContent((prev) => prev + text);
          updatePreview(content + text);
        }
      }
    },
    [content, updatePreview]
  );

  const handleDragOver = (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  // Handle .md file import via file input
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      if (text) {
        setContent(text);
        updatePreview(text);
      }
    };
    reader.readAsText(file);
    // Reset file input so the same file can be re-imported
    e.target.value = '';
  };

  // Keyboard shortcut: Tab for indentation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = content.substring(0, start) + '  ' + content.substring(end);
      setContent(newContent);
      updatePreview(newContent);

      // Restore cursor position
      requestAnimationFrame(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      });
    }
  };

  // Word count & line count
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const lineCount = content ? content.split('\n').length : 0;

  return (
    <div className="md-editor" data-view={view}>
      {/* Hidden input to pass value to form */}
      <input type="hidden" name={name} value={content} />

      {/* Toolbar */}
      <div className="md-editor-toolbar">
        <div className="md-editor-tabs">
          <button
            type="button"
            className={`md-editor-tab ${view === 'write' ? 'active' : ''}`}
            onClick={() => setView('write')}
            title="Editor only"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Write
          </button>
          <button
            type="button"
            className={`md-editor-tab ${view === 'split' ? 'active' : ''}`}
            onClick={() => setView('split')}
            title="Split view"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="12" y1="3" x2="12" y2="21" />
            </svg>
            Split
          </button>
          <button
            type="button"
            className={`md-editor-tab ${view === 'preview' ? 'active' : ''}`}
            onClick={() => setView('preview')}
            title="Preview only"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            Preview
          </button>
        </div>

        <div className="md-editor-actions">
          <button
            type="button"
            className="md-editor-action-btn"
            onClick={() => fileInputRef.current?.click()}
            title="Import .md file"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Import .md
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".md,.markdown,text/markdown"
            onChange={handleFileImport}
            style={{ display: 'none' }}
          />
        </div>
      </div>

      {/* Editor Body */}
      <div className="md-editor-body">
        {/* Textarea Panel */}
        {view !== 'preview' && (
          <div className="md-editor-write-pane">
            <textarea
              ref={textareaRef}
              className={`md-editor-textarea ${isDragOver ? 'drag-over' : ''}`}
              value={content}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              placeholder={placeholder || '# Start writing markdown...\n\nDrag & drop a .md file or paste markdown content here.\n\nSupports:\n- Headers, lists, bold, italic\n- Code blocks with syntax labels\n- Tables, blockquotes\n- GitHub-style alerts: > [!NOTE], > [!TIP], > [!WARNING]'}
              required={required}
              spellCheck={false}
            />
            {isDragOver && (
              <div className="md-editor-drop-overlay">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <span>Drop .md file here</span>
              </div>
            )}
          </div>
        )}

        {/* Preview Panel */}
        {view !== 'write' && (
          <div className="md-editor-preview-pane" ref={previewRef}>
            {preview ? (
              <div
                className="markdown-body"
                dangerouslySetInnerHTML={{ __html: preview }}
              />
            ) : (
              <div className="md-editor-preview-empty">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <span>Live preview will appear here</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="md-editor-statusbar">
        <span className="md-editor-stat">{lineCount} lines</span>
        <span className="md-editor-stat-divider">•</span>
        <span className="md-editor-stat">{wordCount} words</span>
        <span className="md-editor-stat-divider">•</span>
        <span className="md-editor-stat">Markdown</span>
      </div>
    </div>
  );
}
