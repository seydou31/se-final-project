import { Link } from "react-router-dom";
import "../blocks/footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__content">
        <div className="footer__section">
          <h4 className="footer__title">BaeQuest</h4>
          <p className="footer__text">
            Online dating where you date people, not their profile.
          </p>
        </div>
        <div className="footer__section">
          <h4 className="footer__title">Company</h4>
          <ul className="footer__list">
            <li className="footer__item">
              <Link to="/about" className="footer__link">About Us</Link>
            </li>
            <li className="footer__item">
              <Link to="/contact" className="footer__link">Contact</Link>
            </li>
            <li className="footer__item">
              <Link to="/careers" className="footer__link">Careers</Link>
            </li>
          </ul>
        </div>
        <div className="footer__section">
          <h4 className="footer__title">Legal</h4>
          <ul className="footer__list">
            <li className="footer__item">
              <Link to="/privacy" className="footer__link">Privacy Policy</Link>
            </li>
            <li className="footer__item">
              <Link to="/terms" className="footer__link">Terms of Service</Link>
            </li>
            <li className="footer__item">
              <Link to="/cookies" className="footer__link">Cookie Policy</Link>
            </li>
          </ul>
        </div>
        <div className="footer__section">
          <h4 className="footer__title">Follow Us</h4>
          <ul className="footer__list">
            <li className="footer__item">
              <a href="https://facebook.com/baequest" target="_blank" rel="noopener noreferrer" className="footer__link">Facebook</a>
            </li>
            <li className="footer__item">
              <a href="https://instagram.com/baequests" target="_blank" rel="noopener noreferrer" className="footer__link">Instagram</a>
            </li>
            <li className="footer__item">
              <a href="https://twitter.com/baequests" target="_blank" rel="noopener noreferrer" className="footer__link">Twitter</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer__bottom">
        <p className="footer__copyright">
          © {new Date().getFullYear()} BaeQuest. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
