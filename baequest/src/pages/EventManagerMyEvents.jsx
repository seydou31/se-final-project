import { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  eventManagerGetMe,
  eventManagerGetEvents,
} from "../utils/api.js";
import EMSidebar from "../components/EMSidebar.jsx";
import EMTopBar from "../components/EMTopBar.jsx";
import { useEventManagerAuth } from "../context/EventManagerAuthContext";
import getImageUrl from "../utils/getImageUrl.js";

const PAGE_LIMIT = 10;

function formatDateTime(d) {
  if (!d) return "—";
  return new Date(d).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function StatusBadge({ status }) {
  const map = {
    active:    { label: "Active",    cls: "bg-green-100 text-green-700"  },
    upcoming:  { label: "Upcoming",  cls: "bg-blue-100 text-blue-700"    },
    past:      { label: "Past",      cls: "bg-surface-container text-on-surface-variant" },
    cancelled: { label: "Cancelled", cls: "bg-red-100 text-red-600"      },
    draft:     { label: "Draft",     cls: "bg-amber-100 text-amber-700"  },
  };
  const s = status?.toLowerCase() ?? "upcoming";
  const { label, cls } = map[s] ?? { label: status ?? "Unknown", cls: "bg-surface-container text-on-surface-variant" };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
      {label}
    </span>
  );
}

// Derive status from event dates if not explicitly set
function deriveStatus(ev) {
  if (ev.status) return ev.status;
  const now = Date.now();
  const start = new Date(ev.startTime).getTime();
  const end   = new Date(ev.endTime ?? ev.startTime).getTime();
  if (now < start) return "upcoming";
  if (now >= start && now <= end) return "active";
  return "past";
}

export default function EventManagerMyEvents() {
  const { me, loading } = useEventManagerAuth();
  const [events, setEvents]         = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: PAGE_LIMIT, total: 0, totalPages: 1 });
  const [eventsLoading, setEventsLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch]         = useState("");
  const [page, setPage]             = useState(1);
  const navigate = useNavigate();

  // Events
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

  return (
    <div className="bg-background text-on-surface min-h-screen flex overflow-hidden font-body">
      <EMSidebar me={me} />

      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <EMTopBar title="My Events" me={me} />

        <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6">

          {/* Page heading + CTA */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              {/* <h1 className="text-xl sm:text-2xl font-black tracking-tight text-on-surface font-headline">My Events</h1> */}
              <p className="text-sm text-on-surface-variant mt-0.5">Manage all your curated events</p>
            </div>
            <Link
              to="/event-manager/create-event"
              className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-md hover:bg-primary-dim hover:-translate-y-0.5 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-base">add</span>
              New Event
            </Link>
          </div>

          {/* Table card */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              { (loading) ? (
                 
                  <div className="min-h-screen bg-background flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                      <p className="text-sm text-on-surface-variant">Loading events…</p>
                    </div>
                  </div>
                
              ) : null }

            {/* Search bar */}
            <div className="px-5 py-4 border-b border-outline-variant/10">
              <div className="relative w-full sm:w-72">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-base pointer-events-none">search</span>
                <input
                  type="text"
                  placeholder="Search by event name…"
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm bg-surface-container rounded-lg border border-transparent focus:border-primary/40 focus:outline-none transition"
                />
                {searchInput && (
                  <button onClick={() => setSearchInput("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition">
                    <span className="material-symbols-outlined text-base">close</span>
                  </button>
                )}
              </div>
            </div>

            {/* ── DESKTOP TABLE ── */}
            <div className="hidden md:block overflow-x-auto">
              {eventsLoading ? (
                <LoadingSkeleton cols={7} />
              ) : events.length === 0 ? (
                <EmptyState search={search} navigate={navigate} />
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-outline-variant/20 text-on-surface-variant text-xs uppercase tracking-wider bg-surface-container-low">
                      <th className="text-left px-5 py-3.5 font-bold w-16">Image</th>
                      <th className="text-left px-5 py-3.5 font-bold">Event Name</th>
                      <th className="text-left px-5 py-3.5 font-bold">Date & Time</th>
                      <th className="text-left px-5 py-3.5 font-bold">Location</th>
                      <th className="text-left px-5 py-3.5 font-bold">Status</th>
                      <th className="text-left px-5 py-3.5 font-bold">Check-ins</th>
                      <th className="text-left px-5 py-3.5 font-bold">Earnings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map(ev => (
                      <tr key={ev._id} className="border-b border-outline-variant/10 hover:bg-surface-container-low transition-colors duration-150 group">
                        {/* Image */}
                        <td className="px-5 py-3.5">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-surface-container shrink-0">
                            {ev.photo || ev.image ? (
                              <img
                                src={getImageUrl(ev.photo ?? ev.image)}
                                alt={ev.name}
                                className="w-full h-full object-cover"
                                onError={e => { e.currentTarget.style.display = "none"; }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="material-symbols-outlined text-xl text-outline-variant">image</span>
                              </div>
                            )}
                          </div>
                        </td>
                        {/* Name */}
                        <td className="px-5 py-3.5">
                          <span className="font-semibold text-on-surface group-hover:text-primary transition-colors line-clamp-2 max-w-[200px]">
                            {ev.name}
                          </span>
                        </td>
                        {/* Date */}
                        <td className="px-5 py-3.5 text-on-surface-variant whitespace-nowrap">
                          <div>{formatDateTime(ev.startTime)}</div>
                          {ev.endTime && (
                            <div className="text-xs text-outline mt-0.5">to {formatDateTime(ev.endTime)}</div>
                          )}
                        </td>
                        {/* Location */}
                        <td className="px-5 py-3.5 text-on-surface-variant max-w-[180px]">
                          <span className="line-clamp-2">
                            {[ev.address, ev.city, ev.state].filter(Boolean).join(", ") || "—"}
                          </span>
                        </td>
                        {/* Status */}
                        <td className="px-5 py-3.5">
                          <StatusBadge status={deriveStatus(ev)} />
                        </td>
                        {/* Check-ins */}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-1.5 text-on-surface-variant">
                            <span className="material-symbols-outlined text-base">person_check</span>
                            <span className="font-medium">{ev.checkinCount ?? 0}</span>
                          </div>
                        </td>
                        {/* Earnings */}
                        <td className="px-5 py-3.5 font-bold text-primary">
                          ${(ev.earnings ?? 0).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* ── MOBILE CARDS ── */}
            <div className="md:hidden">
              {eventsLoading ? (
                <div className="p-4 space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="rounded-lg bg-surface-container-low animate-pulse h-24" />
                  ))}
                </div>
              ) : events.length === 0 ? (
                <EmptyState search={search} navigate={navigate} />
              ) : (
                <div className="divide-y divide-outline-variant/10">
                  {events.map(ev => (
                    <div key={ev._id} className="flex gap-3 px-4 py-4 hover:bg-surface-container-low transition-colors">
                      {/* Thumbnail */}
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-surface-container shrink-0">
                        {ev.photo || ev.image ? (
                          <img
                            src={getImageUrl(ev.photo ?? ev.image)}
                            alt={ev.name}
                            className="w-full h-full object-cover"
                            onError={e => { e.currentTarget.style.display = "none"; }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-xl text-outline-variant">image</span>
                          </div>
                        )}
                      </div>
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className="font-semibold text-sm text-on-surface line-clamp-1">{ev.name}</p>
                          <StatusBadge status={deriveStatus(ev)} />
                        </div>
                        <p className="text-xs text-on-surface-variant mb-1">{formatDateTime(ev.startTime)}</p>
                        <p className="text-xs text-on-surface-variant line-clamp-1 mb-2">
                          {[ev.address, ev.city, ev.state].filter(Boolean).join(", ") || "No location"}
                        </p>
                        <div className="flex items-center gap-3 text-xs">
                          <span className="flex items-center gap-1 text-on-surface-variant">
                            <span className="material-symbols-outlined text-sm">person_check</span>
                            {ev.checkinCount ?? 0} check-ins
                          </span>
                          <span className="font-bold text-primary">${(ev.earnings ?? 0).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pagination */}
            {!eventsLoading && events.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-5 py-4 border-t border-outline-variant/10">
                <span className="text-xs text-on-surface-variant order-2 sm:order-1">
                  {pagination.total > 0
                    ? `Showing ${((pagination.page - 1) * pagination.limit) + 1}–${Math.min(pagination.page * pagination.limit, pagination.total)} of ${pagination.total} events`
                    : "—"
                  }
                </span>
                <div className="flex items-center gap-1 order-1 sm:order-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={pagination.page <= 1}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-container disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    ← Prev
                  </button>
                  <span className="px-3 py-1.5 text-xs font-semibold">
                    {pagination.page} / {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                    disabled={pagination.page >= pagination.totalPages}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-container disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <footer className="mt-auto px-4 sm:px-6 md:px-8 py-4 sm:py-6 border-t text-center">
          <p className="text-xs text-on-surface-variant">© {new Date().getFullYear()} BaeQuest</p>
        </footer>
      </main>

      {/* Mobile FAB */}
      <div className="md:hidden fixed bottom-5 right-5 z-30">
        <button
          onClick={() => navigate("/event-manager/create-event")}
          className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center shadow-xl shadow-primary/30 hover:bg-primary-dim hover:scale-110 active:scale-95 transition-all duration-200"
        >
          <span className="material-symbols-outlined">add</span>
        </button>
      </div>
    </div>
  );
}

function LoadingSkeleton({ cols }) {
  return (
    <div className="p-5 space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex gap-4 animate-pulse">
          <div className="w-12 h-12 rounded-lg bg-surface-container" />
          <div className="flex-1 space-y-2 py-1">
            <div className="h-4 bg-surface-container rounded w-1/3" />
            <div className="h-3 bg-surface-container rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ search, navigate }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-6">
      <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mb-4">
        <span className="material-symbols-outlined text-2xl text-outline-variant">event_busy</span>
      </div>
      <h3 className="text-base font-bold mb-2 text-on-surface">
        {search ? `No events matching "${search}"` : "No events yet"}
      </h3>
      <p className="text-xs sm:text-sm text-on-surface-variant max-w-xs mb-6">
        {search ? "Try a different search term." : "Start creating events to see them listed here."}
      </p>
      {!search && (
        <button
          onClick={() => navigate("/event-manager/create-event")}
          className="bg-primary text-white py-2.5 px-6 rounded-full text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary-dim hover:-translate-y-0.5 active:scale-95 transition-all"
        >
          Create My First Event
        </button>
      )}
    </div>
  );
}
