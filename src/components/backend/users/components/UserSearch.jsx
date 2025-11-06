import React from 'react';
import { FaSearch } from 'react-icons/fa';

const UserSearch = ({ searchTerm, setSearchTerm }) => {
  return (
    // Ejemplo: UserSearch.jsx
<div className="relative w-full">
  <input
    type="text"
    placeholder="Buscar usuarios..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    style={{
      background: 'var(--bg-secondary)',
      color: 'var(--text-primary)',
      border: '1px solid var(--border-primary)',
      padding: '0.75rem 1rem 0.75rem 2.5rem',
      borderRadius: '0.75rem',
      width: '100%',
      fontSize: '1rem'
    }}
  />
  <FaSearch style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
</div>
  );
};

export default UserSearch;