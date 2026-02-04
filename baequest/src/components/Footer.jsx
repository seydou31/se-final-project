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
              <a href="#" className="footer__link">About Us</a>
            </li>
            <li className="footer__item">
              <a href="#" className="footer__link">Contact</a>
            </li>
            <li className="footer__item">
              <a href="#" className="footer__link">Careers</a>
            </li>
          </ul>
        </div>
        <div className="footer__section">
          <h4 className="footer__title">Legal</h4>
          <ul className="footer__list">
            <li className="footer__item">
              <a href="#" className="footer__link">Privacy Policy</a>
            </li>
            <li className="footer__item">
              <a href="#" className="footer__link">Terms of Service</a>
            </li>
            <li className="footer__item">
              <a href="#" className="footer__link">Cookie Policy</a>
            </li>
          </ul>
        </div>
        <div className="footer__section">
          <h4 className="footer__title">Follow Us</h4>
          <ul className="footer__list">
            <li className="footer__item">
              <a href="#" className="footer__link">Facebook</a>
            </li>
            <li className="footer__item">
              <a href="#" className="footer__link">Instagram</a>
            </li>
            <li className="footer__item">
              <a href="#" className="footer__link">Twitter</a>
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
