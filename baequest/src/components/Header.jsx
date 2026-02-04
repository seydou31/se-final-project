import { Link } from "react-router-dom";
import logo from "../assets/baequest-logo.svg";
import "../blocks/header.css";
import { useContext, useState } from "react";
import AppContext from "../context/AppContext";

export default function Header({ isLoggedIn, handleLoginModal, handleLogout, handleDeleteAccountModal }) {
  const { currentProfile } = useContext(AppContext);
  const firstInitial = currentProfile.name.charAt(0).toUpperCase();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const openDeleteModal = () => {
    handleDeleteAccountModal();
    closeMenu();
  };

  return (
    <header className="header">
      <div className="header__left">
        <img className="header__logo" src={logo} alt="baequest-logo" />
        <h2 className="header__title">Baequest</h2>
      </div>

      {/* Desktop Navigation */}
      {!isLoggedIn && (
        <button type="button" onClick={handleLoginModal} className="header__button">
          SIGN IN
        </button>
      )}

      {isLoggedIn && (
        <>
          {/* Hamburger Menu Button - Mobile Only */}
          <button
            className={`header__burger ${menuOpen ? "header__burger_active" : ""}`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span className="header__burger-line"></span>
            <span className="header__burger-line"></span>
            <span className="header__burger-line"></span>
          </button>

          {/* Mobile Menu Overlay */}
          <div
            className={`header__overlay ${menuOpen ? "header__overlay_visible" : ""}`}
            onClick={closeMenu}
          ></div>

          {/* Navigation Links */}
          <nav className={`header__nav ${menuOpen ? "header__nav_open" : ""}`}>
            <Link className="header__link" to="/profile" onClick={closeMenu}>
              <span>Profile</span>
            </Link>
            <Link className="header__link" to="/meet" onClick={closeMenu}>
              <span>Meet</span>
            </Link>
            <Link className="header__link" to="/my-events" onClick={closeMenu}>
              <span>My Events</span>
            </Link>
            <span onClick={() => { handleLogout(); closeMenu(); }} className="header__logout">
              Logout
            </span>
            <span onClick={openDeleteModal} className="header__delete-account">Delete account</span>
          </nav>

          {/* User Info */}
          <div className="header__user">
            <div className="header__user-initial">{firstInitial}</div>
            <p className="header__username">{currentProfile.name}</p>
          </div>
        </>
      )}
    </header>
  );
}
