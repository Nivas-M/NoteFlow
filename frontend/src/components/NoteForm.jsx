import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

/* ── Icons ─────────────────────────────────────── */
function IconSparkle() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
    </svg>
  );
}
function IconCopy() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}
function IconCheck() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
function IconArrowLeft() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 12H5M12 5l-7 7 7 7" />
    </svg>
  );
}
function IconChevron({ open }) {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true" style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)', transition: '0.15s ease' }}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}
function Spinner() { return <span className="nf-spinner" aria-hidden="true" />; }

/* ── AI actions config ────────────────────────── */
const AI_ACTIONS = [
  {
    id: 'summarize',
    label: 'Summarize',
    desc: 'Get a 2–3 sentence overview',
    endpoint: '/api/ai/summarize',
    minLen: 10,
    minMsg: 'Write at least 10 characters to summarize.',
    resultLabel: 'Summary',
    canApply: false,
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="21" y1="10" x2="7" y2="10" /><line x1="21" y1="6" x2="3" y2="6" />
        <line x1="21" y1="14" x2="3" y2="14" /><line x1="21" y1="18" x2="7" y2="18" />
      </svg>
    ),
  },
  {
    id: 'grammar',
    label: 'Fix grammar',
    desc: 'Correct spelling & punctuation',
    endpoint: '/api/ai/fix-grammar',
    minLen: 5,
    minMsg: 'Write at least 5 characters.',
    resultLabel: 'Corrected text',
    canApply: true,
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="4 7 4 4 20 4 20 7" /><line x1="9" y1="20" x2="15" y2="20" />
        <line x1="12" y1="4" x2="12" y2="20" />
      </svg>
    ),
  },
  {
    id: 'expand',
    label: 'Expand',
    desc: 'Elaborate on your draft',
    endpoint: '/api/ai/expand',
    minLen: 5,
    minMsg: 'Write at least 5 characters to expand.',
    resultLabel: 'Expanded version',
    canApply: true,
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" />
        <line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" />
      </svg>
    ),
  },
  {
    id: 'action-items',
    label: 'Action items',
    desc: 'Extract tasks as a checklist',
    endpoint: '/api/ai/action-items',
    minLen: 10,
    minMsg: 'Write at least 10 characters.',
    resultLabel: 'Action items',
    canApply: false,
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="9 11 12 14 22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
  },
  {
    id: 'make-formal',
    label: 'Make formal',
    desc: 'Professional tone rewrite',
    endpoint: '/api/ai/make-formal',
    minLen: 5,
    minMsg: 'Write at least 5 characters.',
    resultLabel: 'Formal version',
    canApply: true,
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
  },
];

/* ── Component ──────────────────────────────────── */
export default function NoteForm() {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const isEditing = Boolean(id);
  const bodyRef   = useRef(null);

  const [title,     setTitle]     = useState('');
  const [body,      setBody]      = useState('');
  const [errors,    setErrors]    = useState({});
  const [loading,   setLoading]   = useState(false);
  const [fetching,  setFetching]  = useState(isEditing);
  const [aiLoading, setAiLoading] = useState(null);
  const [aiResult,  setAiResult]  = useState(null); // { actionId, label, text, canApply }
  const [copied,    setCopied]    = useState(false);
  const [toast,     setToast]     = useState(null);

  /* Auto-grow textarea */
  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  }, [body]);

  /* Load note */
  useEffect(() => {
    if (!isEditing) return;
    fetch(`/api/notes/${id}`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((d)  => { setTitle(d.title); setBody(d.body); setFetching(false); })
      .catch(()  => { showToast('Could not load note.', 'error'); setFetching(false); });
  }, [id, isEditing]);

  function validate() {
    const e = {};
    if (!title.trim()) e.title = 'Title is required.';
    if (!body.trim())  e.body  = 'Body is required.';
    setErrors(e);
    return !Object.keys(e).length;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await fetch(isEditing ? `/api/notes/${id}` : '/api/notes', {
        method:  isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ title: title.trim(), body: body.trim() }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.message); }
      navigate('/');
    } catch (err) {
      showToast(err.message || 'Failed to save.', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function handleAI(action) {
    if (body.trim().length < action.minLen) { showToast(action.minMsg, 'error'); return; }
    setAiResult(null);
    setAiLoading(action.id);
    try {
      const res  = await fetch(action.endpoint, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ text: body }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setAiResult({ actionId: action.id, label: action.resultLabel, text: data.result, canApply: action.canApply });
    } catch (err) {
      showToast(err.message || 'AI request failed.', 'error');
    } finally {
      setAiLoading(null);
    }
  }

  function handleApply() {
    if (aiResult?.canApply) { setBody(aiResult.text); setAiResult(null); showToast('Applied to note.', 'success'); }
  }

  async function handleCopy() {
    if (!aiResult) return;
    try {
      await navigator.clipboard.writeText(aiResult.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { showToast('Could not copy.', 'error'); }
  }

  function showToast(msg, type = 'success') {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  if (fetching) {
    return <div className="nf-page"><div className="spinner-wrap"><div className="spinner" /></div></div>;
  }

  return (
    <div className="nf-page">

      {/* ── Left AI Sidebar ─────────────────────────── */}
      <aside className="nf-sidebar">
        <div className="nf-sidebar__header">
          <IconSparkle />
          <span>AI Tools</span>
        </div>
        <p className="nf-sidebar__sub">Powered by Gemma 4</p>

        <div className="nf-sidebar__actions">
          {AI_ACTIONS.map((action) => {
            const isActive   = aiResult?.actionId === action.id;
            const isLoading  = aiLoading === action.id;
            return (
              <div key={action.id} className={`nf-action ${isActive ? 'nf-action--active' : ''}`}>
                <button
                  id={`ai-${action.id}-btn`}
                  type="button"
                  className="nf-action__btn"
                  onClick={() => handleAI(action)}
                  disabled={aiLoading !== null}
                >
                  <span className="nf-action__icon">{action.icon}</span>
                  <span className="nf-action__text">
                    <span className="nf-action__name">{action.label}</span>
                    <span className="nf-action__desc">{action.desc}</span>
                  </span>
                  {isLoading ? <Spinner /> : <IconChevron open={isActive} />}
                </button>

                {/* Inline result under each action */}
                {isActive && aiResult && (
                  <div className="nf-action__result">
                    <p className="nf-action__result-text">{aiResult.text}</p>
                    <div className="nf-action__result-btns">
                      {aiResult.canApply && (
                        <button
                          id="ai-apply-btn"
                          type="button"
                          className="nf-action__result-btn nf-action__result-btn--apply"
                          onClick={handleApply}
                        >
                          <IconCheck /> Apply
                        </button>
                      )}
                      <button
                        id="ai-copy-btn"
                        type="button"
                        className="nf-action__result-btn"
                        onClick={handleCopy}
                      >
                        <IconCopy /> {copied ? 'Copied!' : 'Copy'}
                      </button>
                      <button
                        type="button"
                        className="nf-action__result-btn"
                        onClick={() => setAiResult(null)}
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="nf-sidebar__tip">
          <p>Select an action to run AI on your current note content.</p>
        </div>
      </aside>

      {/* ── Editor ──────────────────────────────────── */}
      <div className="nf-editor-col">
        <button className="nf-back" onClick={() => navigate('/')} type="button">
          <IconArrowLeft /> Back
        </button>

        <form
          id={isEditing ? 'edit-note-form' : 'new-note-form'}
          className="nf-form"
          onSubmit={handleSubmit}
          noValidate
        >
          <input
            id="note-title"
            className="nf-title"
            type="text"
            placeholder="Untitled"
            value={title}
            onChange={(e) => { setTitle(e.target.value); setErrors((p) => ({ ...p, title: '' })); }}
            maxLength={200}
            autoFocus
          />
          {errors.title && <p className="nf-field-error">{errors.title}</p>}

          <div className="nf-editor-divider" />

          <textarea
            id="note-body"
            ref={bodyRef}
            className="nf-body"
            placeholder="Start writing…"
            value={body}
            onChange={(e) => { setBody(e.target.value); setErrors((p) => ({ ...p, body: '' })); }}
          />
          {errors.body && <p className="nf-field-error">{errors.body}</p>}

          <div className="nf-footer">
            <button id="submit-note-btn" type="submit" className="nf-btn nf-btn--save" disabled={loading}>
              {loading ? 'Saving…' : isEditing ? 'Save changes' : 'Create page'}
            </button>
            <button id="cancel-note-btn" type="button" className="nf-btn nf-btn--cancel" onClick={() => navigate('/')}>
              Cancel
            </button>
            {body.trim() && (
              <span className="nf-word-count">
                {body.trim().split(/\s+/).filter(Boolean).length} words
              </span>
            )}
          </div>
        </form>
      </div>

      {toast && <div className={`toast toast--${toast.type}`} role="alert">{toast.message}</div>}
    </div>
  );
}
