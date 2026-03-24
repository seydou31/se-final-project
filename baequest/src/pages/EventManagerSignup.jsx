import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { eventManagerRegister, eventManagerLogin } from '../utils/api.js';
import '../blocks/event-manager.css';

export default function EventManagerSignup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await eventManagerRegister({ name, email, password });
      await eventManagerLogin({ email, password });
      navigate('/event-manager/onboarding');
    } catch (err) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="em-page">
      <div className="em-card">
        <h1 className="em-card__title">Event Manager Account</h1>
        <p className="em-card__subtitle">Sign up to start creating events on BaeQuest</p>
        <form onSubmit={handleSubmit}>
          <label className="em-form__label" htmlFor="em-name">Full Name</label>
          <input
            id="em-name"
            type="text"
            className="em-form__input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
          />
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
            placeholder="Min 8 characters"
            required
            minLength={8}
          />
          <label className="em-form__label" htmlFor="em-confirm">Confirm Password</label>
          <input
            id="em-confirm"
            type="password"
            className="em-form__input"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Repeat password"
            required
          />
          {error && <p className="em-error">{error}</p>}
          <button
            type="submit"
            className="em-btn em-btn--primary"
            disabled={loading || !email || !password || !confirm}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <Link to="/event-manager/login" className="em-link">
          Already have an account? Sign in
        </Link>
      </div>
    </div>
  );
}
