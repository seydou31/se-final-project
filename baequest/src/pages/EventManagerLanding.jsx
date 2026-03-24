import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { eventManagerRegister, eventManagerLogin, createCuratedEvent } from '../utils/api.js';
import '../blocks/add-event.css';
import '../blocks/event-manager.css';

const STEPS = { EVENT: 'event', ACCOUNT: 'account' };

export default function EventManagerLanding() {
  const [step, setStep] = useState(STEPS.EVENT);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zipcode: '',
    startTime: '',
    endTime: '',
    description: '',
    link: '',
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [account, setAccount] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handlePhotoChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  function handleEventContinue(e) {
    e.preventDefault();
    setError('');
    setStep(STEPS.ACCOUNT);
  }

  async function handleAccountSubmit(e) {
    e.preventDefault();
    if (account.password !== account.confirm) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await eventManagerRegister({ name: account.name, email: account.email, password: account.password });
      await eventManagerLogin({ email: account.email, password: account.password });

      const startISO = new Date(formData.startTime).toISOString();
      const endISO = new Date(formData.endTime).toISOString();

      await createCuratedEvent({
        name: formData.name,
        address: formData.address,
        ...(formData.city && { city: formData.city }),
        ...(formData.state && { state: formData.state }),
        ...(formData.zipcode && { zipcode: formData.zipcode }),
        ...(formData.description && { description: formData.description }),
        ...(formData.link && { link: formData.link }),
        startTime: startISO,
        endTime: endISO,
      }, photoFile);

      navigate('/event-manager/dashboard');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (step === STEPS.ACCOUNT) {
    return (
      <div className="em-page">
        <div className="em-card">
          <h1 className="em-card__title">Create an account to publish your event</h1>
          <p className="em-card__subtitle">Your event details are saved — just create an account to go live.</p>

          <form onSubmit={handleAccountSubmit}>
            <label className="em-form__label" htmlFor="em-name">Full Name</label>
            <input
              id="em-name"
              type="text"
              className="em-form__input"
              value={account.name}
              onChange={(e) => setAccount((p) => ({ ...p, name: e.target.value }))}
              placeholder="Your name"
              required
            />
            <label className="em-form__label" htmlFor="em-email">Email</label>
            <input
              id="em-email"
              type="email"
              className="em-form__input"
              value={account.email}
              onChange={(e) => setAccount((p) => ({ ...p, email: e.target.value }))}
              placeholder="you@example.com"
              required
            />
            <label className="em-form__label" htmlFor="em-password">Password</label>
            <input
              id="em-password"
              type="password"
              className="em-form__input"
              value={account.password}
              onChange={(e) => setAccount((p) => ({ ...p, password: e.target.value }))}
              placeholder="Min 8 characters"
              required
              minLength={8}
            />
            <label className="em-form__label" htmlFor="em-confirm">Confirm Password</label>
            <input
              id="em-confirm"
              type="password"
              className="em-form__input"
              value={account.confirm}
              onChange={(e) => setAccount((p) => ({ ...p, confirm: e.target.value }))}
              placeholder="Repeat password"
              required
            />
            {error && <p className="em-error">{error}</p>}
            <button type="submit" className="em-btn em-btn--primary" disabled={loading}>
              {loading ? 'Publishing your event...' : 'Create Account & Publish Event'}
            </button>
            <button
              type="button"
              className="em-btn em-btn--secondary"
              onClick={() => { setStep(STEPS.EVENT); setError(''); }}
            >
              Back
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <main className="add-event">
      <div className="add-event__container">
        <h1 className="add-event__title">Add your event and let attendees see who&apos;s there in real time.</h1>
        <p className="add-event__subtitle">Fill in your event details to get started.</p>

        <form className="add-event__form" onSubmit={handleEventContinue}>
          <div className="add-event__field">
            <label className="add-event__label">Event Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="add-event__input"
              placeholder="Singles Mixer at The Rooftop"
              required
            />
          </div>

          <div className="add-event__field">
            <label className="add-event__label">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="add-event__input"
              placeholder="123 Main St, Washington, DC"
              required
            />
          </div>

          <div className="add-event__row">
            <div className="add-event__field">
              <label className="add-event__label">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="add-event__input"
                placeholder="Washington"
              />
            </div>
            <div className="add-event__field">
              <label className="add-event__label">State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="add-event__input"
                placeholder="DC"
                maxLength={3}
              />
            </div>
            <div className="add-event__field">
              <label className="add-event__label">Zipcode</label>
              <input
                type="text"
                name="zipcode"
                value={formData.zipcode}
                onChange={handleChange}
                className="add-event__input"
                placeholder="20001"
              />
            </div>
          </div>

          <div className="add-event__field">
            <label className="add-event__label">Description (optional)</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="add-event__input add-event__textarea"
              placeholder="Describe the event, dress code, what to expect..."
              maxLength={1000}
              rows={4}
            />
          </div>

          <div className="add-event__field">
            <label className="add-event__label">Event Photo (optional)</label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handlePhotoChange}
              className="add-event__input add-event__input--file"
            />
            {photoPreview && (
              <img src={photoPreview} alt="Preview" className="add-event__photo-preview" />
            )}
          </div>

          <div className="add-event__field">
            <label className="add-event__label">Event Link (optional)</label>
            <input
              type="url"
              name="link"
              value={formData.link}
              onChange={handleChange}
              className="add-event__input"
              placeholder="https://eventbrite.com/..."
            />
          </div>

          <div className="add-event__row">
            <div className="add-event__field">
              <label className="add-event__label">Start Time</label>
              <input
                type="datetime-local"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className="add-event__input add-event__input--datetime"
                required
              />
            </div>
            <div className="add-event__field">
              <label className="add-event__label">End Time</label>
              <input
                type="datetime-local"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className="add-event__input add-event__input--datetime"
                required
              />
            </div>
          </div>

          <button type="submit" className="add-event__submit">
            Continue
          </button>
        </form>

        <Link to="/event-manager/login" className="em-link" style={{ marginTop: 20 }}>
          Already have an account? Sign in
        </Link>
      </div>
    </main>
  );
}
