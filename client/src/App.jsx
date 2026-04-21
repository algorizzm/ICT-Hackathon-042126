import { useState } from 'react';
import './App.css';
import Header from './components/Header';
import ResumeInput from './components/ResumeInput';
import ResultsSection from './components/ResultsSection';

const API_URL = 'http://localhost:5000/api/analyze';

function App() {
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async (resumeText) => {
    setIsLoading(true);
    setError(null);
    setResults(null);

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

      // Scroll to results
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 100);
    } catch (err) {
      setError(err.message || 'Failed to connect to the server. Make sure the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app">
      <Header />
      <ResumeInput onAnalyze={handleAnalyze} isLoading={isLoading} />

      {error && (
        <div className="error-banner" id="error-banner">
          <span className="error-banner__icon">⚠️</span>
          {error}
        </div>
      )}

      {isLoading && (
        <div className="loading-overlay" id="loading-indicator">
          <div className="loading-overlay__spinner"></div>
          <div className="loading-overlay__text">Analyzing your resume...</div>
        </div>
      )}

      <ResultsSection data={results} />
    </div>
  );
}

export default App;
