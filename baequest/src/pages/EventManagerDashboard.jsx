import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  eventManagerGetDashboard,
  eventManagerGetDashboardStats,
  eventManagerGetEvents,
  eventManagerGetOnboardingLink,
} from "../utils/api.js";
import EventManagerTermsModal from "../components/EventManagerTermsModal.jsx";
import EMSidebar from "../components/EMSidebar.jsx";
import EMTopBar from "../components/EMTopBar.jsx";
import { useEventManagerAuth } from "../hooks/useEventManagerAuth";
import getImageUrl from "../utils/getImageUrl.js";

const TERMS_KEY = "em_terms_accepted";
const PAGE_LIMIT = 10;

function formatDate(d) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function EventManagerDashboard() {
  const { me, loading } = useEventManagerAuth();
  const [stats, setStats]           = useState(null);
  //const [me, setMe]                 = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const [events, setEvents]         = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: PAGE_LIMIT, total: 0, totalPages: 1 });
  const [eventsLoading, setEventsLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch]         = useState("");
  const [page, setPage]             = useState(1);

  const [stripeErr, setStripeErr]   = useState("");
  const [showTerms, setShowTerms]   = useState(() => !localStorage.getItem(TERMS_KEY));
  const navigate = useNavigate();

  useEffect(() => {
  // wait until auth loading finishes
  if (loading) return;

  // not logged in
  if (!me) {
    navigate("/event-manager/login");
    return;
  }

  Promise.all([
    eventManagerGetDashboardStats().catch(() =>
      eventManagerGetDashboard()
    ),
  ])
    .then(([dashData]) => {
      setStats(dashData);
    })
    .catch((err) => {
      console.error("Dashboard API error:", err);

      // only redirect on unauthorized
      if (
        err?.status === 401 ||
        err?.response?.status === 401
      ) {
        navigate("/event-manager/login");
      }
    })
    .finally(() => {
      setStatsLoading(false);
    });
}, [loading, me, navigate]);

  // Load paginated events whenever page or search changes
  const loadEvents = useCallback(() => {
    setEventsLoading(true);
    eventManagerGetEvents({ page, limit: PAGE_LIMIT, search })
      .then(res => {
        const arr = res.data ?? res.events ?? (Array.isArray(res) ? res : []);
        setEvents(arr);
        if (res.pagination) {
          setPagination(res.pagination);
        } else {
          setPagination({ page, limit: PAGE_LIMIT, total: arr.length, totalPages: 1 });
        }
      })
      .catch(() => setEvents([]))
      .finally(() => setEventsLoading(false));
  }, [page, search]);

  useEffect(() => { loadEvents(); }, [loadEvents]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => { setPage(1); setSearch(searchInput); }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  async function handleConnectStripe() {
    setStripeErr("");
    try {
      const res = await eventManagerGetOnboardingLink();
      window.location.href = res.url;
    } catch {
      setStripeErr("Could not start Stripe onboarding. Please try again.");
    }
  }

  function handleAcceptTerms() {
    localStorage.setItem(TERMS_KEY, "true");
    setShowTerms(false);
  }

  const statCards = [
    { icon: "calendar_today",      iconColor: "text-primary",            badge: "THIS MONTH", value: stats?.totalEvents ?? stats?.events?.length ?? 0, label: "Total Events"       },
    { icon: "person_check",        iconColor: "text-secondary",          badge: "ALL TIME",   value: stats?.totalCheckins ?? 0,                         label: "Total Check-ins"   },
    { icon: "payments",            iconColor: "text-tertiary",           badge: "ESTIMATED",  value: `$${stats?.totalEarnings ?? 0}`,                   label: "Projected Earnings"},
    { icon: "confirmation_number", iconColor: "text-on-surface-variant", badge: "ALL TIME",   value: stats?.totalPaidCheckins ?? 0,                     label: "Paid Check-ins"    },
  ];

  return (
    <div className="bg-background text-on-surface min-h-screen flex overflow-hidden font-body">
      {showTerms && <EventManagerTermsModal onAccept={handleAcceptTerms} />}

      <EMSidebar me={me} />

      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <EMTopBar title="Dashboard" me={me} />

        <div className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto w-full">
           { (statsLoading) ? (
                 
                  <div className="min-h-screen bg-background flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                      <p className="text-sm text-on-surface-variant">Loading dashboard…</p>
                    </div>
                  </div>
                
              ) : null }

          {/* Stripe banner */}
          {me && !me.stripeOnboardingComplete && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-amber-600 mt-0.5 shrink-0">account_balance</span>
                <p className="text-sm text-amber-800 font-medium">Connect your bank account to receive payouts when charging is enabled.</p>
              </div>
              <button onClick={handleConnectStripe} className="shrink-0 bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-md hover:bg-primary-dim hover:-translate-y-0.5 active:scale-95 transition-all whitespace-nowrap">
                Connect Bank Account
              </button>
            </div>
          )}
          {stripeErr && <p className="text-error text-sm bg-red-50 px-4 py-3 rounded-lg border border-red-100">{stripeErr}</p>}

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {statCards.map(({ icon, iconColor, badge, value, label }) => (
              <div key={label} className="group bg-white p-4 sm:p-5 md:p-6 rounded-lg shadow-[0_20px_50px_rgba(42,52,57,0.06)] hover:shadow-[0_20px_50px_rgba(42,52,57,0.10)] hover:-translate-y-1 transition-all duration-300 cursor-default">
                <div className="flex justify-between mb-3 sm:mb-4">
                  <span className={`material-symbols-outlined ${iconColor} group-hover:scale-110 transition-transform duration-200`}>{icon}</span>
                  <span className="text-[10px] sm:text-xs font-bold text-on-surface-variant">{badge}</span>
                </div>
                <div className="text-xl sm:text-2xl md:text-3xl font-black">{value}</div>
                <div className="text-xs sm:text-sm text-on-surface-variant mt-1">{label}</div>
              </div>
            ))}
          </div>

          {/* Events table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-outline-variant/10">
              <div className="flex items-center gap-3">
                <h2 className="text-base font-bold text-on-surface">Recent Events</h2>
                <a
                  href="/baequest-flyer.pdf"
                  download="BaeQuest Promo Flyer.pdf"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary border border-primary/30 px-3 py-1.5 rounded-full hover:bg-primary/5 transition-colors"
                >
                  <span className="material-symbols-outlined text-[14px]">download</span>
                  Get Promo Flyer
                </a>
              </div>
              <div className="relative w-full sm:w-64">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-base pointer-events-none">search</span>
                <input
                  type="text"
                  placeholder="Search events…"
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-surface-container rounded-lg border border-transparent focus:border-primary/40 focus:outline-none transition"
                />
              </div>
            </div>

            {eventsLoading ? (
              <div className="py-16 flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-on-surface-variant">Loading events…</p>
              </div>
            ) : events.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center px-6">
                <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-2xl text-outline-variant">event_busy</span>
                </div>
                <h3 className="text-base font-bold mb-2">{search ? `No events matching "${search}"` : "No events yet"}</h3>
                <p className="text-xs sm:text-sm text-on-surface-variant max-w-xs mb-6">{search ? "Try a different search term." : "Create your first event to get started."}</p>
                {!search && (
                  <button onClick={() => navigate("/event-manager/create-event")} className="bg-primary text-white py-2.5 px-6 rounded-full text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary-dim hover:-translate-y-0.5 active:scale-95 transition-all">
                    Create My First Event
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-outline-variant/20 text-on-surface-variant text-xs uppercase tracking-wider">
                        {["Image", "Event", "Date", "Check-ins", "Your Earnings (30%)"].map(h => (
                          <th key={h} className="text-left px-5 py-3.5 font-bold">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {events.map(ev => (
                        <tr key={ev._id} className="border-b border-outline-variant/10 hover:bg-surface-container-low transition-colors duration-150">
                          <td className="px-5 py-4">
                            <img src={getImageUrl(ev.photo ?? ev.image)} alt={ev.name} className="w-10 h-10 rounded-full object-cover" />
                          </td>
                          <td className="px-5 py-4 font-medium">{ev.name}</td>
                          <td className="px-5 py-4 text-on-surface-variant">{formatDate(ev.startTime)}</td>
                          <td className="px-5 py-4">{ev.checkinCount ?? 0}</td>
                          <td className="px-5 py-4 font-semibold text-primary">${ev.earnings ?? 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-5 py-4 border-t border-outline-variant/10">
                  <span className="text-xs text-on-surface-variant order-2 sm:order-1">
                    {pagination.total > 0
                      ? `Showing ${((pagination.page - 1) * pagination.limit) + 1}–${Math.min(pagination.page * pagination.limit, pagination.total)} of ${pagination.total} events`
                      : "No events"
                    }
                  </span>
                  <div className="flex items-center gap-1 order-1 sm:order-2">
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={pagination.page <= 1}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-container disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                      ← Prev
                    </button>
                    <span className="px-3 py-1.5 text-xs font-semibold">{pagination.page} / {pagination.totalPages}</span>
                    <button onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))} disabled={pagination.page >= pagination.totalPages}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-container disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                      Next →
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <footer className="mt-auto px-4 sm:px-6 md:px-8 py-4 sm:py-6 border-t text-center">
          <p className="text-xs text-on-surface-variant">© {new Date().getFullYear()} BaeQuest</p>
        </footer>
      </main>

      {/* Mobile FAB */}
      <div className="md:hidden fixed bottom-5 right-5 z-30">
        <button onClick={() => navigate("/event-manager/create-event")}
          className="w-12 h-12 sm:w-14 sm:h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-xl shadow-primary/30 hover:bg-primary-dim hover:scale-110 active:scale-95 transition-all duration-200">
          <span className="material-symbols-outlined">add</span>
        </button>
      </div>
    </div>
  );
}
