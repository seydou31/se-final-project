import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import { useContext, useState } from "react";
import AppContext from "../context/AppContext";

export default function Header({ isLoggedIn, handleLoginModal, handleLogout, isLoggingOut, handleDeleteAccountModal }) {
  const { currentProfile } = useContext(AppContext);
  const firstInitial = currentProfile?.name?.charAt(0).toUpperCase() || "?";
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();

  const closeMenu = () => { setMenuOpen(false); setUserMenuOpen(false); };

  const NavLink = ({ to, children }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        onClick={closeMenu}
        className={`relative group font-medium transition-all duration-300 text-sm ${isActive ? "text-primary" : "text-slate-600 hover:text-primary"}`}
      >
        {children}
        <span className={`absolute left-0 -bottom-1 h-[2px] bg-primary transition-all duration-300 ${isActive ? "w-full" : "w-0 group-hover:w-full"}`} />
      </Link>
    );
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-lg bg-white/70 border-b border-white/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0">
            <img src={logo} alt="BaeQuest" className="w-32 md:w-36" />
          </Link>

          {/* Desktop Nav (logged in) */}
          {isLoggedIn && (
            <div className="hidden md:flex items-center gap-8">
              <NavLink to="/profile">Profile</NavLink>
              <NavLink to="/events">Events</NavLink>
              <NavLink to="/my-events">My Events</NavLink>
            </div>
          )}

          {/* Right Section */}
          <div className="flex items-center gap-3 sm:gap-4">
            {!isLoggedIn ? (
              <>
                <button
                  type="button"
                  onClick={handleLoginModal}
                  className="hidden md:inline-flex bg-primary text-white px-6 py-2.5 rounded-full font-semibold hover:shadow-lg hover:bg-primary-dim active:scale-95 transition-all duration-300"
                >
                  Sign In
                </button>
                <button onClick={() => setMenuOpen(o => !o)} className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                  </svg>
                </button>
              </>
            ) : (
              <>
                {/* Avatar + Dropdown (desktop) */}
                <div className="hidden md:block relative">
                  <button
                    onClick={() => setUserMenuOpen(o => !o)}
                    className="flex items-center gap-2.5 px-3 py-1.5 rounded-full hover:bg-surface-container transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shrink-0">
                      {firstInitial}
                    </div>
                    <span className="text-sm font-semibold text-on-surface max-w-[120px] truncate">{currentProfile.name}</span>
                    <span className="material-symbols-outlined text-base text-on-surface-variant">{userMenuOpen ? "expand_less" : "expand_more"}</span>
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-lg shadow-xl border border-outline-variant/10 overflow-hidden z-50">
                      <div className="px-4 py-3 border-b border-outline-variant/10">
                        <p className="text-xs text-on-surface-variant">Signed in as</p>
                        <p className="text-sm font-semibold text-on-surface truncate">{currentProfile.name}</p>
                      </div>
                      <div className="py-1">
                        <Link to="/profile" onClick={closeMenu} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container transition-colors">
                          <span className="material-symbols-outlined text-base text-on-surface-variant">person</span> Profile
                        </Link>
                        <Link to="/events" onClick={closeMenu} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container transition-colors">
                          <span className="material-symbols-outlined text-base text-on-surface-variant">event</span> Events
                        </Link>
                        <Link to="/my-events" onClick={closeMenu} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container transition-colors">
                          <span className="material-symbols-outlined text-base text-on-surface-variant">bookmark</span> My Events
                        </Link>
                        <div className="border-t border-outline-variant/10 mt-1 pt-1">
                          <button onClick={() => { handleLogout(); closeMenu(); }} disabled={isLoggingOut} className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container transition-colors disabled:opacity-50">
                            <span className="material-symbols-outlined text-base text-on-surface-variant">logout</span>
                            {isLoggingOut ? "Logging out…" : "Logout"}
                          </button>
                          <button onClick={() => { handleDeleteAccountModal(); closeMenu(); }} className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-error hover:bg-red-50 transition-colors">
                            <span className="material-symbols-outlined text-base">delete</span> Delete Account
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Mobile hamburger */}
                <button onClick={() => setMenuOpen(o => !o)} className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-6 pb-5 border-t border-gray-100 bg-white/95 backdrop-blur-lg">
          <div className="flex flex-col gap-1 pt-4">
            {!isLoggedIn ? (
              <>
                <button type="button" onClick={() => { handleLoginModal(); closeMenu(); }}
                  className="w-full bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-primary-dim transition-colors">
                  Sign In
                </button>
                <Link to="/signup" onClick={closeMenu}
                  className="w-full text-center border border-primary text-primary px-6 py-3 rounded-full font-semibold hover:bg-primary/5 transition-colors">
                  Create Account
                </Link>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 px-2 py-3 mb-1">
                  <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shrink-0">{firstInitial}</div>
                  <div>
                    <p className="font-semibold text-sm text-on-surface">{currentProfile.name}</p>
                    <p className="text-xs text-on-surface-variant">Member</p>
                  </div>
                </div>
                <Link to="/profile" onClick={closeMenu} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-on-surface hover:bg-surface-container transition-colors">
                  <span className="material-symbols-outlined text-base text-on-surface-variant">person</span> Profile
                </Link>
                <Link to="/events" onClick={closeMenu} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-on-surface hover:bg-surface-container transition-colors">
                  <span className="material-symbols-outlined text-base text-on-surface-variant">event</span> Events
                </Link>
                <Link to="/my-events" onClick={closeMenu} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-on-surface hover:bg-surface-container transition-colors">
                  <span className="material-symbols-outlined text-base text-on-surface-variant">bookmark</span> My Events
                </Link>
                <div className="border-t border-outline-variant/10 mt-2 pt-2">
                  <button onClick={() => { handleLogout(); closeMenu(); }} disabled={isLoggingOut} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-on-surface hover:bg-surface-container transition-colors disabled:opacity-50">
                    <span className="material-symbols-outlined text-base text-on-surface-variant">logout</span>
                    {isLoggingOut ? "Logging out…" : "Logout"}
                  </button>
                  <button onClick={() => { handleDeleteAccountModal(); closeMenu(); }} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-error hover:bg-red-50 transition-colors">
                    <span className="material-symbols-outlined text-base">delete</span> Delete Account
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Overlay to close dropdowns */}
      {userMenuOpen && <div className="fixed inset-0 z-40" onClick={closeMenu} />}
    </nav>
  );
}
