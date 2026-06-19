import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

export default function EventManagerTermsModal({ onAccept }) {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-body">

      {/* ── Blurred dashboard mockup backdrop ── */}
      <div className="absolute inset-0 z-0 flex blur-md saturate-50 opacity-40 pointer-events-none select-none">
        <aside className="w-64 bg-surface-container-low h-screen flex flex-col py-6 px-4 space-y-4 shrink-0">
          <div className="h-10 w-32 bg-surface-variant rounded-md mb-8" />
          <div className="space-y-2">
            <div className="h-12 w-full bg-white rounded-full" />
            <div className="h-12 w-full rounded-full" />
            <div className="h-12 w-full rounded-full" />
            <div className="h-12 w-full rounded-full" />
          </div>
        </aside>
        <main className="flex-1 p-8 space-y-8 overflow-hidden">
          <header className="flex justify-between items-center">
            <div className="h-8 w-48 bg-surface-variant rounded-md" />
            <div className="h-10 w-10 bg-surface-variant rounded-full" />
          </header>
          <div className="grid grid-cols-3 gap-6">
            <div className="h-64 bg-white rounded-lg" />
            <div className="h-64 bg-white rounded-lg" />
            <div className="h-64 bg-white rounded-lg" />
          </div>
          <div className="h-96 bg-white rounded-lg w-full" />
        </main>
      </div>

      {/* ── Overlay ── */}
      <div className="absolute inset-0 z-10 bg-inverse-surface/10 backdrop-blur-sm flex items-center justify-center p-4">

        {/* Modal — fixed max height with internal scroll */}
        <div className="bg-white w-full max-w-md sm:max-w-lg md:max-w-2xl rounded-lg shadow-[0_20px_50px_rgba(42,52,57,0.10)] overflow-hidden flex flex-col relative max-h-[92vh]">

          {/* Decorative blobs */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl pointer-events-none z-0" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-secondary/5 rounded-full blur-3xl pointer-events-none z-0" />

          {/* ── Sticky header ── */}
          <div className="relative z-10 px-5 sm:px-8 md:px-10 lg:px-12 pt-6 sm:pt-8 pb-4 border-b border-outline-variant/10 shrink-0">
            <div className="flex justify-center mb-4 sm:mb-5">
              <img src={logo} alt="BaeQuest" className="w-28 sm:w-32 md:w-36" />
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight leading-tight font-headline">
              Welcome to BaeQuest
            </h1>
            <p className="mt-2 text-sm sm:text-base text-on-surface-variant leading-relaxed">
              Before you access your dashboard, please read and accept the following terms.
            </p>
          </div>

          {/* ── Scrollable body ── */}
          <div
            className="relative z-10 flex-1 overflow-y-auto px-5 sm:px-8 md:px-10 lg:px-12 py-5 sm:py-6 space-y-6 sm:space-y-7"
            style={{ scrollbarWidth: "thin", scrollbarColor: "#dae4eb transparent" }}
          >

            {/* How It Works */}
            <section>
              <h2 className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-primary mb-3 sm:mb-4">
                How It Works
              </h2>
              <ul className="space-y-3 sm:space-y-4">
                {[
                  { icon: "add_circle",    bg: "bg-primary-container/30",   text: "text-primary",            label: "Create events with unique descriptions, dates, and attendance caps." },
                  { icon: "verified_user", bg: "bg-secondary-container/30", text: "text-secondary",          label: "BaeQuest lists your event to a verified community of high-intent singles." },
                  { icon: "analytics",     bg: "bg-surface-variant",        text: "text-on-surface-variant", label: "Track RSVPs, manage guest lists, and analyze engagement in real-time." },
                ].map(({ icon, bg, text, label }) => (
                  <li key={icon} className="flex items-start gap-3 sm:gap-4">
                    <div className={`mt-0.5 shrink-0 ${bg} ${text} p-1.5 rounded-sm`}>
                      <span className="material-symbols-outlined text-base sm:text-lg block">{icon}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-on-surface-variant font-medium leading-relaxed">{label}</p>
                  </li>
                ))}
              </ul>
            </section>

            {/* What is BaeQuest */}
            <section>
              <h2 className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-primary mb-3">
                What is BaeQuest?
              </h2>
              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                BaeQuest is a social app that helps singles meet in real life at curated events. As an event manager, you create and host singles events listed on our platform. Attendees browse nearby events, RSVP, and check in when they physically arrive to see who else is there.
              </p>
            </section>

            {/* How Attendees Use It */}
            <section>
              <h2 className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-primary mb-3">
                Attendee Flow
              </h2>
              <ul className="space-y-2">
                {[
                  "Create events through your dashboard — provide the venue, date, time, and description.",
                  "BaeQuest lists your event to singles in the area.",
                  "Attendees pay at check-in when they physically arrive at the event.",
                  "Connect your Stripe account to receive payouts directly to your bank.",
                  "Payouts are processed by Stripe and typically arrive within 2–7 business days.",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="shrink-0 w-5 h-5 mt-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">{item}</p>
                  </li>
                ))}
              </ul>
            </section>

            {/* Payment Split */}
            <section>
              <h2 className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-primary mb-3">
                Payment Split
              </h2>
              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed mb-3">
                For every ticket sold at your event:
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-surface-container-low rounded-lg p-4 text-center">
                  <p className="text-2xl font-black text-on-surface-variant">70%</p>
                  <p className="text-xs text-on-surface-variant mt-1">BaeQuest platform fee</p>
                </div>
                <div className="bg-primary/5 rounded-lg p-4 text-center ring-1 ring-primary/20">
                  <p className="text-2xl font-black text-primary">30%</p>
                  <p className="text-xs text-on-surface-variant mt-1">You (event manager)</p>
                </div>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed mt-3">
                The split is applied automatically at checkout. You set the ticket price and your 30% is calculated from that amount before Stripe fees.
              </p>
            </section>

            {/* Code of Conduct */}
            <section>
              <h2 className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-primary mb-3">
                Code of Conduct
              </h2>
              <ul className="space-y-2">
                {[
                  "Events must be safe, inclusive, and welcoming to all singles regardless of background.",
                  "No discrimination based on race, gender, sexual orientation, religion, or disability.",
                  "You are responsible for maintaining a respectful environment at your events.",
                  "Misleading event descriptions, fake venues, or fraudulent ticket sales will result in immediate account termination.",
                  "BaeQuest reserves the right to remove any event or account that violates these standards.",
                ].map((rule, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-sm text-primary shrink-0 mt-0.5">check_circle</span>
                    <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">{rule}</p>
                  </li>
                ))}
              </ul>
            </section>

          </div>

          {/* ── Sticky footer ── */}
          <div className="relative z-10 px-5 sm:px-8 md:px-10 lg:px-12 py-4 sm:py-5 border-t border-outline-variant/10 bg-white shrink-0 space-y-4">

            {/* Checkbox */}
            <label className="group flex items-start gap-3 cursor-pointer">
              <div className="relative flex items-center mt-0.5 shrink-0">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={e => setAgreed(e.target.checked)}
                  className="peer h-4 w-4 sm:h-5 sm:w-5 rounded-sm border-2 border-outline-variant appearance-none checked:bg-primary checked:border-primary transition-all cursor-pointer focus:ring-2 focus:ring-primary/20"
                />
                <span
                  className="material-symbols-outlined absolute text-white text-[10px] sm:text-xs opacity-0 peer-checked:opacity-100 pointer-events-none left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                  style={{ fontVariationSettings: "'FILL' 1, 'wght' 700" }}
                >
                  check
                </span>
              </div>
              <span className="text-[10px] sm:text-xs text-on-surface-variant leading-relaxed">
                I have read and agree to the terms above, including the 70/30 payment split and code of conduct, the{" "}
                <Link to="/terms" target="_blank" className="text-primary font-bold hover:underline">Terms of Service</Link>
                {" "}and{" "}
                <Link to="/privacy" target="_blank" className="text-primary font-bold hover:underline">Privacy Policy</Link>.
              </span>
            </label>

            {/* CTA */}
            <button
              onClick={onAccept}
              disabled={!agreed}
              className="w-full bg-primary text-white py-3 sm:py-4 px-6 sm:px-8 rounded-lg font-bold text-sm sm:text-base shadow-lg shadow-primary/20 active:scale-[0.98] hover:bg-primary-dim hover:-translate-y-0.5 transition-all duration-200 flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              I Agree — Go to Dashboard
              <span className="material-symbols-outlined text-base sm:text-lg">arrow_forward</span>
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}
