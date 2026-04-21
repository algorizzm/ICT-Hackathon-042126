import { useState } from 'react';
import LandingPage from './pages/LandingPage';
import Dashboard   from './dashboard/Dashboard';
import './App.css';

const API_URL = 'http://localhost:5000/api/analyze';

export default function App() {
  const [results,   setResults]   = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error,     setError]     = useState(null);

  const handleAnalyze = async (resumeText) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server error (${response.status})`);
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message || 'Failed to connect to the server. Make sure the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  if (results) {
    return (
      <Dashboard
        results={results}
        onAnalyzeAgain={() => { setResults(null); setError(null); }}
      />
    );
  }

  return (
    <LandingPage
      onAnalyze={handleAnalyze}
      isLoading={isLoading}
      error={error}
    />
  );
}
