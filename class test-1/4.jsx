import React, { useState } from 'react';

const NAMES = [
  'Aarav Sharma',
  'Ananya Verma',
  'Devansh Gupta',
  'Ishita Patel',
  'Kabir Mehta',
  'Meera Nair',
  'Rohan Iyer',
  'Sneha Reddy'
];

export default function LiveSearchFilter() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredNames = NAMES.filter(name =>
    name.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  return (
    <div style={{ padding: '16px', border: '1px solid #ccc', margin: '10px 0' }}>
      <h3>Live Search Filter</h3>
      <input
        type="text"
        placeholder="Search names..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {filteredNames.length > 0 ? (
        <ul>
          {filteredNames.map((name, index) => (
            <li key={index}>{name}</li>
          ))}
        </ul>
      ) : (
        <p>No results found</p>
      )}
    </div>
  );
}