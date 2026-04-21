import { useEffect, useState } from 'react';
import './App.css';
import Header from './components/Header';
import ResumeInput from './components/ResumeInput';
import ResultsSection from './components/ResultsSection';
import AuthScreen from './components/AuthScreen';

const API_URL = 'http://localhost:5000/api/analyze';
const AUTH_STORAGE_KEY = 'jobmatch.auth';

function App() {
  const [auth, setAuth] = useState(null);
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) setAuth(JSON.parse(saved));
    } catch {
      // ignore corrupt storage
    }
  }, []);

  const handleAuth = ({ user, token }) => {
    const next = { user, token };
    setAuth(next);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(next));
  };

  const handleLogout = () => {
    setAuth(null);
    setResults(null);
    setError(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

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

  if (!auth) {
    return <AuthScreen onAuth={handleAuth} />;
  }

  return (
    <div className="app">
      <div className="user-bar">
        <span>
          Signed in as <span className="user-bar__name">{auth.user.name}</span>
        </span>
        <button type="button" className="user-bar__logout" onClick={handleLogout}>
          Sign out
        </button>
      </div>

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
