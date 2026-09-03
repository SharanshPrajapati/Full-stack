import React, { useState, useEffect } from 'react';

export default function Stopwatch() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timer = null;
    if (isRunning) {
      timer = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  const handleReset = () => {
    setIsRunning(false);
    setSeconds(0);
  };

  return (
    <div style={{ padding: '16px', border: '1px solid #ccc', margin: '10px 0' }}>
      <h3>Stopwatch</h3>
      <p>Elapsed Time: {seconds}s</p>
      <button onClick={() => setIsRunning(true)} disabled={isRunning}>
        Start
      </button>
      <button onClick={() => setIsRunning(false)} disabled={!isRunning}>
        Pause
      </button>
      <button onClick={handleReset}>Reset</button>
    </div>
  );
}