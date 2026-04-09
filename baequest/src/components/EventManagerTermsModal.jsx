import { useState } from 'react';

export default function EventManagerTermsModal({ onAccept }) {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="em-terms-overlay">
      <div className="em-terms-modal">
        <div className="em-terms-modal__header">
          <h2 className="em-terms-modal__title">Welcome to BaeQuest</h2>
          <p className="em-terms-modal__subtitle">Before you access your dashboard, please read and accept the following.</p>
        </div>

        <div className="em-terms-modal__body">
          <section className="em-terms-section">
            <h3 className="em-terms-section__title">What is BaeQuest?</h3>
            <p>BaeQuest is a social app that helps singles meet in real life at curated events. As an event manager, you create and host singles events listed on our platform. Attendees browse nearby events, RSVP, and check in when they physically arrive to see who else is there.</p>
          </section>

          <section className="em-terms-section">
            <h3 className="em-terms-section__title">How It Works</h3>
            <ul className="em-terms-list">
              <li>Create events through your dashboard — provide the venue, date, time, and description.</li>
              <li>BaeQuest lists your event to singles in the area.</li>
              <li>Attendees pay at check-in when they physically arrive at the event.</li>
              <li>Connect your Stripe account to receive payouts directly to your bank.</li>
              <li>Payouts are processed by Stripe and typically arrive within 2–7 business days.</li>
            </ul>
          </section>

          <section className="em-terms-section">
            <h3 className="em-terms-section__title">Payment Split</h3>
            <p>For every ticket sold at your event:</p>
            <ul className="em-terms-list">
              <li><strong>70%</strong> goes to BaeQuest (platform fee)</li>
              <li><strong>30%</strong> goes to you (the event manager)</li>
            </ul>
            <p>The split is applied automatically at checkout. You set the ticket price and your 30% is calculated from that amount before Stripe fees.</p>
          </section>

          <section className="em-terms-section">
            <h3 className="em-terms-section__title">Code of Conduct</h3>
            <ul className="em-terms-list">
              <li>Events must be safe, inclusive, and welcoming to all singles regardless of background.</li>
              <li>No discrimination based on race, gender, sexual orientation, religion, or disability.</li>
              <li>You are responsible for maintaining a respectful environment at your events.</li>
              <li>Misleading event descriptions, fake venues, or fraudulent ticket sales will result in immediate account termination.</li>
              <li>BaeQuest reserves the right to remove any event or account that violates these standards.</li>
            </ul>
          </section>
        </div>

        <div className="em-terms-modal__footer">
          <label className="em-terms-checkbox">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <span>I have read and agree to the terms above, including the 70/30 payment split and code of conduct.</span>
          </label>
          <button
            className="em-btn em-btn--primary em-terms-modal__cta"
            disabled={!agreed}
            onClick={onAccept}
          >
            I Agree — Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
