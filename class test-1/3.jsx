import React, { useState } from 'react';

export default function LoginToggle() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div style={{ padding: '16px', border: '1px solid #ccc', margin: '10px 0' }}>
      <h3>Authentication</h3>
      {isLoggedIn ? (
        <div>
          <p>Welcome back! You are logged in.</p>
          <button onClick={() => setIsLoggedIn(false)}>Logout</button>
        </div>
      ) : (
        <div>
          <p>Please log in to continue.</p>
          <button onClick={() => setIsLoggedIn(true)}>Login</button>
        </div>
      )}
    </div>
  );
}