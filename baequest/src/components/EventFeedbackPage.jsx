import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Loading from './Loading';
import '../blocks/event-feedback.css';

const VENUE_TYPES = [
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'cafe', label: 'Café' },
  { value: 'bar', label: 'Bar/Lounge' },
  { value: 'park', label: 'Park/Outdoor Space' },
  { value: 'museum', label: 'Museum/Gallery' },
  { value: 'venue', label: 'Event Venue' },
  { value: 'other', label: 'Other' },
];

export default function EventFeedbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [eventData, setEventData] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [showVenueSuggestion, setShowVenueSuggestion] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareText, setShareText] = useState('');

  const [venueSuggestion, setVenueSuggestion] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    type: 'restaurant',
    reason: '',
  });

  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

  useEffect(() => {
    if (!token) {
      setError('Invalid feedback link');
      setLoading(false);
      return;
    }

    // Fetch event details
    fetch(`${baseUrl}/events/feedback/${token}`)
      .then(res => {
        if (!res.ok) {
          return res.json().then(data => {
            throw new Error(data.error || data.message || 'Failed to load event');
          });
        }
        return res.json();
      })
      .then(data => {
        setEventData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [token, baseUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const feedbackData = {
        rating,
        comment: comment.trim(),
      };

      // Add venue suggestion if provided
      if (showVenueSuggestion && venueSuggestion.name.trim()) {
        feedbackData.venueSuggestion = {
          name: venueSuggestion.name.trim(),
          address: venueSuggestion.address.trim(),
          city: venueSuggestion.city.trim(),
          state: venueSuggestion.state.trim(),
          type: venueSuggestion.type,
          reason: venueSuggestion.reason.trim(),
        };
      }

      const response = await fetch(`${baseUrl}/events/feedback/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to submit feedback');
      }

      setShareText(`Just had an amazing night at ${eventData?.eventName} on BaeQuest! 🍸 If you're single and looking to meet people IRL, check it out → baequests.com`);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loading fullScreen message="Loading event details..." />;
  }

  if (error && !eventData) {
    return (
      <div className="event-feedback">
        <div className="event-feedback__error-container">
          <h1>❌ {error}</h1>
          <p>This feedback link may have expired or is invalid.</p>
          <button onClick={() => navigate('/')} className="event-feedback__button">
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // fallback: select textarea text
      }
    };

    const handleNativeShare = async () => {
      try {
        await navigator.share({ title: 'BaeQuest', text: shareText, url: 'https://baequests.com' });
      } catch (_) { /* user cancelled or share not supported */ }
    };

    return (
      <div className="event-feedback">
        <div className="event-feedback__success-container">
          <h1>🎉 Thank You!</h1>
          <p>Your feedback has been submitted.</p>
          <p>We appreciate you taking the time to help us improve BaeQuest!</p>

          <div className="event-feedback__share">
            <h2>Share your night ✨</h2>
            <p>Let your friends know — help us grow!</p>
            <textarea
              className="event-feedback__share-textarea"
              value={shareText}
              onChange={(e) => setShareText(e.target.value)}
              rows={4}
            />
            <div className="event-feedback__share-buttons">
              <button
                onClick={handleCopy}
                className={`event-feedback__share-btn event-feedback__share-btn--copy${copied ? ' event-feedback__share-btn--copied' : ''}`}
              >
                {copied ? '✓ Copied!' : '📋 Copy'}
              </button>
              <a
                href={twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="event-feedback__share-btn event-feedback__share-btn--twitter"
              >
                𝕏 Twitter/X
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="event-feedback__share-btn event-feedback__share-btn--whatsapp"
              >
                WhatsApp
              </a>
              {typeof navigator !== 'undefined' && navigator.share && (
                <button
                  onClick={handleNativeShare}
                  className="event-feedback__share-btn event-feedback__share-btn--native"
                >
                  ↑ Share
                </button>
              )}
            </div>
          </div>

          <button onClick={() => navigate('/')} className="event-feedback__button">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="event-feedback">
      <div className="event-feedback__container">
        <header className="event-feedback__header">
          <h1>💕 Event Feedback</h1>
          <p>Help us improve your BaeQuest experience</p>
        </header>

        <div className="event-feedback__event-info">
          <h2>📍 {eventData?.eventName}</h2>
          <p>{new Date(eventData?.eventDate).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}</p>
          <p>{eventData?.eventLocation}</p>
        </div>

        <form onSubmit={handleSubmit} className="event-feedback__form">
          {/* Rating */}
          <div className="event-feedback__section">
            <label className="event-feedback__label">
              How would you rate this event? *
            </label>
            <div className="event-feedback__stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`event-feedback__star ${
                    star <= (hoveredRating || rating) ? 'event-feedback__star--filled' : ''
                  }`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                >
                  ★
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="event-feedback__rating-text">
                {rating === 1 && '😞 Poor'}
                {rating === 2 && '😐 Fair'}
                {rating === 3 && '🙂 Good'}
                {rating === 4 && '😊 Very Good'}
                {rating === 5 && '🤩 Excellent!'}
              </p>
            )}
          </div>

          {/* Comment */}
          <div className="event-feedback__section">
            <label htmlFor="comment" className="event-feedback__label">
              Any comments? (Optional)
            </label>
            <textarea
              id="comment"
              className="event-feedback__textarea"
              placeholder="Tell us about your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={500}
              rows={4}
            />
            <p className="event-feedback__char-count">
              {comment.length}/500 characters
            </p>
          </div>

          {/* Venue Suggestion Toggle */}
          <div className="event-feedback__section">
            <button
              type="button"
              className="event-feedback__toggle-button"
              onClick={() => setShowVenueSuggestion(!showVenueSuggestion)}
            >
              {showVenueSuggestion ? '➖' : '➕'} Suggest a Great Meeting Place
            </button>
            <p className="event-feedback__hint">
              Know a venue that would be perfect for BaeQuest events? Let us know!
            </p>
          </div>

          {/* Venue Suggestion Form */}
          {showVenueSuggestion && (
            <div className="event-feedback__venue-suggestion">
              <h3>📍 Venue Suggestion</h3>

              <div className="event-feedback__input-group">
                <label htmlFor="venueName" className="event-feedback__label">
                  Venue Name *
                </label>
                <input
                  id="venueName"
                  type="text"
                  className="event-feedback__input"
                  placeholder="e.g., The Coffee House"
                  value={venueSuggestion.name}
                  onChange={(e) => setVenueSuggestion({...venueSuggestion, name: e.target.value})}
                  maxLength={100}
                />
              </div>

              <div className="event-feedback__input-group">
                <label htmlFor="venueAddress" className="event-feedback__label">
                  Address (Optional)
                </label>
                <input
                  id="venueAddress"
                  type="text"
                  className="event-feedback__input"
                  placeholder="123 Main Street"
                  value={venueSuggestion.address}
                  onChange={(e) => setVenueSuggestion({...venueSuggestion, address: e.target.value})}
                  maxLength={200}
                />
              </div>

              <div className="event-feedback__row">
                <div className="event-feedback__input-group">
                  <label htmlFor="venueCity" className="event-feedback__label">
                    City
                  </label>
                  <input
                    id="venueCity"
                    type="text"
                    className="event-feedback__input"
                    placeholder="City"
                    value={venueSuggestion.city}
                    onChange={(e) => setVenueSuggestion({...venueSuggestion, city: e.target.value})}
                    maxLength={100}
                  />
                </div>

                <div className="event-feedback__input-group">
                  <label htmlFor="venueState" className="event-feedback__label">
                    State
                  </label>
                  <input
                    id="venueState"
                    type="text"
                    className="event-feedback__input"
                    placeholder="State"
                    value={venueSuggestion.state}
                    onChange={(e) => setVenueSuggestion({...venueSuggestion, state: e.target.value})}
                    maxLength={50}
                  />
                </div>
              </div>

              <div className="event-feedback__input-group">
                <label htmlFor="venueType" className="event-feedback__label">
                  Type of Venue
                </label>
                <select
                  id="venueType"
                  className="event-feedback__select"
                  value={venueSuggestion.type}
                  onChange={(e) => setVenueSuggestion({...venueSuggestion, type: e.target.value})}
                >
                  {VENUE_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="event-feedback__input-group">
                <label htmlFor="venueReason" className="event-feedback__label">
                  Why is this venue great? (Optional)
                </label>
                <textarea
                  id="venueReason"
                  className="event-feedback__textarea"
                  placeholder="Great atmosphere, good location, affordable prices..."
                  value={venueSuggestion.reason}
                  onChange={(e) => setVenueSuggestion({...venueSuggestion, reason: e.target.value})}
                  maxLength={300}
                  rows={3}
                />
                <p className="event-feedback__char-count">
                  {venueSuggestion.reason.length}/300 characters
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="event-feedback__error">
              ⚠️ {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="event-feedback__submit"
            disabled={submitting || rating === 0}
          >
            {submitting ? 'Submitting...' : 'Submit Feedback'}
          </button>

          <p className="event-feedback__note">
            * Required field
          </p>
        </form>
      </div>
    </div>
  );
}
