import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Footer() {
  return (
    <footer className="bg-slate-50 py-8 sm:py-10 border-t border-slate-200/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex flex-col md:flex-row justify-between items-center gap-6">

        {/* Logo + Copyright */}
        <div className="text-center md:text-left">
          <Link to="/">
            <img src={logo} alt="BaeQuest" className="w-28 sm:w-32 md:w-36 mx-auto md:mx-0 mb-2" />
          </Link>
          <p className="text-slate-500 text-xs sm:text-sm">© {new Date().getFullYear()} BaeQuest. All rights reserved.</p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center md:justify-start gap-4 sm:gap-6 md:gap-8 text-xs sm:text-sm font-medium">
          <Link className="text-slate-500 hover:text-primary transition-colors" to="/about">About Us</Link>
          <Link className="text-slate-500 hover:text-primary transition-colors" to="/contact">Contact</Link>
          <Link className="text-slate-500 hover:text-primary transition-colors" to="/careers">Careers</Link>
          <Link className="text-slate-500 hover:text-primary transition-colors" to="/privacy">Privacy</Link>
          <Link className="text-slate-500 hover:text-primary transition-colors" to="/terms">Terms</Link>
          <Link className="text-slate-500 hover:text-primary transition-colors" to="/cookies">Cookies</Link>
        </div>

        {/* Social Icons */}
        <div className="flex gap-3 sm:gap-4">
          <a href="https://facebook.com/baequest" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/20 cursor-pointer hover:bg-primary/30 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="#BD0C3B" viewBox="0 0 24 24" className="w-4 h-4 sm:w-5 sm:h-5">
              <path d="M22 12a10 10 0 1 0-11.6 9.9v-7h-2.7V12h2.7V9.8c0-2.7 1.6-4.2 4-4.2 1.2 0 2.4.2 2.4.2v2.6h-1.4c-1.4 0-1.8.9-1.8 1.7V12h3l-.5 2.9h-2.5v7A10 10 0 0 0 22 12z" />
            </svg>
          </a>
          <a href="https://twitter.com/baequests" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/20 cursor-pointer hover:bg-primary/30 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="#BD0C3B" viewBox="0 0 24 24" className="w-4 h-4 sm:w-5 sm:h-5">
              <path d="M18.9 2H21l-6.5 7.4L22 22h-6.9l-5.4-7.1L3.8 22H1.6l7-8L2 2h7l5 6.6L18.9 2zm-2.4 18h1.9L7.5 4H5.5l11 16z" />
            </svg>
          </a>
          <a href="https://instagram.com/baequests" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/20 cursor-pointer hover:bg-primary/30 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="#BD0C3B" viewBox="0 0 24 24" className="w-4 h-4 sm:w-5 sm:h-5">
              <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 2A3.75 3.75 0 0 0 4 7.75v8.5A3.75 3.75 0 0 0 7.75 20h8.5A3.75 3.75 0 0 0 20 16.25v-8.5A3.75 3.75 0 0 0 16.25 4h-8.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm5.25-.9a1.15 1.15 0 1 1-2.3 0 1.15 1.15 0 0 1 2.3 0z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
