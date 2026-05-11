import NoteForm from '../components/NoteForm.jsx';

/**
 * EditNote page — thin wrapper that renders NoteForm.
 * NoteForm reads useParams() internally to decide create vs. edit.
 */
export default function EditNote() {
  return <NoteForm />;
}
