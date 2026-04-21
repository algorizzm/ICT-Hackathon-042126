import { useEffect, useState } from 'react';
import LandingPage from './pages/LandingPage';
import Dashboard from './dashboard/Dashboard';
import AuthScreen from './components/AuthScreen';
import './App.css';

const API_URL = 'http://localhost:5000/api/analyze';
const AUTH_STORAGE_KEY = 'jobmatch.auth';

export default function App() {
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

  if (results) {
    return (
      <Dashboard
        results={results}
        onAnalyzeAgain={() => { setResults(null); setError(null); }}
        user={auth.user}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <LandingPage
      onAnalyze={handleAnalyze}
      isLoading={isLoading}
      error={error}
      user={auth.user}
      onLogout={handleLogout}
    />
  );
}
