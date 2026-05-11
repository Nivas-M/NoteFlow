import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Home     from './pages/Home.jsx';
import EditNote from './pages/EditNote.jsx';

export default function App() {
  const navigate = useNavigate();

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="navbar__brand">
          <span className="navbar__brand-mark" aria-hidden="true" />
          Noteflow
        </Link>
        <button
          id="new-note-btn"
          className="navbar__new-btn"
          onClick={() => navigate('/new')}
        >
          + New Note
        </button>
      </nav>

      <main>
        <Routes>
          <Route path="/"         element={<Home />} />
          <Route path="/new"      element={<EditNote />} />
          <Route path="/edit/:id" element={<EditNote />} />
        </Routes>
      </main>
    </>
  );
}
