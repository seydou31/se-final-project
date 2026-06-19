import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { logout } from "../utils/api";

const NAV = [
  { to: "/event-manager/dashboard",   label: "Overview"   },
  { to: "/event-manager/my-events",   label: "My Events"  },
];

export default function EMTopBar({ title, me }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  //const [dropOpen, setDropOpen]  = useState(false);

  const initial = me?.name?.charAt(0).toUpperCase() ?? "?";

  async function handleLogout() {
    try { await logout(); } 
    catch (err) {
      console.error(err);
    }
    navigate("/event-manager/login");
  }

  return (
    <header className="flex justify-between items-center w-full px-4 sm:px-6 md:px-8 lg:px-10 py-3 sm:py-4 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/10 sticky top-0 z-40">

      {/* Left */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Mobile logo */}
        <Link to="/event-manager/dashboard" className="md:hidden">
          <img src={logo} alt="BaeQuest" className="w-24" />
        </Link>
        {title && (
          <h1 className="hidden md:block text-base sm:text-lg md:text-xl font-semibold tracking-tight">
            {title}
          </h1>
        )}
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 sm:gap-3">

        {/* Add Event (mobile) */}
        <Link
          to="/event-manager/create-event"
          className="md:hidden bg-primary text-white px-3 py-2 rounded-lg text-xs font-bold shadow-md hover:bg-primary-dim active:scale-95 transition-all"
        >
          + Event
        </Link>

        {/* Avatar dropdown */}
        <div className="relative pl-2 sm:pl-3 border-l border-outline-variant/20">
          {/* <button
            onClick={() => setDropOpen(o => !o)}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          > */}
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
              {initial}
            </div>
            {/* {me?.name && (
              <span className="hidden sm:block text-sm font-medium text-on-surface max-w-[100px] truncate">
                {me.name}
              </span>
            )} */}
            {/* <span className="material-symbols-outlined text-sm text-on-surface-variant hidden sm:block">
              {dropOpen ? "expand_less" : "expand_more"}
            </span> */}
          {/* </button> */}

          {/* {dropOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setDropOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-lg shadow-xl border border-outline-variant/10 overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-outline-variant/10">
                  <p className="text-xs text-on-surface-variant">Signed in as</p>
                  <p className="text-sm font-semibold text-on-surface truncate">{me?.name}</p>
                </div>
                <div className="py-1">
                  {NAV.map(({ to, label }) => {
                    const isActive = pathname === to;
                    return (
                      <Link
                        key={to}
                        to={to}
                        onClick={() => setDropOpen(false)}
                        className={`flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                          isActive
                            ? "text-primary font-semibold bg-primary/5"
                            : "text-on-surface hover:bg-surface-container"
                        }`}
                      >
                        {label}
                        {isActive && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                      </Link>
                    );
                  })}
                  <div className="border-t border-outline-variant/10 mt-1 pt-1">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-on-surface-variant hover:bg-surface-container hover:text-error transition-colors"
                    >
                      <span className="material-symbols-outlined text-base">logout</span>
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            </>
          )} */}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(o => !o)}
          className="md:hidden p-2 rounded-lg hover:bg-surface-container transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-lg border-b border-outline-variant/10 px-4 py-4 z-50 flex flex-col gap-1">
          {NAV.map(({ to, label }) => {
            const isActive = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-between ${
                  isActive ? "text-primary bg-primary/5 font-semibold" : "text-on-surface hover:bg-surface-container"
                }`}
              >
                {label}
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
              </Link>
            );
          })}
          <div className="border-t border-outline-variant/10 mt-1 pt-1">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-on-surface-variant hover:text-error"
            >
              <span className="material-symbols-outlined text-base">logout</span> Sign out
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
