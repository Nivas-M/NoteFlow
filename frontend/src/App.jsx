import { useState, useEffect, useRef, useCallback } from 'react';

// Word counter helper
function wordCount(text = '') {
  return text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0;
}

// Relative timestamp formatter helper
function relativeTime(dateStr) {
  if (!dateStr) return 'Just now';
  const date = new Date(dateStr);
  const diff = (Date.now() - date.getTime()) / 1000;
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return date.toLocaleDateString();
}

// Generate random unique ID
function genId() {
  return Math.random().toString(36).slice(2, 10);
}

// Inline SVG icons collection
const Icons = {
  Plus: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
    </svg>
  ),
  Search: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M10 10l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
    </svg>
  ),
  Trash: () => (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M1 3h11M4 3V1.5h5V3M5 6v4M8 6v4M2 3l.8 8h7.4l.8-8H2z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="square" />
    </svg>
  ),
  Edit: () => (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M9 2l2 2-7 7H2v-2L9 2z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="square" />
    </svg>
  ),
  AI: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <polygon points="7,1 9,5 13,5 10,8 11,12 7,9.5 3,12 4,8 1,5 5,5" stroke="currentColor" strokeWidth="1.2" fill="none" />
    </svg>
  ),
  X: () => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
    </svg>
  ),
  Save: () => (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <rect x="1" y="1" width="11" height="11" stroke="currentColor" strokeWidth="1.2" />
      <rect x="3.5" y="1" width="4" height="3.5" stroke="currentColor" strokeWidth="1.1" />
      <rect x="2.5" y="6" width="8" height="5" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  ),
  Loader: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="spin">
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="20 15" />
    </svg>
  ),
  Note: () => (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <rect x="1.5" y="1.5" width="10" height="10" stroke="currentColor" strokeWidth="1.2" />
      <path d="M4 4.5h5M4 6.5h5M4 8.5h3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="square" />
    </svg>
  ),
  Word: () => (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
      <path d="M1 2h9M1 5.5h9M1 9h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="square" />
    </svg>
  ),
  Back: () => (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M8 2L3 6.5L8 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
    </svg>
  ),
};

// Toast notification popups container
function ToastContainer({ toasts, remove }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="fade-in pointer-events-auto flex items-center gap-3 px-4 py-2.5 font-mono text-xs"
          style={{
            background: t.type === 'error' ? '#fce8e6' : t.type === 'success' ? '#e8f0e8' : '#ede8dd',
            border: `1px solid ${t.type === 'error' ? '#c0392b' : t.type === 'success' ? '#2e7d52' : '#d8d0c0'}`,
            color: t.type === 'error' ? '#c0392b' : t.type === 'success' ? '#2e7d52' : '#5a5548',
            minWidth: 240,
          }}
        >
          <span className="flex-1">{t.message}</span>
          <button onClick={() => remove(t.id)} className="opacity-50 hover:opacity-100 transition-opacity">
            <Icons.X />
          </button>
        </div>
      ))}
    </div>
  );
}

// Confirmation modal for node deletion
function ConfirmModal({ onConfirm, onCancel, title }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center" style={{ background: 'rgba(7,9,14,0.85)' }}>
      <div className="corner-brackets fade-in p-8 font-rajdhani" style={{ background: '#ede8dd', border: '1px solid #d8d0c0', minWidth: 320 }}>
        <div className="font-orbitron text-xs tracking-widest mb-1" style={{ color: '#c0392b' }}>
          ⚠ CONFIRM DELETION
        </div>
        <div className="text-sm mb-6" style={{ color: '#8a8070' }}>
          Delete <span style={{ color: '#1a1a14' }}>"{title}"</span>?<br />
          This action cannot be undone.
        </div>
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 py-2 font-orbitron text-xs tracking-widest transition-all hover:brightness-110"
            style={{ background: '#c0392b', color: '#fff' }}
          >
            DELETE
          </button>
          <button
            onClick={onCancel}
            className="flex-1 py-2 font-orbitron text-xs tracking-widest transition-all hover:bg-opacity-80"
            style={{ background: '#e8e2d6', color: '#5a5548', border: '1px solid #d8d0c0' }}
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
}

// Gemini AI tools metadata list
const AI_TOOLS = [
  { id: 'summarize', label: 'Summarize', desc: 'Executive 2–3 sentence brief', shortcut: 'S' },
  { id: 'grammar', label: 'Fix Grammar', desc: 'Correct spelling & punctuation', shortcut: 'G' },
  { id: 'expand', label: 'Expand Draft', desc: 'Elaborate into full paragraphs', shortcut: 'E' },
  { id: 'actions', label: 'Extract Actions', desc: 'Convert to bulleted task list', shortcut: 'A' },
  { id: 'formal', label: 'Make Formal', desc: 'Rewrite in business language', shortcut: 'F' },
  { id: 'translate', label: 'Translate', desc: 'Translate into target language', shortcut: 'T', requiresLang: true },
  { id: 'ask', label: 'Ask My Note', desc: 'Interactive Q&A on note text', shortcut: 'Q', requiresQuestion: true },
];

// Backend API endpoint mapping
const AI_ENDPOINTS = {
  summarize: '/api/ai/summarize',
  grammar: '/api/ai/fix-grammar',
  expand: '/api/ai/expand',
  actions: '/api/ai/action-items',
  formal: '/api/ai/make-formal',
  translate: '/api/ai/translate',
  ask: '/api/ai/ask',
};

// Side panel for executing Gemini AI actions
function AIPanel({ content, onApply }) {
  const [loading, setLoading] = useState(null);
  const [result, setResult] = useState('');
  const [activeTool, setActiveTool] = useState(null);
  const [targetLang, setTargetLang] = useState('Spanish');
  const [userQuestion, setUserQuestion] = useState('');

  // Execute selected Gemini AI tool
  async function runTool(tool) {
    if (!content.trim()) return;
    setLoading(tool);
    setActiveTool(tool);
    setResult('');

    const payload = { text: content };
    if (tool === 'translate') payload.targetLanguage = targetLang;
    if (tool === 'ask') payload.question = userQuestion;

    try {
      const res = await fetch(AI_ENDPOINTS[tool], {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.result) {
        setResult(data.result);
      } else {
        setResult(`[ERROR]: ${data.message || data.error || 'AI request failed'}`);
      }
    } catch (err) {
      setResult(`[ERROR]: Failed to connect to server: ${err.message}`);
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="px-4 pt-4 pb-3 shrink-0" style={{ borderBottom: '1px solid #d8d0c0' }}>
        <div className="font-orbitron text-xs tracking-widest flex items-center gap-2" style={{ color: '#1a1a14' }}>
          <Icons.AI />
          <span>GEMINI AI</span>
          <span className="cursor-blink ml-1" style={{ color: '#1a1a14' }}>_</span>
        </div>
        <div className="font-mono text-xs mt-1" style={{ color: '#8a8070' }}>
          google/gemini-1.5-flash · 7 tools
        </div>
      </div>

      <div className="flex flex-col gap-1 p-3 shrink-0">
        {AI_TOOLS.map((t) => (
          <div key={t.id} className="flex flex-col gap-1">
            <button
              onClick={() => {
                setActiveTool(t.id);
                if (!t.requiresLang && !t.requiresQuestion) runTool(t.id);
              }}
              disabled={loading !== null || !content.trim()}
              className="flex items-center gap-3 px-3 py-2.5 text-left transition-all group disabled:opacity-40"
              style={{
                background: activeTool === t.id ? '#e8ede8' : 'transparent',
                border: `1px solid ${activeTool === t.id ? '#2e7d5240' : '#d8d0c0'}`,
              }}
            >
              <span
                className="font-mono text-xs w-4 shrink-0 transition-colors"
                style={{ color: activeTool === t.id ? '#2e7d52' : '#8a8070' }}
              >
                {loading === t.id ? <Icons.Loader /> : t.shortcut}
              </span>
              <div className="flex-1 min-w-0">
                <div
                  className="font-rajdhani font-semibold text-sm leading-none"
                  style={{ color: activeTool === t.id ? '#2e7d52' : '#1a1a14' }}
                >
                  {t.label}
                </div>
                <div className="font-mono text-xs mt-0.5 truncate" style={{ color: '#8a8070' }}>
                  {t.desc}
                </div>
              </div>
            </button>

            {/* Translation language selector */}
            {activeTool === 'translate' && t.id === 'translate' && (
              <div className="p-2 flex flex-col gap-2 fade-in" style={{ background: '#eae4d8', border: '1px solid #d8d0c0' }}>
                <label className="font-mono text-xs" style={{ color: '#5a5548' }}>TARGET LANGUAGE:</label>
                <select
                  value={targetLang}
                  onChange={(e) => setTargetLang(e.target.value)}
                  className="p-1 font-mono text-xs bg-white border border-gray-300 rounded"
                  style={{ color: '#1a1a14' }}
                >
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                  <option value="Japanese">Japanese</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Chinese">Chinese</option>
                </select>
                <button
                  onClick={() => runTool('translate')}
                  disabled={loading !== null || !content.trim()}
                  className="py-1 px-2 font-orbitron text-xs tracking-wider text-white"
                  style={{ background: '#1a1a14' }}
                >
                  TRANSLATE
                </button>
              </div>
            )}

            {/* Q&A question input prompt */}
            {activeTool === 'ask' && t.id === 'ask' && (
              <div className="p-2 flex flex-col gap-2 fade-in" style={{ background: '#eae4d8', border: '1px solid #d8d0c0' }}>
                <label className="font-mono text-xs" style={{ color: '#5a5548' }}>ASK A QUESTION:</label>
                <input
                  type="text"
                  value={userQuestion}
                  onChange={(e) => setUserQuestion(e.target.value)}
                  placeholder="What is this note about?"
                  className="p-1.5 font-mono text-xs bg-white border border-gray-300 rounded"
                  style={{ color: '#1a1a14' }}
                />
                <button
                  onClick={() => runTool('ask')}
                  disabled={loading !== null || !content.trim() || !userQuestion.trim()}
                  className="py-1 px-2 font-orbitron text-xs tracking-wider text-white"
                  style={{ background: '#1a1a14' }}
                >
                  SUBMIT QUESTION
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* AI output display box */}
      {result && (
        <div className="flex-1 flex flex-col mx-3 mb-3 overflow-hidden slide-in" style={{ border: '1px solid #d8d0c0', minHeight: 140 }}>
          <div className="flex items-center justify-between px-3 py-2 shrink-0" style={{ borderBottom: '1px solid #d8d0c0', background: '#eae4d8' }}>
            <span className="font-mono text-xs" style={{ color: '#2e7d52' }}>OUTPUT</span>
            <button
              onClick={() => { onApply(result); setResult(''); }}
              className="font-orbitron text-xs tracking-wider px-3 py-1 transition-all hover:brightness-95"
              style={{ background: '#1a1a14', color: '#f5f0e8' }}
            >
              APPLY
            </button>
          </div>
          <div
            className="flex-1 overflow-y-auto p-3 font-rajdhani text-sm leading-relaxed"
            style={{ color: '#5a5548', background: '#f5f0e8' }}
          >
            {result}
          </div>
        </div>
      )}
    </div>
  );
}

// Main NoteFlow application root component
export default function App() {
  const [notes, setNotes] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingNotes, setLoadingNotes] = useState(true);
  const [searching, setSearching] = useState(false);
  const [dbStatus, setDbStatus] = useState('CONNECTING');
  const [toasts, setToasts] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [showAI, setShowAI] = useState(true);
  const [editTitle, setEditTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState('');
  const [mobileTab, setMobileTab] = useState('nodes');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const titleRef = useRef(null);
  const textareaRef = useRef(null);
  const saveTimerRef = useRef(null);

  // Responsive window resize listener
  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 768);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Add toast notification
  function addToast(message, type = 'success') {
    const id = genId();
    setToasts((p) => [...p, { id, message, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3500);
  }

  // Remove toast notification
  function removeToast(id) {
    setToasts((p) => p.filter((t) => t.id !== id));
  }

  // Fetch all notes from backend
  const fetchNotes = useCallback(async (q = '') => {
    q ? setSearching(true) : setLoadingNotes(true);
    try {
      const url = q.trim()
        ? `/api/notes?search=${encodeURIComponent(q.trim())}`
        : '/api/notes';
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch notes');
      const data = await res.json();
      setNotes(data);
      setDbStatus('CONNECTED');
      if (data.length > 0 && !activeId) {
        setActiveId(data[0]._id || data[0].id);
      }
    } catch {
      setDbStatus('DISCONNECTED');
      addToast('Could not sync with MongoDB Atlas backend.', 'error');
    } finally {
      setLoadingNotes(false);
      setSearching(false);
    }
  }, [activeId]);

  // Initial load
  useEffect(() => {
    fetchNotes();
  }, []);

  // Handle live debounced fuzzy search
  function handleSearch(e) {
    const q = e.target.value;
    setSearchQuery(q);
    clearTimeout(window._searchTimer);
    window._searchTimer = setTimeout(() => fetchNotes(q), 380);
  }

  const activeNote = notes.find((n) => (n._id === activeId || n.id === activeId)) ?? null;

  // Select note handler with mobile view switch
  function selectNote(id) {
    setActiveId(id);
    if (isMobile) setMobileTab('editor');
  }

  // Create new note in MongoDB Atlas
  async function createNote() {
    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Untitled Node', body: '' }),
      });
      if (res.ok) {
        const newNote = await res.json();
        setNotes((p) => [newNote, ...p]);
        setActiveId(newNote._id || newNote.id);
        setSearchQuery('');
        if (isMobile) setMobileTab('editor');
        addToast('New note created', 'success');
      } else {
        addToast('Failed to create note', 'error');
      }
    } catch {
      addToast('Backend connection error', 'error');
    }
  }

  // Auto-sync note changes to database
  async function saveNoteToDb(id, title, body) {
    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, body }),
      });
      if (res.ok) {
        const updated = await res.json();
        setNotes((prev) =>
          prev.map((n) => ((n._id === id || n.id === id) ? updated : n))
        );
        addToast('Note synced to Atlas', 'success');
      }
    } catch {
      addToast('Auto-sync failed', 'error');
    }
  }

  // Update note content on typing
  function updateContent(content) {
    if (!activeNote) return;
    const id = activeNote._id || activeNote.id;
    const currentTitle = activeNote.title;

    setNotes((prev) =>
      prev.map((n) =>
        (n._id === id || n.id === id)
          ? { ...n, body: content, updatedAt: new Date().toISOString() }
          : n
      )
    );

    clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveNoteToDb(id, currentTitle, content);
    }, 800);
  }

  // Update note title
  function updateTitle(title) {
    if (!activeNote) return;
    const id = activeNote._id || activeNote.id;
    const currentBody = activeNote.body || '';

    setNotes((prev) =>
      prev.map((n) =>
        (n._id === id || n.id === id)
          ? { ...n, title, updatedAt: new Date().toISOString() }
          : n
      )
    );

    saveNoteToDb(id, title, currentBody);
  }

  // Request deletion confirmation modal
  function requestDelete(id) {
    setConfirmDelete(id);
  }

  // Confirm and execute note deletion
  async function confirmDeleteNote() {
    if (!confirmDelete) return;
    const id = confirmDelete;
    const deletedNote = notes.find((n) => (n._id === id || n.id === id));

    try {
      const res = await fetch(`/api/notes/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setNotes((prev) => prev.filter((n) => (n._id !== id && n.id !== id)));
        if (activeId === id) {
          const remaining = notes.filter((n) => (n._id !== id && n.id !== id));
          setActiveId(remaining[0]?._id || remaining[0]?.id || null);
        }
        addToast(`"${deletedNote?.title || 'Node'}" deleted`, 'error');
      }
    } catch {
      addToast('Failed to delete note', 'error');
    } finally {
      setConfirmDelete(null);
    }
  }

  // Start editing title
  function startEditTitle() {
    if (!activeNote) return;
    setTitleDraft(activeNote.title);
    setEditTitle(true);
    setTimeout(() => titleRef.current?.select(), 50);
  }

  // Save title edit
  function commitTitle() {
    if (titleDraft.trim()) updateTitle(titleDraft.trim());
    setEditTitle(false);
  }

  // Apply AI output text to active note content
  function applyAI(result) {
    updateContent(result);
    addToast('AI output applied to note', 'success');
  }

  const noteContent = activeNote ? (activeNote.body || activeNote.content || '') : '';
  const currentWordCount = wordCount(noteContent);

  return (
    <div
      className="scanlines nf-app-grid"
      style={{
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        display: 'grid',
        gridTemplateColumns: '260px 1fr auto',
        gridTemplateRows: '40px 1fr',
        background: '#f5f0e8'
      }}
    >
      {/* Top bar HUD */}
      <div
        className="col-span-3 flex items-center px-4 gap-4 nf-top-bar"
        style={{ borderBottom: '1px solid #d8d0c0', background: '#ede8dd' }}
      >
        <div className="font-orbitron text-sm tracking-widest flex items-center gap-2" style={{ color: '#1a1a14' }}>
          <span>NOTE<span style={{ color: '#c0392b' }}>FLOW</span></span>
          <span className="font-mono text-xs" style={{ color: '#8a8070' }}>v2.4.1</span>
        </div>

        <div className="flex-1" />

        {/* Mobile Navigation Tabs */}
        {isMobile && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => setMobileTab('nodes')}
              className="px-2 py-1 font-orbitron text-xs"
              style={{
                background: mobileTab === 'nodes' ? '#1a1a14' : '#e8e2d6',
                color: mobileTab === 'nodes' ? '#f5f0e8' : '#5a5548',
                border: '1px solid #d8d0c0'
              }}
            >
              NODES ({notes.length})
            </button>
            <button
              onClick={() => setMobileTab('editor')}
              className="px-2 py-1 font-orbitron text-xs"
              style={{
                background: mobileTab === 'editor' ? '#1a1a14' : '#e8e2d6',
                color: mobileTab === 'editor' ? '#f5f0e8' : '#5a5548',
                border: '1px solid #d8d0c0'
              }}
            >
              EDITOR
            </button>
            <button
              onClick={() => setMobileTab('ai')}
              className="px-2 py-1 font-orbitron text-xs"
              style={{
                background: mobileTab === 'ai' ? '#2e7d52' : '#e8e2d6',
                color: mobileTab === 'ai' ? '#ffffff' : '#5a5548',
                border: '1px solid #d8d0c0'
              }}
            >
              AI
            </button>
          </div>
        )}

        {!isMobile && (
          <div className="font-mono text-xs flex items-center gap-2" style={{ color: '#8a8070' }}>
            <span className="w-1.5 h-1.5 rounded-full pulse-glow" style={{ background: dbStatus === 'CONNECTED' ? '#2e7d52' : '#c0392b', display: 'inline-block' }} />
            MONGODB ATLAS · {dbStatus}
          </div>
        )}
      </div>

      {/* Workspace Area */}
      <div className="col-span-3 flex w-full h-full overflow-hidden nf-main-workspace">

        {/* Left Sidebar (Note List) */}
        {(!isMobile || mobileTab === 'nodes') && (
          <div
            className="flex flex-col overflow-hidden nf-sidebar-pane"
            style={{ width: isMobile ? '100%' : 260, borderRight: '1px solid #d8d0c0' }}
          >
            {/* Search Bar */}
            <div className="p-3" style={{ borderBottom: '1px solid #d8d0c0' }}>
              <div className="flex items-center gap-2 px-3 py-2" style={{ background: '#eae4d8', border: '1px solid #d8d0c0' }}>
                <span style={{ color: '#8a8070' }}><Icons.Search /></span>
                <input
                  value={searchQuery}
                  onChange={handleSearch}
                  placeholder="FUZZY SEARCH..."
                  className="flex-1 bg-transparent font-mono text-xs placeholder-current"
                  style={{ color: '#1a1a14', letterSpacing: '0.05em' }}
                />
                {searching ? (
                  <span className="font-mono text-xs" style={{ color: '#8a8070' }}><Icons.Loader /></span>
                ) : searchQuery ? (
                  <button onClick={() => { setSearchQuery(''); fetchNotes(''); }} style={{ color: '#8a8070' }}>
                    <Icons.X />
                  </button>
                ) : null}
              </div>
              {searchQuery && (
                <div className="font-mono text-xs mt-1.5 px-1" style={{ color: '#8a8070' }}>
                  {notes.length} RESULT{notes.length !== 1 ? 'S' : ''} · LEVENSHTEIN
                </div>
              )}
            </div>

            {/* Create Note Button */}
            <button
              onClick={createNote}
              className="flex items-center gap-2.5 px-4 py-2.5 font-orbitron text-xs tracking-widest transition-all hover:brightness-95"
              style={{ background: '#1a1a14', color: '#f5f0e8', borderBottom: '1px solid #1a1a14' }}
            >
              <Icons.Plus />
              NEW NOTE
            </button>

            {/* Note Navigation List */}
            <div className="flex-1 overflow-y-auto">
              {loadingNotes ? (
                <div className="p-6 text-center font-mono text-xs flex items-center justify-center gap-2" style={{ color: '#8a8070' }}>
                  <Icons.Loader /> LOADING NODES...
                </div>
              ) : notes.length === 0 ? (
                <div className="p-6 text-center font-mono text-xs" style={{ color: '#8a8070' }}>
                  NO NODES FOUND
                </div>
              ) : (
                notes.map((note) => {
                  const id = note._id || note.id;
                  const title = note.title || 'Untitled Node';
                  const body = note.body || note.content || '';
                  const isSelected = activeId === id;

                  return (
                    <div
                      key={id}
                      onClick={() => selectNote(id)}
                      className="w-full text-left px-4 py-3 transition-all group relative cursor-pointer"
                      style={{
                        background: isSelected ? '#e8ede8' : 'transparent',
                        borderBottom: '1px solid #d8d0c0',
                        borderLeft: isSelected ? '2px solid #1a1a14' : '2px solid transparent',
                      }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span
                          className="font-rajdhani font-semibold text-sm leading-tight flex-1 truncate"
                          style={{ color: '#1a1a14' }}
                        >
                          {title}
                        </span>
                        <button
                          onClick={(e) => { e.stopPropagation(); requestDelete(id); }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5"
                          style={{ color: '#c0392b' }}
                        >
                          <Icons.Trash />
                        </button>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="font-mono text-xs" style={{ color: '#8a8070' }}>
                          {relativeTime(note.updatedAt || note.createdAt)}
                        </span>
                        <span className="font-mono text-xs" style={{ color: '#8a8070' }}>
                          {wordCount(body)}w
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Main Note Editor Panel */}
        {(!isMobile || mobileTab === 'editor') && (
          <div className="flex-1 flex flex-col overflow-hidden nf-editor-pane">
            {activeNote ? (
              <>
                {/* Note Editor Header */}
                <div
                  className="flex items-center gap-3 px-6 py-3 nf-editor-header"
                  style={{ borderBottom: '1px solid #d8d0c0', background: '#ede8dd' }}
                >
                  {isMobile && (
                    <button
                      onClick={() => setMobileTab('nodes')}
                      className="flex items-center gap-1 font-orbitron text-xs px-2 py-1"
                      style={{ background: '#1a1a14', color: '#f5f0e8' }}
                    >
                      <Icons.Back /> NODES
                    </button>
                  )}
                  <span style={{ color: '#8a8070' }}><Icons.Note /></span>
                  {editTitle ? (
                    <input
                      ref={titleRef}
                      value={titleDraft}
                      onChange={(e) => setTitleDraft(e.target.value)}
                      onBlur={commitTitle}
                      onKeyDown={(e) => { if (e.key === 'Enter') commitTitle(); if (e.key === 'Escape') setEditTitle(false); }}
                      className="flex-1 bg-transparent font-rajdhani font-bold text-lg"
                      style={{ color: '#1a1a14', border: 'none', borderBottom: '1px solid #1a1a14' }}
                    />
                  ) : (
                    <button
                      onClick={startEditTitle}
                      className="flex-1 text-left font-rajdhani font-bold text-lg hover:opacity-70 transition-opacity truncate"
                      style={{ color: '#1a1a14' }}
                    >
                      {activeNote.title}
                    </button>
                  )}
                  <div className="flex items-center gap-2 ml-auto">
                    <span className="font-mono text-xs flex items-center gap-1.5" style={{ color: '#8a8070' }}>
                      <Icons.Word />
                      {currentWordCount}w
                    </span>
                    <button
                      onClick={() => saveNoteToDb(activeNote._id || activeNote.id, activeNote.title, noteContent)}
                      className="flex items-center gap-1.5 px-3 py-1.5 font-orbitron text-xs tracking-wider transition-all hover:brightness-95"
                      style={{ background: '#e8e2d6', border: '1px solid #d8d0c0', color: '#5a5548' }}
                    >
                      <Icons.Save />
                      SYNC
                    </button>
                    {!isMobile && (
                      <button
                        onClick={() => setShowAI((p) => !p)}
                        className="flex items-center gap-2 px-3 py-1.5 font-orbitron text-xs tracking-wider transition-all"
                        style={{
                          background: showAI ? '#e8ede8' : '#e8e2d6',
                          border: `1px solid ${showAI ? '#2e7d5240' : '#d8d0c0'}`,
                          color: showAI ? '#2e7d52' : '#5a5548',
                        }}
                      >
                        <Icons.AI />
                        AI
                      </button>
                    )}
                  </div>
                </div>

                {/* Note Body Textarea */}
                <textarea
                  ref={textareaRef}
                  value={noteContent}
                  onChange={(e) => updateContent(e.target.value)}
                  placeholder={"// BEGIN TRANSMISSION\n\nStart writing..."}
                  className="flex-1 resize-none p-4 md:p-6 font-rajdhani text-base leading-relaxed"
                  style={{
                    background: '#f5f0e8',
                    color: '#1a1a14',
                    caretColor: '#1a1a14',
                    letterSpacing: '0.02em',
                  }}
                />

                {/* Note Editor Status Bar */}
                <div
                  className="flex items-center gap-3 px-4 py-1.5 flex-wrap"
                  style={{ borderTop: '1px solid #d8d0c0', background: '#ede8dd' }}
                >
                  <span className="font-mono text-xs" style={{ color: '#8a8070' }}>
                    {noteContent.split('\n').length} L
                  </span>
                  <span className="font-mono text-xs" style={{ color: '#8a8070' }}>·</span>
                  <span className="font-mono text-xs" style={{ color: '#8a8070' }}>
                    {noteContent.length} C
                  </span>
                  <div className="flex-1" />
                  <span className="font-mono text-xs flex items-center gap-1.5" style={{ color: '#8a8070' }}>
                    <span className="w-1 h-1 rounded-full" style={{ background: '#2e7d52', display: 'inline-block' }} />
                    UTF-8
                  </span>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 p-6">
                <div className="font-orbitron text-2xl" style={{ color: '#1a1a14' }}>
                  NOTE<span style={{ color: '#c0392b' }}>FLOW</span>
                </div>
                <div className="font-mono text-xs text-center" style={{ color: '#8a8070' }}>
                  SELECT A NODE OR CREATE NEW
                </div>
                <button
                  onClick={createNote}
                  className="flex items-center gap-2 px-5 py-2.5 font-orbitron text-xs tracking-widest mt-2 transition-all hover:brightness-95"
                  style={{ background: '#1a1a14', color: '#f5f0e8' }}
                >
                  <Icons.Plus />
                  INITIALIZE NODE
                </button>
              </div>
            )}
          </div>
        )}

        {/* Gemini AI Side Panel */}
        {((!isMobile && showAI) || (isMobile && mobileTab === 'ai')) && activeNote && (
          <div
            className="overflow-hidden flex flex-col slide-in nf-ai-pane"
            style={{ width: isMobile ? '100%' : 260, borderLeft: isMobile ? 'none' : '1px solid #d8d0c0' }}
          >
            <AIPanel content={noteContent} onApply={applyAI} />
          </div>
        )}
      </div>

      {/* Modals & Toasts */}
      {confirmDelete && (
        <ConfirmModal
          title={notes.find((n) => (n._id === confirmDelete || n.id === confirmDelete))?.title ?? ''}
          onConfirm={confirmDeleteNote}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
      <ToastContainer toasts={toasts} remove={removeToast} />
    </div>
  );
}
