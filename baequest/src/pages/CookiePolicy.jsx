import "../blocks/legal-pages.css";

export default function CookiePolicy() {
  return (
    <div className="legal-page">
      <div className="legal-page__container">
        <h1 className="legal-page__title">Cookie Policy</h1>
        <p className="legal-page__date">Last updated: February 2025</p>

        <section className="legal-page__section">
          <h2>What Are Cookies?</h2>
          <p>
            Cookies are small text files stored on your device when you visit a website. They help
            websites remember your preferences and provide a better user experience.
          </p>
        </section>

        <section className="legal-page__section">
          <h2>How We Use Cookies</h2>
          <p>BaeQuest uses cookies for the following purposes:</p>

          <h3>Essential Cookies</h3>
          <p>
            These cookies are necessary for the website to function properly. They include:
          </p>
          <ul className="legal-page__list">
            <li>
              <strong>Authentication cookies:</strong> Keep you logged in to your account
            </li>
            <li>
              <strong>Session cookies:</strong> Maintain your session while using the app
            </li>
          </ul>

          <h3>Functional Cookies</h3>
          <p>
            These cookies remember your preferences, such as:
          </p>
          <ul className="legal-page__list">
            <li>Your current event check-in status</li>
            <li>Display preferences</li>
          </ul>

          <h3>Analytics Cookies</h3>
          <p>
            We use analytics to understand how users interact with our app. This helps us improve
            our service. Analytics data is anonymized and aggregated.
          </p>
        </section>

        <section className="legal-page__section">
          <h2>Third-Party Cookies</h2>
          <p>
            We may use third-party services that set their own cookies:
          </p>
          <ul className="legal-page__list">
            <li>
              <strong>Google:</strong> For Google Sign-In functionality and analytics
            </li>
          </ul>
        </section>

        <section className="legal-page__section">
          <h2>Managing Cookies</h2>
          <p>
            Most web browsers allow you to control cookies through their settings. You can:
          </p>
          <ul className="legal-page__list">
            <li>View what cookies are stored on your device</li>
            <li>Delete some or all cookies</li>
            <li>Block cookies from being set</li>
          </ul>
          <p>
            Note that blocking essential cookies may prevent you from using BaeQuest properly,
            including staying logged in.
          </p>
        </section>

        <section className="legal-page__section">
          <h2>Local Storage</h2>
          <p>
            In addition to cookies, we use local storage to remember:
          </p>
          <ul className="legal-page__list">
            <li>Whether you're logged in</li>
            <li>Your current event check-in</li>
          </ul>
          <p>
            This data stays on your device and helps the app load faster.
          </p>
        </section>

        <section className="legal-page__section">
          <h2>Updates to This Policy</h2>
          <p>
            We may update this Cookie Policy from time to time. Any changes will be posted on this page
            with an updated "Last updated" date.
          </p>
        </section>

        <section className="legal-page__section">
          <h2>Contact Us</h2>
          <p>
            If you have questions about our use of cookies, please contact us at{" "}
            <a href="mailto:privacy@baequests.com" className="legal-page__link">privacy@baequests.com</a>
          </p>
        </section>
      </div>
    </div>
  );
}
