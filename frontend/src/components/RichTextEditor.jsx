import { useState, useEffect, useRef, useCallback } from 'react';

// Icons for the minimal bottom formatting toolbar
const ToolbarIcons = {
  Bold: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
      <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
    </svg>
  ),
  Italic: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="4" x2="10" y2="4" />
      <line x1="14" y1="20" x2="5" y2="20" />
      <line x1="15" y1="4" x2="9" y2="20" />
    </svg>
  ),
  Underline: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3" />
      <line x1="4" y1="21" x2="20" y2="21" />
    </svg>
  ),
  Strikethrough: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.5 19H9a7 7 0 0 1-6-7c0-3.5 2.5-6 6-6h9" />
      <line x1="4" y1="12" x2="20" y2="12" />
    </svg>
  ),
  FontFamily: () => (
    <span className="font-serif font-bold text-sm leading-none">T</span>
  ),
  H1: () => <span className="font-orbitron font-bold text-xs">H1</span>,
  H2: () => <span className="font-orbitron font-bold text-xs">H2</span>,
  ListBullet: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  ),
  ListOrdered: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="10" y1="6" x2="21" y2="6" />
      <line x1="10" y1="12" x2="21" y2="12" />
      <line x1="10" y1="18" x2="21" y2="18" />
      <path d="M4 6h1v4" />
      <path d="M4 10h2" />
      <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
    </svg>
  ),
  AlignLeft: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="17" y1="10" x2="3" y2="10" />
      <line x1="21" y1="6" x2="3" y2="6" />
      <line x1="21" y1="14" x2="3" y2="14" />
      <line x1="15" y1="18" x2="3" y2="18" />
    </svg>
  ),
  AlignCenter: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="10" x2="6" y2="10" />
      <line x1="21" y1="6" x2="3" y2="6" />
      <line x1="21" y1="14" x2="3" y2="14" />
      <line x1="18" y1="18" x2="6" y2="18" />
    </svg>
  ),
  AlignRight: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="21" y1="10" x2="7" y2="10" />
      <line x1="21" y1="6" x2="3" y2="6" />
      <line x1="21" y1="14" x2="3" y2="14" />
      <line x1="21" y1="18" x2="9" y2="18" />
    </svg>
  ),
  Color: ({ activeColor = '#1a1a14' }) => (
    <div className="flex flex-col items-center justify-center pointer-events-none">
      <span className="font-serif font-bold text-xs leading-none">A</span>
      <div className="w-3.5 h-[3px] mt-[1px] rounded-full transition-colors" style={{ backgroundColor: activeColor }} />
    </div>
  ),
  Clear: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6L6 18" />
      <path d="M6 6l12 12" />
    </svg>
  ),
  Undo: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7v6h6" />
      <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
    </svg>
  ),
  Redo: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 7v6h-6" />
      <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7" />
    </svg>
  )
};

const FONTS = [
  { name: 'Rajdhani', value: "'Rajdhani', sans-serif" },
  { name: 'Orbitron', value: "'Orbitron', sans-serif" },
  { name: 'JetBrains Mono', value: "'JetBrains Mono', monospace" },
  { name: 'Sans-Serif', value: 'sans-serif' },
  { name: 'Serif', value: 'serif' },
];

const AVAILABLE_SIZES = [12, 14, 16, 18, 20, 24, 28, 32, 36, 48];

const PRESET_COLORS = [
  '#1a1a14', '#c0392b', '#2e7d52', '#2980b9', '#8e44ad',
  '#d35400', '#7f8c8d', '#d4ac0d', '#16a085', '#e84393'
];

const HIGHLIGHT_COLORS = [
  'transparent', '#fef08a', '#bbf7d0', '#bfdbfe', '#fbcfe8', '#fed7aa'
];

export default function RichTextEditor({ value = '', onChange, placeholder = 'Start writing…' }) {
  const editorRef = useRef(null);
  const lastEmittedHtmlRef = useRef(value || '');

  const [fontSize, setFontSize] = useState(16);
  const [textColor, setTextColor] = useState('#1a1a14');
  const [highlightColor, setHighlightColor] = useState('transparent');
  const [colorTab, setColorTab] = useState('text'); // 'text' | 'highlight'

  const [activeStates, setActiveStates] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    insertUnorderedList: false,
    insertOrderedList: false,
    justifyLeft: false,
    justifyCenter: false,
    justifyRight: false,
  });

  const [openPopover, setOpenPopover] = useState(null); // 'font' | 'color' | null

  // Keep editor content in sync with incoming value from parent prop
  useEffect(() => {
    if (!editorRef.current) return;

    // Skip DOM updates if value matches what we already have or just emitted
    if (value === lastEmittedHtmlRef.current || value === editorRef.current.innerHTML) {
      return;
    }

    const isFocused = document.activeElement === editorRef.current || editorRef.current.contains(document.activeElement);

    if (!isFocused) {
      editorRef.current.innerHTML = value || '';
      lastEmittedHtmlRef.current = value || '';
    } else {
      // Programmatic external update while focused (e.g. AI tool apply or undo action)
      editorRef.current.innerHTML = value || '';
      lastEmittedHtmlRef.current = value || '';
      try {
        const range = document.createRange();
        const sel = window.getSelection();
        range.selectNodeContents(editorRef.current);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
      } catch {
        // Selection fallback
      }
    }
  }, [value]);

  // Execute formatting command safely
  const execCmd = (command, val = null) => {
    document.execCommand(command, false, val);
    if (editorRef.current) {
      editorRef.current.focus();
      handleInput();
      checkActiveStates();
    }
  };

  // Step font size up or down
  const changeFontSize = (delta) => {
    const currentIndex = AVAILABLE_SIZES.indexOf(fontSize);
    let nextIndex;
    if (currentIndex === -1) {
      nextIndex = delta > 0 ? AVAILABLE_SIZES.findIndex(s => s > fontSize) : AVAILABLE_SIZES.filter(s => s < fontSize).length - 1;
      if (nextIndex < 0) nextIndex = 0;
      if (nextIndex >= AVAILABLE_SIZES.length) nextIndex = AVAILABLE_SIZES.length - 1;
    } else {
      nextIndex = Math.min(Math.max(currentIndex + delta, 0), AVAILABLE_SIZES.length - 1);
    }
    const newSize = AVAILABLE_SIZES[nextIndex];
    setFontSize(newSize);

    // Apply font size to selection
    if (editorRef.current) {
      editorRef.current.focus();
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
        // Use standard execCommand HTML font size level (1-7) or wrap span
        const sizeLevelMap = { 12: 1, 14: 2, 16: 3, 18: 4, 20: 4, 24: 5, 28: 5, 32: 6, 36: 6, 48: 7 };
        const level = sizeLevelMap[newSize] || 3;
        document.execCommand('fontSize', false, level.toString());

        // Replace <font size="..."> tags inside canvas with exact CSS inline font-size
        const fontTags = editorRef.current.querySelectorAll('font[size]');
        fontTags.forEach(el => {
          el.removeAttribute('size');
          el.style.fontSize = `${newSize}px`;
        });
      } else {
        // Change default font size of editor canvas if no selection
        editorRef.current.style.fontSize = `${newSize}px`;
      }
      handleInput();
    }
  };

  // Handle custom text color change
  const applyTextColor = (color) => {
    setTextColor(color);
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand('foreColor', false, color);
      handleInput();
    }
  };

  // Handle custom highlight color change
  const applyHighlightColor = (color) => {
    setHighlightColor(color);
    execCmd('hiliteColor', color);
  };

  // Handle content changes
  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      lastEmittedHtmlRef.current = html;
      if (onChange) {
        onChange(html);
      }
    }
  };

  // Update active state of toolbar icons based on cursor selection
  const checkActiveStates = useCallback(() => {
    try {
      setActiveStates({
        bold: document.queryCommandState('bold'),
        italic: document.queryCommandState('italic'),
        underline: document.queryCommandState('underline'),
        strikethrough: document.queryCommandState('strikethrough'),
        insertUnorderedList: document.queryCommandState('insertUnorderedList'),
        insertOrderedList: document.queryCommandState('insertOrderedList'),
        justifyLeft: document.queryCommandState('justifyLeft'),
        justifyCenter: document.queryCommandState('justifyCenter'),
        justifyRight: document.queryCommandState('justifyRight'),
      });
    } catch {
      // Ignore if selection is unavailable
    }
  }, []);

  // Format blocks like H1, H2, P
  const formatBlock = (tag) => {
    execCmd('formatBlock', tag);
    setOpenPopover(null);
  };

  // Close popovers on click outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest('.nf-editor-popover-trigger') && !e.target.closest('.nf-editor-popover')) {
        setOpenPopover(null);
      }
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  return (
    <div className="nf-rich-editor-box flex-1 flex flex-col relative overflow-hidden">
      {/* Scrollable Editable Canvas */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 relative flex flex-col">
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          onKeyUp={checkActiveStates}
          onMouseUp={checkActiveStates}
          onFocus={checkActiveStates}
          data-placeholder={placeholder}
          className="nf-rich-editor-canvas flex-1 outline-none font-rajdhani text-base leading-relaxed"
          style={{
            minHeight: '220px',
            color: 'var(--text-primary)',
            caretColor: 'var(--text-primary)',
          }}
        />
      </div>

      {/* Minimal Bottom Formatting Toolbar Navigation Bar inside notepad box */}
      <div className="nf-editor-bottom-nav flex items-center gap-1 px-3 py-2 border-t relative z-20 flex-wrap shrink-0">
        
        {/* Font Family Popover */}
        <div className="relative">
          <button
            type="button"
            title="Font Family"
            onClick={() => setOpenPopover(openPopover === 'font' ? null : 'font')}
            className={`nf-toolbar-btn nf-editor-popover-trigger ${openPopover === 'font' ? 'active' : ''}`}
          >
            <ToolbarIcons.FontFamily />
          </button>
          {openPopover === 'font' && (
            <div className="nf-editor-popover absolute bottom-full left-0 mb-2 shadow-lg rounded p-1 flex flex-col gap-1 min-w-[140px]" style={{ background: 'var(--bg-popover)', border: '1px solid var(--border-color)' }}>
              <div className="text-[10px] font-mono px-2 py-1 border-b" style={{ color: 'var(--text-muted)', borderColor: 'var(--border-color)' }}>SELECT FONT</div>
              {FONTS.map((f) => (
                <button
                  key={f.name}
                  type="button"
                  onClick={() => { execCmd('fontName', f.value); setOpenPopover(null); }}
                  className="text-left px-2 py-1.5 text-xs transition-colors rounded hover:opacity-80"
                  style={{ fontFamily: f.value, color: 'var(--text-primary)', background: 'transparent' }}
                >
                  {f.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Encapsulated Font Size Box Container: [ 16 | + | - ] */}
        <div className="nf-font-stepper-container">
          <div title="Current Font Size" className="nf-font-stepper-value">
            {fontSize}
          </div>
          <button
            type="button"
            title="Increase Font Size"
            onClick={() => changeFontSize(1)}
            className="nf-font-stepper-btn"
          >
            +
          </button>
          <button
            type="button"
            title="Decrease Font Size"
            onClick={() => changeFontSize(-1)}
            className="nf-font-stepper-btn"
          >
            −
          </button>
        </div>

        <div className="w-[1px] h-4 mx-1" style={{ background: 'var(--border-color)' }} />

        {/* Bold */}
        <button
          type="button"
          title="Bold (Ctrl+B)"
          onClick={() => execCmd('bold')}
          className={`nf-toolbar-btn ${activeStates.bold ? 'active' : ''}`}
        >
          <ToolbarIcons.Bold />
        </button>

        {/* Italic */}
        <button
          type="button"
          title="Italic (Ctrl+I)"
          onClick={() => execCmd('italic')}
          className={`nf-toolbar-btn ${activeStates.italic ? 'active' : ''}`}
        >
          <ToolbarIcons.Italic />
        </button>

        {/* Underline */}
        <button
          type="button"
          title="Underline (Ctrl+U)"
          onClick={() => execCmd('underline')}
          className={`nf-toolbar-btn ${activeStates.underline ? 'active' : ''}`}
        >
          <ToolbarIcons.Underline />
        </button>

        {/* Strikethrough */}
        <button
          type="button"
          title="Strikethrough"
          onClick={() => execCmd('strikeThrough')}
          className={`nf-toolbar-btn ${activeStates.strikethrough ? 'active' : ''}`}
        >
          <ToolbarIcons.Strikethrough />
        </button>

        <div className="w-[1px] h-4 mx-1" style={{ background: 'var(--border-color)' }} />

        {/* Headings */}
        <button
          type="button"
          title="Heading 1"
          onClick={() => formatBlock('<h1>')}
          className="nf-toolbar-btn"
        >
          <ToolbarIcons.H1 />
        </button>

        <button
          type="button"
          title="Heading 2"
          onClick={() => formatBlock('<h2>')}
          className="nf-toolbar-btn"
        >
          <ToolbarIcons.H2 />
        </button>

        <div className="w-[1px] h-4 mx-1" style={{ background: 'var(--border-color)' }} />

        {/* Bullet List */}
        <button
          type="button"
          title="Bulleted List"
          onClick={() => execCmd('insertUnorderedList')}
          className={`nf-toolbar-btn ${activeStates.insertUnorderedList ? 'active' : ''}`}
        >
          <ToolbarIcons.ListBullet />
        </button>

        {/* Numbered List */}
        <button
          type="button"
          title="Numbered List"
          onClick={() => execCmd('insertOrderedList')}
          className={`nf-toolbar-btn ${activeStates.insertOrderedList ? 'active' : ''}`}
        >
          <ToolbarIcons.ListOrdered />
        </button>

        <div className="w-[1px] h-4 mx-1" style={{ background: 'var(--border-color)' }} />

        {/* Alignment */}
        <button
          type="button"
          title="Align Left"
          onClick={() => execCmd('justifyLeft')}
          className={`nf-toolbar-btn ${activeStates.justifyLeft ? 'active' : ''}`}
        >
          <ToolbarIcons.AlignLeft />
        </button>
        <button
          type="button"
          title="Align Center"
          onClick={() => execCmd('justifyCenter')}
          className={`nf-toolbar-btn ${activeStates.justifyCenter ? 'active' : ''}`}
        >
          <ToolbarIcons.AlignCenter />
        </button>
        <button
          type="button"
          title="Align Right"
          onClick={() => execCmd('justifyRight')}
          className={`nf-toolbar-btn ${activeStates.justifyRight ? 'active' : ''}`}
        >
          <ToolbarIcons.AlignRight />
        </button>

        <div className="w-[1px] h-4 mx-1" style={{ background: 'var(--border-color)' }} />

        {/* Font Color Cube Button & Horizontal Palette Popover */}
        <div className="relative inline-flex items-center">
          <button
            type="button"
            title="Font Color"
            onClick={() => setOpenPopover(openPopover === 'color' ? null : 'color')}
            className="nf-toolbar-btn nf-editor-popover-trigger"
          >
            <div
              className="w-4 h-4 rounded-[3px] border border-black/40 shadow-xs transition-transform hover:scale-110"
              style={{ backgroundColor: textColor }}
            />
          </button>

          {openPopover === 'color' && (
            <div className="nf-color-popover-horizontal">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => { applyTextColor(c); setOpenPopover(null); }}
                  className={`w-5 h-5 rounded-[3px] border transition-transform hover:scale-125 flex items-center justify-center ${textColor === c ? 'ring-2 ring-[var(--accent-green)] ring-offset-1 border-transparent scale-110' : 'border-black/20'}`}
                  style={{ backgroundColor: c }}
                  title={c}
                >
                  {textColor === c && <span className="text-[9px] text-white font-bold">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Clear Formatting */}
        <button
          type="button"
          title="Clear Formatting"
          onClick={() => execCmd('removeFormat')}
          className="nf-toolbar-btn"
        >
          <ToolbarIcons.Clear />
        </button>

        <div className="flex-1" />

        {/* Undo / Redo */}
        <button
          type="button"
          title="Undo (Ctrl+Z)"
          onClick={() => execCmd('undo')}
          className="nf-toolbar-btn"
        >
          <ToolbarIcons.Undo />
        </button>
        <button
          type="button"
          title="Redo (Ctrl+Y)"
          onClick={() => execCmd('redo')}
          className="nf-toolbar-btn"
        >
          <ToolbarIcons.Redo />
        </button>
      </div>
    </div>
  );
}
