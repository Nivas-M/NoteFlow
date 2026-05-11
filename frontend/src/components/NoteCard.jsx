import { useNavigate } from 'react-router-dom';

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

/* Inline SVGs — professional, no emoji */
function EditIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function DeleteIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

export default function NoteCard({ note, onDelete }) {
  const navigate = useNavigate();

  function handleEdit(e) {
    e.stopPropagation();
    navigate(`/edit/${note._id}`);
  }

  function handleDelete(e) {
    e.stopPropagation();
    onDelete(note._id);
  }

  return (
    <article
      id={`note-card-${note._id}`}
      className="note-card"
      onClick={() => navigate(`/edit/${note._id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/edit/${note._id}`)}
      aria-label={`Note: ${note.title}`}
    >
      <h2 className="note-card__title">{note.title}</h2>
      <p className="note-card__body">{note.body}</p>

      <footer className="note-card__footer">
        <time className="note-card__timestamp" dateTime={note.updatedAt}>
          {formatDate(note.updatedAt)}
        </time>

        <div className="note-card__actions" role="group" aria-label="Note actions">
          <button
            id={`edit-btn-${note._id}`}
            className="note-card__btn note-card__btn--edit"
            onClick={handleEdit}
            aria-label={`Edit "${note.title}"`}
            title="Edit"
          >
            <EditIcon />
          </button>
          <button
            id={`delete-btn-${note._id}`}
            className="note-card__btn note-card__btn--delete"
            onClick={handleDelete}
            aria-label={`Delete "${note.title}"`}
            title="Delete"
          >
            <DeleteIcon />
          </button>
        </div>
      </footer>
    </article>
  );
}
