import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { eventManagerGetOnboardingLink, eventManagerVerifyOnboarding } from '../utils/api.js';
import '../blocks/event-manager.css';

export default function EventManagerOnboarding() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('idle'); // idle | verifying | complete | error
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const isSuccess = searchParams.get('success') === 'true';
  const isRefresh = searchParams.get('refresh') === 'true';

  useEffect(() => {
    if (isSuccess) {
      setStatus('verifying');
      eventManagerVerifyOnboarding()
        .then((res) => {
          if (res.onboardingComplete) {
            setStatus('complete');
            setTimeout(() => navigate('/event-manager/dashboard'), 2000);
          } else {
            setError('Onboarding is not fully complete. Please finish all required steps.');
            setStatus('error');
          }
        })
        .catch(() => {
          setError('Could not verify onboarding. Please try again.');
          setStatus('error');
        });
    }
  }, [isSuccess, navigate]);

  async function handleStart() {
    setError('');
    try {
      const res = await eventManagerGetOnboardingLink();
      window.location.href = res.url;
    } catch {
      setError('Could not start onboarding. Please try again.');
    }
  }

  if (status === 'verifying') {
    return (
      <div className="em-page">
        <div className="em-card em-onboarding">
          <div className="em-onboarding__icon">⏳</div>
          <h1 className="em-card__title">Verifying your account...</h1>
        </div>
      </div>
    );
  }

  if (status === 'complete') {
    return (
      <div className="em-page">
        <div className="em-card em-onboarding">
          <div className="em-onboarding__icon">✅</div>
          <h1 className="em-card__title">You&apos;re all set!</h1>
          <p className="em-card__subtitle">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="em-page">
      <div className="em-card em-onboarding">
        <div className="em-onboarding__icon">🏦</div>
        <h1 className="em-card__title">Connect Your Bank Account</h1>
        <p className="em-card__subtitle">
          To receive your 30% of check-in proceeds, connect your bank account via Stripe.
          Your banking information is handled securely by Stripe — we never store it.
        </p>
        {error && <p className="em-error">{error}</p>}
        <button className="em-btn em-btn--primary" onClick={handleStart}>
          {isRefresh ? 'Continue Onboarding' : 'Connect Bank Account'}
        </button>
        <button
          className="em-btn em-btn--secondary"
          onClick={() => navigate('/event-manager/dashboard')}
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
