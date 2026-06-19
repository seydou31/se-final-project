import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { eventManagerRegister } from '../utils/api.js';
import logo from '../assets/logo.png';

export default function EventManagerSignup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', inviteCode: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    setError('');
    setLoading(true);
    try {
      await eventManagerRegister({
        name: form.name,
        email: form.email,
        password: form.password,
        inviteCode: form.inviteCode,
      });
      setSuccess(true);
    } catch (err) {
      const message = typeof err === "string" ? err : err.message;
      setError(message || 'Failed to create account. Check your invite code.');
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    'w-full px-4 sm:px-5 py-3 sm:py-4 bg-surface-container rounded-lg text-sm sm:text-base text-on-surface transition-shadow duration-200 hover:shadow-sm';
  const labelClass =
    'block text-[10px] sm:text-xs font-bold uppercase tracking-[0.05em] text-on-surface-variant mb-1.5 sm:mb-2 ml-1';

  if (success) {
    return (
      <div className="bg-surface font-body text-on-surface flex flex-col min-h-screen">
        <main className="flex-grow flex items-center justify-center px-4 py-20">
          <div className="w-full max-w-md bg-white p-10 rounded-lg shadow-[0_20px_50px_rgba(42,52,57,0.06)] border border-outline-variant/10 text-center">
            <Link to="/"><img src={logo} alt="BaeQuest" className="w-32 mx-auto mb-6" /></Link>
            <span className="material-symbols-outlined text-5xl text-primary mb-4 block" style={{ fontVariationSettings: "'FILL' 1" }}>
              mark_email_read
            </span>
            <h1 className="text-2xl font-extrabold font-headline text-on-surface mb-3">Check your email</h1>
            <p className="text-on-surface-variant mb-6 text-sm sm:text-base">
              We sent a verification link to <strong>{form.email}</strong>.
              Click it to activate your Event Manager account.
            </p>
            <Link
              to="/event-manager/login"
              className="inline-block mt-2 px-8 py-3 bg-primary text-white font-bold rounded-full hover:bg-primary-dim active:scale-95 transition-all shadow-lg shadow-primary/20"
            >
              Back to Sign In
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col font-body">
      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 py-12 sm:py-16 md:py-20 relative overflow-hidden">

        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-[260px] sm:w-[320px] md:w-[400px] h-[260px] sm:h-[320px] md:h-[400px] bg-secondary-container opacity-20 rounded-full blur-[80px] md:blur-[100px] -mr-32 sm:-mr-40 md:-mr-48 -mt-32 sm:-mt-40 md:-mt-48 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[260px] sm:w-[320px] md:w-[400px] h-[260px] sm:h-[320px] md:h-[400px] bg-primary-container opacity-20 rounded-full blur-[80px] md:blur-[100px] -ml-32 sm:-ml-40 md:-ml-48 -mb-32 sm:-mb-40 md:-mb-48 pointer-events-none" />

        <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-[540px] z-10">
          <div className="bg-white rounded-lg p-6 sm:p-8 md:p-10 lg:p-12 shadow-[0_20px_50px_rgba(42,52,57,0.06)] border border-outline-variant/10">

            {/* Logo */}
            <div className="flex justify-center">
              <Link to="/">
                <img src={logo} alt="BaeQuest" className="w-28 sm:w-32 md:w-36 mb-5 sm:mb-6 mx-auto" />
              </Link>
            </div>

            {/* Heading */}
            <div className="text-center mb-6 sm:mb-8 md:mb-10">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-on-surface mb-2 sm:mb-3 font-headline">
                Event Manager Account
              </h1>
              <p className="text-sm sm:text-base text-on-surface-variant font-medium leading-relaxed max-w-sm mx-auto">
                Sign up to start creating events on BaeQuest
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">

              {/* Full Name */}
              <div>
                <label className={labelClass}>Full Name</label>
                <input
                  type="text" placeholder="Alex Rivera" required minLength={2} maxLength={60}
                  value={form.name} onChange={set('name')} className={inputClass}
                />
              </div>

              {/* Email */}
              <div>
                <label className={labelClass}>Email Address</label>
                <input
                  type="email" placeholder="alex@agency.com" required
                  value={form.email} onChange={set('email')} className={inputClass}
                />
              </div>

              {/* Password grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <label className={labelClass}>Password</label>
                  <input
                    type="password" placeholder="••••••••" required minLength={8}
                    value={form.password} onChange={set('password')} className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Confirm Password</label>
                  <input
                    type="password" placeholder="••••••••" required
                    value={form.confirm} onChange={set('confirm')} className={inputClass}
                  />
                </div>
              </div>

              {/* Invite Code */}
              <div>
                <div className="flex justify-between items-center mb-1.5 sm:mb-2 ml-1">
                  <label className={`${labelClass} mb-0`}>Invite Code</label>
                  <span className="text-[10px] text-primary font-bold uppercase tracking-widest">Required</span>
                </div>
                <input
                  type="text" placeholder="BQ-XXXX-XXXX" required
                  value={form.inviteCode} onChange={set('inviteCode')} className={inputClass}
                />
              </div>

              {/* Error */}
              {error && (
                <p className="text-error text-xs sm:text-sm bg-red-50 border border-red-100 px-4 py-3 rounded-lg">
                  {error}
                </p>
              )}

              {/* Submit */}
              <div className="pt-2 sm:pt-4">
                <button
                  type="submit"
                  disabled={loading || !form.name || !form.email || !form.password || !form.confirm || !form.inviteCode}
                  className="w-full py-3 sm:py-4 bg-primary text-white rounded-lg font-bold text-sm sm:text-base shadow-lg shadow-primary/20 active:scale-95 transition-all duration-200 hover:bg-primary-dim hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? 'Creating account…' : 'Create Account'}
                </button>
              </div>

            </form>

            {/* Footer */}
            <div className="mt-6 sm:mt-8 text-center">
              <p className="text-xs sm:text-sm text-on-surface-variant">
                Already have an account?{' '}
                <Link to="/event-manager/login" className="text-primary font-bold hover:underline ml-1 transition-opacity hover:opacity-80">
                  Sign in
                </Link>
              </p>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
