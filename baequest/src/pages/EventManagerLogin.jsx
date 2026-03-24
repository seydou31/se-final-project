import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { eventManagerLogin } from '../utils/api.js';
import '../blocks/event-manager.css';

export default function EventManagerLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await eventManagerLogin({ email, password });
      if (!res.stripeOnboardingComplete) {
        navigate('/event-manager/onboarding');
      } else {
        navigate('/event-manager/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="em-page">
      <div className="em-card">
        <h1 className="em-card__title">Event Manager Login</h1>
        <p className="em-card__subtitle">Sign in to your event manager account</p>
        <form onSubmit={handleSubmit}>
          <label className="em-form__label" htmlFor="em-email">Email</label>
          <input
            id="em-email"
            type="email"
            className="em-form__input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
          <label className="em-form__label" htmlFor="em-password">Password</label>
          <input
            id="em-password"
            type="password"
            className="em-form__input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
            required
          />
          {error && <p className="em-error">{error}</p>}
          <button
            type="submit"
            className="em-btn em-btn--primary"
            disabled={loading || !email || !password}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <Link to="/event-manager/signup" className="em-link">
          Don&apos;t have an account? Sign up
        </Link>
      </div>
    </div>
  );
}
