import { useEffect, useState } from 'react';

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  'https://api.baequests.com';

const PAGE_SIZE = 10;

function formatDate(d) {
  if (!d) return '—';

  return new Date(d).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * ─────────────────────────────────────────────
 * PAGINATION
 * ─────────────────────────────────────────────
 */
function Pagination({
  page,
  totalPages,
  onPrev,
  onNext,
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-5 py-3 border-t border-outline-variant/10">
      <span className="text-xs text-on-surface-variant">
        Page {page} of {totalPages}
      </span>

      <div className="flex items-center gap-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          disabled={page === 1}
          className="px-3 py-1.5 rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-container disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          ← Prev
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          disabled={page >= totalPages}
          className="px-3 py-1.5 rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-container disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Next →
        </button>
      </div>
    </div>
  );
}

/**
 * ─────────────────────────────────────────────
 * STAT CARD
 * ─────────────────────────────────────────────
 */
function StatCard({
  icon,
  iconColor,
  label,
  value,
  badge,
}) {
  return (
    <div className="group bg-white p-5 md:p-6 rounded-lg shadow-[0_20px_50px_rgba(42,52,57,0.06)] hover:shadow-[0_20px_50px_rgba(42,52,57,0.10)] hover:-translate-y-1 transition-all duration-300 cursor-default">
      <div className="flex justify-between mb-4">
        <span
          className={`material-symbols-outlined ${iconColor} group-hover:scale-110 transition-transform duration-200`}
        >
          {icon}
        </span>

        <span className="text-[10px] font-bold text-on-surface-variant tracking-wider">
          {badge}
        </span>
      </div>

      <div className="text-2xl md:text-3xl font-black text-on-surface">
        {value}
      </div>

      <div className="text-xs sm:text-sm text-on-surface-variant mt-1">
        {label}
      </div>
    </div>
  );
}

/**
 * ─────────────────────────────────────────────
 * MANAGER CARD
 * ─────────────────────────────────────────────
 */
function ManagerCard({ manager, secret }) {
  const [open, setOpen] = useState(false);

  const [eventsData, setEventsData] = useState([]);
  const [eventsPagination, setEventsPagination] =
    useState(null);

  const [eventsLoading, setEventsLoading] =
    useState(false);

  const [evSearch, setEvSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [evPage, setEvPage] = useState(1);

  async function fetchEvents(page = 1) {
    try {
      setEventsLoading(true);

      const params = new URLSearchParams({
        page,
        limit: PAGE_SIZE,
      });

      if (evSearch) {
        params.append('search', evSearch);
      }

      if (dateFrom) {
        params.append('dateFrom', dateFrom);
      }

      if (dateTo) {
        params.append('dateTo', dateTo);
      }

      const res = await fetch(
        `${API_BASE}/admin/manager/${manager._id}/events?${params.toString()}`,
        {
          headers: {
            'x-admin-secret': secret,
          },
        }
      );

      const result = await res.json();

      setEventsData(result.data || []);
      setEventsPagination(result.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setEventsLoading(false);
    }
  }

  useEffect(() => {
    if (open) {
      fetchEvents(evPage);
    }
  }, [open, evPage]);

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-outline-variant/10 hover:shadow-md transition-shadow duration-200">
      {/* HEADER */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-surface-container-low transition-colors duration-150"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
            {manager.name.charAt(0).toUpperCase()}
          </div>

          <div className="min-w-0">
            <p className="font-semibold text-sm text-on-surface truncate">
              {manager.name}
            </p>

            <p className="text-xs text-on-surface-variant truncate">
              {manager.email}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span
            className={`hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
              manager.stripeOnboardingComplete
                ? 'bg-green-100 text-green-700'
                : 'bg-amber-100 text-amber-700'
            }`}
          >
            <span className="material-symbols-outlined text-xs">
              {manager.stripeOnboardingComplete
                ? 'check_circle'
                : 'warning'}
            </span>

            {manager.stripeOnboardingComplete
              ? 'Stripe connected'
              : 'Stripe pending'}
          </span>

          <span className="text-xs text-on-surface-variant hidden md:block">
            {manager.totalEvents} events
          </span>

          <span className="text-sm font-bold text-primary">
            ${manager.totalEarnings.toFixed(2)}
          </span>

          <span
            className="material-symbols-outlined text-base text-on-surface-variant transition-transform duration-200"
            style={{
              transform: open
                ? 'rotate(180deg)'
                : 'rotate(0deg)',
            }}
          >
            expand_more
          </span>
        </div>
      </button>

      {/* EVENTS */}
      {open && (
        <div className="border-t border-outline-variant/10">
          {/* FILTERS */}
          <div className="flex flex-wrap gap-2 px-5 py-3 bg-surface-container-low border-b border-outline-variant/10">
            <div className="relative flex-1 min-w-[180px]">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm pointer-events-none">
                search
              </span>

              <input
                type="text"
                placeholder="Search events…"
                value={evSearch}
                onChange={(e) =>
                  setEvSearch(e.target.value)
                }
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white rounded-lg border border-outline-variant/20 focus:border-primary/40 focus:outline-none transition"
              />
            </div>

            <input
              type="date"
              value={dateFrom}
              onChange={(e) =>
                setDateFrom(e.target.value)
              }
              className="px-3 py-1.5 text-xs bg-white rounded-lg border border-outline-variant/20 focus:border-primary/40 focus:outline-none transition"
            />

            <span className="self-center text-xs text-on-surface-variant">
              to
            </span>

            <input
              type="date"
              value={dateTo}
              onChange={(e) =>
                setDateTo(e.target.value)
              }
              className="px-3 py-1.5 text-xs bg-white rounded-lg border border-outline-variant/20 focus:border-primary/40 focus:outline-none transition"
            />

            <button
              onClick={() => {
                setEvPage(1);
                fetchEvents(1);
              }}
              className="px-4 py-1.5 text-xs rounded-lg bg-primary text-white font-semibold"
            >
              Apply
            </button>
          </div>

          {/* TABLE */}
          {eventsLoading ? (
            <div className="p-10 text-center text-sm text-on-surface-variant">
              Loading events...
            </div>
          ) : eventsData.length === 0 ? (
            <div className="p-10 text-center text-sm text-on-surface-variant">
              No events found.
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-outline-variant/20 bg-surface-container-low text-on-surface-variant text-xs uppercase tracking-wider">
                      <th className="text-left px-5 py-3 font-bold">
                        Event
                      </th>

                      <th className="text-left px-5 py-3 font-bold">
                        Location
                      </th>

                      <th className="text-left px-5 py-3 font-bold">
                        Date
                      </th>

                      <th className="text-left px-5 py-3 font-bold">
                        Paid Check-ins
                      </th>

                      <th className="text-left px-5 py-3 font-bold">
                        Earnings
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {eventsData.map((ev) => (
                      <tr
                        key={ev._id}
                        className="border-b border-outline-variant/10 hover:bg-surface-container-low transition-colors duration-150"
                      >
                        <td className="px-5 py-3.5 font-medium text-on-surface">
                          {ev.name}
                        </td>

                        <td className="px-5 py-3.5 text-on-surface-variant">
                          {ev.city}, {ev.state}
                        </td>

                        <td className="px-5 py-3.5 text-on-surface-variant">
                          {formatDate(ev.startTime)}
                        </td>

                        <td className="px-5 py-3.5">
                          {ev.paidCheckinCount}
                        </td>

                        <td className="px-5 py-3.5 font-bold text-primary">
                          ${ev.earnings.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Pagination
                page={eventsPagination?.page || 1}
                totalPages={
                  eventsPagination?.totalPages || 1
                }
                onPrev={() => {
                  const newPage = Math.max(
                    1,
                    evPage - 1
                  );

                  setEvPage(newPage);
                  fetchEvents(newPage);
                }}
                onNext={() => {
                  const newPage = Math.min(
                    eventsPagination.totalPages,
                    evPage + 1
                  );

                  setEvPage(newPage);
                  fetchEvents(newPage);
                }}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * ─────────────────────────────────────────────
 * MAIN PAGE
 * ─────────────────────────────────────────────
 */
export default function AdminPage() {
  const [secret, setSecret] = useState('');

  const [data, setData] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState('');

  const [managerSearch, setManagerSearch] =
    useState('');

  const [managerPage, setManagerPage] =
    useState(1);

  async function fetchOverview(
    page = 1,
    search = ''
  ) {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page,
        limit: PAGE_SIZE,
      });

      if (search) {
        params.append('search', search);
      }

      const res = await fetch(
        `${API_BASE}/admin/overview?${params.toString()}`,
        {
          headers: {
            'x-admin-secret': secret,
          },
        }
      );

      if (!res.ok) {
        setError(
          'Invalid admin secret or server error.'
        );

        setData(null);

        return;
      }

      const result = await res.json();

      setData(result);
    } catch (err) {
      console.error(err);

      setError('Failed to reach the server.');
    } finally {
      setLoading(false);
    }
  }

  async function handleFetch(e) {
    e.preventDefault();

    setManagerPage(1);

    fetchOverview(1, managerSearch);
  }

  const managers = data?.data || [];

  const pagination = data?.pagination || {};

  const stats = data?.stats || {};

  const totalManagerPages =
    pagination.totalPages || 1;

  return (
    <div className="min-h-screen bg-background text-on-surface font-body">
      {/* TOPBAR */}
      <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/10 px-4 sm:px-8 py-3 sm:py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-base">
              admin_panel_settings
            </span>
          </div>

          <div>
            <h1 className="text-base sm:text-lg font-black tracking-tight font-headline leading-none">
              BaeQuest Admin
            </h1>

            <p className="text-[10px] text-on-surface-variant hidden sm:block">
              Internal dashboard
            </p>
          </div>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleFetch}
          className="flex items-center gap-2"
        >
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm pointer-events-none">
              lock
            </span>

            <input
              type="password"
              placeholder="Admin secret"
              value={secret}
              onChange={(e) =>
                setSecret(e.target.value)
              }
              required
              className="pl-9 pr-3 py-2 text-sm bg-surface-container rounded-lg border border-transparent focus:border-primary/40 focus:outline-none transition w-36 sm:w-48"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-primary-dim"
          >
            {loading ? 'Loading...' : 'Load Data'}
          </button>
        </form>
      </header>

      {/* ERROR */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6">
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        </div>
      )}

      {/* MAIN */}
      {data && (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
          {/* STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <StatCard
              icon="group"
              iconColor="text-primary"
              badge="REGISTERED"
              value={stats.totalManagers || 0}
              label="Event Managers"
            />

            <StatCard
              icon="calendar_today"
              iconColor="text-secondary"
              badge="ALL TIME"
              value={stats.totalEvents || 0}
              label="Total Events"
            />

            <StatCard
              icon="payments"
              iconColor="text-tertiary"
              badge="COMBINED"
              value={`$${stats.totalEarnings || 0}`}
              label="Manager Earnings"
            />
          </div>

          {/* SEARCH */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-base font-bold text-on-surface">
              Event Managers

              <span className="ml-2 text-xs font-normal text-on-surface-variant">
                {managers.length} of{' '}
                {pagination.total || 0}
              </span>
            </h2>

            <div className="relative w-full sm:w-72">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-base pointer-events-none">
                search
              </span>

              <input
                type="text"
                placeholder="Search by name or email…"
                value={managerSearch}
                onChange={(e) =>
                  setManagerSearch(e.target.value)
                }
                className="w-full pl-9 pr-3 py-2 text-sm bg-white rounded-lg border border-outline-variant/20 focus:border-primary/40 focus:outline-none shadow-sm transition"
              />
            </div>

            <button
              onClick={() => {
                setManagerPage(1);

                fetchOverview(
                  1,
                  managerSearch
                );
              }}
              className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold"
            >
              Search
            </button>
          </div>

          {/* MANAGERS */}
          <div className="space-y-3">
            {managers.map((manager) => (
              <ManagerCard
                key={manager._id}
                manager={manager}
                secret={secret}
              />
            ))}
          </div>

          {/* PAGINATION */}
          <Pagination
            page={pagination.page || 1}
            totalPages={totalManagerPages}
            onPrev={() => {
              const newPage = Math.max(
                1,
                managerPage - 1
              );

              setManagerPage(newPage);

              fetchOverview(
                newPage,
                managerSearch
              );
            }}
            onNext={() => {
              const newPage = Math.min(
                totalManagerPages,
                managerPage + 1
              );

              setManagerPage(newPage);

              fetchOverview(
                newPage,
                managerSearch
              );
            }}
          />
        </div>
      )}

      {/* EMPTY */}
      {!data && !loading && !error && (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-4xl text-primary">
              admin_panel_settings
            </span>
          </div>

          <h2 className="text-xl font-black font-headline mb-2">
            Admin Dashboard
          </h2>

          <p className="text-sm text-on-surface-variant max-w-xs">
            Enter your admin secret above to load
            manager and event data.
          </p>
        </div>
      )}
    </div>
  );
}