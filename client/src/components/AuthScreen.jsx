import { useState } from 'react';
import API_BASE_URL from '../config';

const API_BASE = `${API_BASE_URL}/api/auth`;

export default function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isRegister = mode === 'register';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const endpoint = isRegister ? `${API_BASE}/register` : `${API_BASE}/login`;
      const payload = isRegister ? { name, email, password } : { email, password };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || `Request failed (${response.status})`);
      }

      onAuth({ user: data.user, token: data.token });
    } catch (err) {
      setError(err.message || 'Unable to reach the server. Is the backend running?');
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchMode = () => {
    setMode(isRegister ? 'login' : 'register');
    setError(null);
  };

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-card__header">
          <div className="header__badge">
            <span className="header__badge-dot"></span>
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </div>
          <h1 className="auth-card__title">
            {isRegister ? 'Join ' : 'Sign in to '}
            <span className="header__title-gradient">Aptitude</span>
          </h1>
          <p className="auth-card__subtitle">
            {isRegister
              ? 'Create an account to analyze your resume and track your career matches.'
              : 'Enter your credentials to continue where you left off.'}
          </p>
        </div>

        {error && (
          <div className="error-banner">
            <span className="error-banner__icon">⚠️</span>
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          {isRegister && (
            <label className="auth-form__field">
              <span className="auth-form__label">Name</span>
              <input
                className="auth-form__input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                required
                autoComplete="name"
              />
            </label>
          )}

          <label className="auth-form__field">
            <span className="auth-form__label">Email</span>
            <input
              className="auth-form__input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </label>

          <label className="auth-form__field">
            <span className="auth-form__label">Password</span>
            <input
              className="auth-form__input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isRegister ? 'At least 6 characters' : 'Your password'}
              required
              minLength={6}
              autoComplete={isRegister ? 'new-password' : 'current-password'}
            />
          </label>

          <button type="submit" className="btn btn--primary auth-form__submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className="btn__spinner"></span>
                {isRegister ? 'Creating account…' : 'Signing in…'}
              </>
            ) : (
              <>{isRegister ? 'Create Account' : 'Sign In'}</>
            )}
          </button>
        </form>

        <div className="auth-card__switch">
          {isRegister ? 'Already have an account?' : "Don't have an account yet?"}{' '}
          <button type="button" className="auth-card__switch-btn" onClick={switchMode}>
            {isRegister ? 'Sign in' : 'Create one'}
          </button>
        </div>
      </div>
    </div>
  );
}
