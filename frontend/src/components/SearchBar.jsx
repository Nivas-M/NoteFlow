import { useState, useRef } from 'react';

/* Inline SVG — no emoji, no icon library */
function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

export default function SearchBar({ onSearch, resultCount, isSearching }) {
  const [value, setValue] = useState('');
  const timerRef = useRef(null);

  function handleChange(e) {
    const q = e.target.value;
    setValue(q);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onSearch(q), 400);
  }

  function handleClear() {
    setValue('');
    clearTimeout(timerRef.current);
    onSearch('');
  }

  return (
    <div>
      <div className="search-bar">
        <span className="search-bar__icon"><SearchIcon /></span>
        <input
          id="search-input"
          className="search-bar__input"
          type="search"
          placeholder="Search notes — typos OK (fuzzy match)"
          value={value}
          onChange={handleChange}
          aria-label="Fuzzy search notes"
          autoComplete="off"
        />
        {value && (
          <button
            className="search-bar__clear"
            onClick={handleClear}
            aria-label="Clear search"
          >
            &times;
          </button>
        )}
      </div>

      {value && !isSearching && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
          <span className="search-bar__badge">
            <span className="search-bar__badge-dot" />
            {resultCount === 0
              ? 'No fuzzy matches found'
              : `${resultCount} fuzzy match${resultCount !== 1 ? 'es' : ''} · Levenshtein distance ≤ 2`}
          </span>
        </div>
      )}
    </div>
  );
}
