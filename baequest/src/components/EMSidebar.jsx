import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { logout } from "../utils/api";
import toast from "react-hot-toast";
import { useEventManagerAuth } from "../hooks/useEventManagerAuth";

const NAV = [
  { to: "/event-manager/dashboard",   icon: "dashboard",    label: "Overview"   },
  { to: "/event-manager/my-events",   icon: "event_note",   label: "My Events"  },
];

export default function EMSidebar({ me }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { logoutLocal } = useEventManagerAuth();

  const initial = me?.name?.charAt(0).toUpperCase() ?? "?";

    
  async function handleLogout() {
    try {
      await logout();
    } catch (err) {
      console.error(err);
    }

    logoutLocal(); // Clear Event Manager auth state

    toast.success("Logged out successfully!");
    navigate("/event-manager/login", { replace: true });
  }

  return (
    <aside className="hidden md:flex flex-col h-screen w-60 lg:w-64 bg-surface-container-low border-r border-surface-variant/20 py-5 lg:py-6 sticky top-0 shrink-0">

      {/* Logo */}
      <div className="px-5 lg:px-6 mb-6 lg:mb-8">
        <Link to="/event-manager/dashboard">
          <img src={logo} alt="BaeQuest" className="w-28 lg:w-36" />
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col space-y-1 px-2">
        {NAV.map(({ to, icon, label }) => {
          const isActive = pathname === to || (to === "/event-manager/dashboard" && pathname === "/event-manager/dashboard") || (to !== "/event-manager/dashboard" && pathname.startsWith(to));
          return (
            <Link
              key={to}
              to={to}
              className={`group flex items-center gap-3 px-4 py-2.5 lg:py-3 rounded-full text-sm lg:text-base font-medium transition-all duration-200 ${
                isActive
                  ? "bg-white text-primary shadow-sm"
                  : "text-on-surface-variant hover:bg-white/70 hover:text-primary hover:shadow-sm"
              }`}
            >
              <span className={`material-symbols-outlined text-lg lg:text-xl transition-transform duration-200 group-hover:scale-110 ${isActive ? "" : ""}`}>
                {icon}
              </span>
              <span>{label}</span>
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User + logout */}
      {me && (
        <div className="px-4 mt-4 pt-4 border-t border-surface-variant/30 space-y-2">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold shrink-0">
              {initial}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-on-surface truncate">{me.name}</p>
              <p className="text-[10px] text-on-surface-variant truncate">{me.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-full text-sm text-on-surface-variant hover:bg-white/70 hover:text-error transition-all duration-200 group"
          >
            <span className="material-symbols-outlined text-lg group-hover:scale-110 transition-transform">logout</span>
            Sign out
          </button>
        </div>
      )}

      {/* Add Event CTA */}
      <div className="px-4 mt-3">
        <Link
          to="/event-manager/create-event"
          className="w-full bg-primary text-white py-3 px-5 rounded-lg text-sm lg:text-base font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2 hover:bg-primary-dim hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Add Event
        </Link>
      </div>
    </aside>
  );
}
