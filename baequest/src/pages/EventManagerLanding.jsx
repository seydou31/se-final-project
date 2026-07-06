import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const steps = [
  {
    n: "01",
    title: "Create your event",
    body: "Add the event name, date, time, and location.",
    icon: "edit_calendar",
  },
  {
    n: "02",
    title: "Post it on social media",
    body: "Share your event link and let people know where you'll be tonight.",
    icon: "share",
  },
  {
    n: "03",
    title: "Attendees check in when they arrive",
    body: "The room unlocks only when they're physically there.",
    icon: "location_on",
  },
  {
    n: "04",
    title: "People connect in real life",
    body: "More interaction, better energy, longer engagement.",
    icon: "handshake",
  },
];

const benefits = [
  {
    icon: "groups",
    title: "More attendee engagement",
    body: "Give people a reason to interact instead of standing around.",
  },
  {
    icon: "celebration",
    title: "Better event energy",
    body: "When people connect, the room feels more alive.",
  },
  {
    icon: "campaign",
    title: "Easy promotion",
    body: "We provide QR codes, flyers, and social media copy.",
  },
  {
    icon: "settings_suggest",
    title: "No extra app management",
    body: "You create the event. BaeQuest handles the social layer.",
  },
];

export default function EventManagerLanding() {
  return (
    <div className="bg-background text-on-surface font-body min-h-screen">

      {/* ── Nav ── */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-outline-variant/10 px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
        <Link to="/">
          <img src={logo} alt="BaeQuest" className="h-8" />
        </Link>
        <div className="flex items-center gap-3">
          <Link
            to="/event-manager/login"
            className="text-sm font-semibold text-on-surface-variant hover:text-on-surface transition-colors px-3 py-2"
          >
            Sign in
          </Link>
          <Link
            to="/event-manager/signup"
            className="bg-primary text-white text-sm font-bold px-5 py-2.5 rounded-lg hover:bg-primary-dim hover:-translate-y-0.5 active:scale-95 transition-all shadow-md shadow-primary/20"
          >
            Create your event
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="px-4 sm:px-6 md:px-8 py-20 sm:py-28 md:py-36 text-center max-w-4xl mx-auto">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-6">
          For Event Managers
        </span>
        <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight mb-6">
          Turn your venue into a place people{" "}
          <span className="text-primary">actually connect.</span>
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-on-surface-variant leading-relaxed max-w-2xl mx-auto mb-10">
          BaeQuest helps singles at your venue see who's there, check in,
          and start conversations in real life.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-5">
          <Link
            to="/event-manager/signup"
            className="w-full sm:w-auto bg-primary text-white font-bold text-base sm:text-lg px-8 py-4 rounded-xl shadow-xl shadow-primary/25 hover:bg-primary-dim hover:-translate-y-1 active:scale-95 transition-all duration-300"
          >
            Create Event
          </Link>
          <a
            href="#how-it-works"
            className="w-full sm:w-auto text-on-surface font-semibold text-base sm:text-lg px-8 py-4 rounded-xl border border-outline-variant/30 hover:bg-surface-container transition-all duration-200"
          >
            See how it works
          </a>
        </div>
        <p className="text-sm text-on-surface-variant">
          An invite code is required. Text us at{" "}
          <a href="sms:+12272654836" className="text-primary font-semibold hover:underline">
            (227) 265-4836
          </a>{" "}
          to get yours.
        </p>
      </section>

      {/* ── Problem ── */}
      <section className="px-4 sm:px-6 md:px-8 py-16 sm:py-20 bg-surface-container-low">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-6">
            The Problem
          </span>
          <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-6">
            People show up, but they don't always connect.
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-on-surface-variant leading-relaxed">
            Your event may have the right crowd, but attendees still stay in
            their groups, scroll on their phones, or leave without meeting
            anyone new.
          </p>
        </div>
      </section>

      {/* ── Solution ── */}
      <section className="px-4 sm:px-6 md:px-8 py-16 sm:py-20">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-6">
            The Solution
          </span>
          <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-6">
            BaeQuest adds a live social layer to your venue.
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-on-surface-variant leading-relaxed">
            Attendees check in when they arrive, see other singles who are
            there, and get a reason to start conversations.
          </p>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="px-4 sm:px-6 md:px-8 py-16 sm:py-24 bg-surface-container-low">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-6">
              How It Works
            </span>
            <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
              Four simple steps.
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {steps.map((step) => (
              <div
                key={step.n}
                className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-outline-variant/10 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-xl">{step.icon}</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1">{step.n}</p>
                    <h3 className="font-bold text-base sm:text-lg text-on-surface mb-2">{step.title}</h3>
                    <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">{step.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why ── */}
      <section className="px-4 sm:px-6 md:px-8 py-16 sm:py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-6">
              Why Event Managers Use It
            </span>
            <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
              Built for nights that matter.
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="bg-surface-container-low rounded-2xl p-6 sm:p-8 border border-outline-variant/10 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-xl">{b.icon}</span>
                </div>
                <h3 className="font-bold text-base sm:text-lg text-on-surface mb-2">{b.title}</h3>
                <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="px-4 sm:px-6 md:px-8 py-16 sm:py-20 bg-surface-container-low">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-6">
            Pricing & Revenue
          </span>
          <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-6">
            Simple check-in fee — and you earn from it.
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-on-surface-variant leading-relaxed mb-8">
            Attendees pay a check-in fee to unlock the room when they arrive.
            The fee starts at <strong className="text-on-surface">$3</strong>, and you can set it higher for your event.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            <div className="bg-white rounded-2xl p-6 border border-outline-variant/10 shadow-sm">
              <p className="text-3xl font-black text-primary mb-1">$3+</p>
              <p className="text-sm font-bold text-on-surface mb-1">Starting check-in fee</p>
              <p className="text-xs text-on-surface-variant">You set the price. Higher-ticket events can charge more.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-outline-variant/10 shadow-sm">
              <p className="text-3xl font-black text-primary mb-1">30%</p>
              <p className="text-sm font-bold text-on-surface mb-1">Your revenue share</p>
              <p className="text-xs text-on-surface-variant">You earn 30% of every check-in fee collected at your event.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="px-4 sm:px-6 md:px-8 py-20 sm:py-28">
        <div className="max-w-3xl mx-auto bg-primary rounded-3xl p-10 sm:p-14 md:p-20 text-center text-white">
          <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4">
            Create your first BaeQuest event.
          </h2>
          <p className="text-base sm:text-lg md:text-xl opacity-80 mb-8 sm:mb-10 leading-relaxed">
            Make your event easier to attend, easier to connect at, and
            harder to forget.
          </p>
          <a
            href="sms:+12272654836"
            className="inline-block bg-white text-primary font-bold text-base sm:text-lg px-10 py-4 rounded-xl hover:bg-gray-50 hover:-translate-y-1 active:scale-95 transition-all duration-300 shadow-xl mb-4"
          >
            Get your invite code
          </a>
          <p className="text-sm opacity-70">
            Text us at{" "}
            <a href="sms:+12272654836" className="font-semibold underline underline-offset-2">
              (227) 265-4836
            </a>{" "}
            and we'll send you an invite code to get started.
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="px-4 sm:px-8 py-6 border-t border-outline-variant/10 text-center">
        <p className="text-xs text-on-surface-variant">© {new Date().getFullYear()} BaeQuest</p>
      </footer>

    </div>
  );
}
