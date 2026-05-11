import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

/* ── Icons ─────────────────────────────────────── */
function SearchIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
  );
}
function PlusIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
function DocIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}
function EditIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}
function DeleteIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

function formatDate(iso) {
  const date = new Date(iso);
  const now   = new Date();
  const diff  = (now - date) / 1000;
  if (diff < 60)        return 'Just now';
  if (diff < 3600)      return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400)     return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function wordCount(text = '') {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export default function Home() {
  const navigate = useNavigate();
  const [notes,         setNotes]         = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [searching,     setSearching]     = useState(false);
  const [query,         setQuery]         = useState('');
  const [toast,         setToast]         = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchNotes = useCallback(async (searchQuery = '') => {
    searchQuery ? setSearching(true) : setLoading(true);
    try {
      const url = searchQuery
        ? `/api/notes?search=${encodeURIComponent(searchQuery)}`
        : '/api/notes';
      setNotes(await (await fetch(url)).json());
    } catch {
      showToast('Could not load notes.', 'error');
    } finally {
      setLoading(false);
      setSearching(false);
    }
  }, []);

  useEffect(() => { fetchNotes(); }, [fetchNotes]);

  function handleSearch(e) {
    const q = e.target.value;
    setQuery(q);
    clearTimeout(window._st);
    window._st = setTimeout(() => fetchNotes(q), 380);
  }

  async function handleDelete(id) {
    try {
      await fetch(`/api/notes/${id}`, { method: 'DELETE' });
      setNotes((p) => p.filter((n) => n._id !== id));
      showToast('Page deleted.', 'success');
    } catch {
      showToast('Failed to delete.', 'error');
    } finally {
      setDeleteConfirm(null);
    }
  }

  function showToast(message, type = 'success') {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  const totalWords = notes.reduce((acc, n) => acc + wordCount(n.body), 0);
  const lastEdited = notes.length
    ? notes.reduce((a, b) => new Date(a.updatedAt) > new Date(b.updatedAt) ? a : b)
    : null;

  return (
    <div className="hp-root">

      {/* Hero band */}
      <div className="hp-hero">
        <div className="hp-hero__left">
          <p className="hp-hero__eyebrow">Workspace</p>
          <h1 className="hp-hero__title">Noteflow</h1>
          <p className="hp-hero__sub">
            {loading ? 'Loading…' : `${notes.length} page${notes.length !== 1 ? 's' : ''}`}
            {lastEdited && !loading && (
              <> &middot; Last edited {formatDate(lastEdited.updatedAt)}</>
            )}
          </p>
        </div>
        <button
          id="new-note-btn-home"
          className="hp-hero__new-btn"
          onClick={() => navigate('/new')}
        >
          <PlusIcon /> New page
        </button>
      </div>

      {/* Stats strip */}
      {!loading && notes.length > 0 && (
        <div className="hp-stats">
          <div className="hp-stat">
            <span className="hp-stat__val">{notes.length}</span>
            <span className="hp-stat__label">Pages</span>
          </div>
          <div className="hp-stat__div" />
          <div className="hp-stat">
            <span className="hp-stat__val">{totalWords.toLocaleString()}</span>
            <span className="hp-stat__label">Total words</span>
          </div>
          <div className="hp-stat__div" />
          <div className="hp-stat">
            <span className="hp-stat__val">{lastEdited ? formatDate(lastEdited.updatedAt) : '—'}</span>
            <span className="hp-stat__label">Last edited</span>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="hp-search-wrap">
        <span className="hp-search-icon"><SearchIcon /></span>
        <input
          id="search-input"
          className="hp-search"
          type="search"
          value={query}
          onChange={handleSearch}
          placeholder="Search pages…"
          autoComplete="off"
          aria-label="Search notes"
        />
        {query && (
          <button className="hp-search-clear" onClick={() => { setQuery(''); fetchNotes(''); }}>×</button>
        )}
        {searching && <span className="hp-search-spinner" />}
      </div>

      {/* Table head */}
      {!loading && notes.length > 0 && (
        <div className="hp-table-head">
          <span>Page</span>
          <span>Words</span>
          <span>Last edited</span>
        </div>
      )}

      {/* List */}
      <div id="notes-list" className="hp-list" aria-label="Notes" aria-live="polite">
        {loading ? (
          <div className="hp-spinner-wrap"><div className="spinner" /></div>
        ) : notes.length === 0 ? (
          <div className="hp-empty">
            <div className="hp-empty__icon">
              <DocIcon />
            </div>
            <p className="hp-empty__title">
              {query ? `No results for "${query}"` : 'No pages yet'}
            </p>
            <p className="hp-empty__sub">
              {query
                ? 'Try a different search term.'
                : 'Get started by creating your first page.'}
            </p>
            {!query && (
              <button className="hp-empty__cta" onClick={() => navigate('/new')}>
                <PlusIcon /> New page
              </button>
            )}
          </div>
        ) : (
          notes.map((note) => (
            <div
              key={note._id}
              id={`note-row-${note._id}`}
              className="hp-row"
              onClick={() => navigate(`/edit/${note._id}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && navigate(`/edit/${note._id}`)}
            >
              <div className="hp-row__main">
                <span className="hp-row__icon"><DocIcon /></span>
                <div className="hp-row__text">
                  <span className="hp-row__title">{note.title || 'Untitled'}</span>
                  <span className="hp-row__preview">{note.body?.slice(0, 70) || <em className="hp-row__empty-body">No content</em>}</span>
                </div>
              </div>
              <span className="hp-row__words">{wordCount(note.body).toLocaleString()}</span>
              <span className="hp-row__date">{formatDate(note.updatedAt)}</span>
              <div className="hp-row__actions" onClick={(e) => e.stopPropagation()}>
                {deleteConfirm === note._id ? (
                  <div className="hp-row__confirm">
                    <span>Delete?</span>
                    <button className="hp-row__action-btn hp-row__action-btn--yes" onClick={() => handleDelete(note._id)}>Yes</button>
                    <button className="hp-row__action-btn" onClick={() => setDeleteConfirm(null)}>No</button>
                  </div>
                ) : (
                  <>
                    <button id={`edit-btn-${note._id}`} className="hp-row__action-btn" onClick={() => navigate(`/edit/${note._id}`)} title="Edit"><EditIcon /></button>
                    <button id={`delete-btn-${note._id}`} className="hp-row__action-btn hp-row__action-btn--danger" onClick={() => setDeleteConfirm(note._id)} title="Delete"><DeleteIcon /></button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {query && !searching && notes.length > 0 && (
        <p className="hp-match-count">{notes.length} fuzzy match{notes.length !== 1 ? 'es' : ''} for "{query}"</p>
      )}

      {toast && <div className={`toast toast--${toast.type}`} role="alert">{toast.message}</div>}
    </div>
  );
}
