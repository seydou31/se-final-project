import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { eventManagerLogin, logout } from '../utils/api.js';
import { useEventManagerAuth } from '../hooks/useEventManagerAuth';
import AppContext from '../context/AppContext.js';
import { useContext } from 'react';
import logo from '../assets/logo.png';
import toast from 'react-hot-toast';

export default function EventManagerLogin() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();
  const { refreshMe } = useEventManagerAuth();
  const { isLoggedIn } = useContext(AppContext);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // If a regular user session is active, log it out first —
      // the EM login will overwrite the shared jwt cookie server-side anyway.
      if (isLoggedIn) {
        try { await logout(); } catch (err) {
          console.error(err);
        }
        localStorage.removeItem('tokenExists');
      }
      const res = await eventManagerLogin({ email, password });
      // Sync the auth context so RequireEventManagerAuth sees the new session
      await refreshMe();
      toast.success("Signed in as Event Manager!");
      if (!res.stripeOnboardingComplete) navigate('/event-manager/onboarding');
      else navigate('/event-manager/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-surface font-body text-on-surface flex flex-col min-h-screen">
      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 py-12 sm:py-16 md:py-20 relative overflow-hidden">

        {/* Background blobs */}
        <div className="absolute top-[-10%] left-[-5%] w-[250px] sm:w-[320px] md:w-[400px] h-[250px] sm:h-[320px] md:h-[400px] bg-primary/5 rounded-full blur-[80px] md:blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[250px] sm:w-[320px] md:w-[400px] h-[250px] sm:h-[320px] md:h-[400px] bg-secondary/5 rounded-full blur-[80px] md:blur-[100px] pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          <div className="bg-white p-6 sm:p-8 md:p-10 lg:p-12 rounded-lg shadow-[0_20px_50px_rgba(42,52,57,0.06)] border border-outline-variant/10">

            {/* Logo */}
            <div className="flex justify-center">
              <Link to="/">
                <img src={logo} alt="BaeQuest" className="w-28 sm:w-32 md:w-36 mb-5 sm:mb-6 mx-auto" />
              </Link>
            </div>

            {/* Heading */}
            <div className="mb-6 sm:mb-8 md:mb-10 text-center">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-on-surface font-headline mb-2 sm:mb-3 leading-tight">
                Welcome back, Event Manager
              </h1>
              <p className="text-sm sm:text-base text-on-surface-variant font-medium">
                Access your editorial event suite.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">

              {/* Email */}
              <div>
                <label className="block text-[10px] sm:text-xs font-bold uppercase tracking-[0.05em] text-on-surface-variant mb-1.5 sm:mb-2 ml-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="curator@eventmanager.com"
                  required
                  className="w-full bg-surface-container rounded-lg px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-base text-on-surface transition-shadow duration-200 hover:shadow-sm"
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-1.5 sm:mb-2 px-1">
                  <label className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.05em] text-on-surface-variant">
                    Password
                  </label>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full bg-surface-container rounded-lg px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-base text-on-surface transition-shadow duration-200 hover:shadow-sm"
                />
              </div>

              {/* Error */}
              {error && (
                <p className="text-error text-xs sm:text-sm bg-red-50 border border-red-100 px-4 py-3 rounded-lg">
                  {error}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || !email || !password}
                className="w-full py-3 sm:py-4 px-6 sm:px-8 bg-primary text-white font-bold rounded-lg text-sm sm:text-base active:scale-95 transition-all duration-200 shadow-lg shadow-primary/20 hover:bg-primary-dim hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>

            {/* Footer */}
            <p className="mt-6 sm:mt-8 md:mt-10 text-center text-xs sm:text-sm text-on-surface-variant">
              Don&apos;t have an account yet?{' '}
              <Link to="/event-manager/signup" className="text-primary font-bold hover:underline ml-1 transition-opacity hover:opacity-80">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
