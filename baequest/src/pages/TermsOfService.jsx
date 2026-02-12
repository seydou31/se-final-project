import "../blocks/legal-pages.css";

export default function TermsOfService() {
  return (
    <div className="legal-page">
      <div className="legal-page__container">
        <h1 className="legal-page__title">Terms of Service</h1>
        <p className="legal-page__date">Last updated: February 2025</p>

        <section className="legal-page__section">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using BaeQuest, you agree to be bound by these Terms of Service.
            If you do not agree to these terms, please do not use our service.
          </p>
        </section>

        <section className="legal-page__section">
          <h2>2. Eligibility</h2>
          <p>
            You must be at least 18 years old to use BaeQuest. By using our service, you represent
            and warrant that you are at least 18 years of age.
          </p>
        </section>

        <section className="legal-page__section">
          <h2>3. Account Registration</h2>
          <p>
            You agree to provide accurate, current, and complete information during registration
            and to update such information to keep it accurate. You are responsible for maintaining
            the confidentiality of your account credentials.
          </p>
        </section>

        <section className="legal-page__section">
          <h2>4. User Conduct</h2>
          <p>You agree NOT to:</p>
          <ul className="legal-page__list">
            <li>Use the service for any illegal purpose</li>
            <li>Harass, threaten, or intimidate other users</li>
            <li>Impersonate any person or entity</li>
            <li>Post false, misleading, or deceptive content</li>
            <li>Upload inappropriate or offensive content</li>
            <li>Attempt to access other users' accounts</li>
            <li>Use the service to spam or solicit other users</li>
            <li>Check in to events you are not actually attending</li>
            <li>Create multiple accounts</li>
          </ul>
        </section>

        <section className="legal-page__section">
          <h2>5. Safety</h2>
          <p>
            While BaeQuest facilitates connections at public events, we cannot guarantee the behavior
            of other users. You are responsible for your own safety when meeting people. We recommend:
          </p>
          <ul className="legal-page__list">
            <li>Meeting only in public places (which our app facilitates)</li>
            <li>Telling a friend where you'll be</li>
            <li>Trusting your instincts</li>
            <li>Reporting any suspicious or inappropriate behavior</li>
          </ul>
        </section>

        <section className="legal-page__section">
          <h2>6. Content</h2>
          <p>
            You retain ownership of content you post, but grant us a license to use, display, and
            distribute your content within the service. You are responsible for ensuring you have
            the right to post any content you upload.
          </p>
        </section>

        <section className="legal-page__section">
          <h2>7. Location Services</h2>
          <p>
            BaeQuest uses location services to verify event check-ins. By using the check-in feature,
            you consent to the collection of your location data for this purpose.
          </p>
        </section>

        <section className="legal-page__section">
          <h2>8. Termination</h2>
          <p>
            We reserve the right to suspend or terminate your account at any time for violations of
            these terms or for any other reason at our discretion. You may delete your account at
            any time through the app settings.
          </p>
        </section>

        <section className="legal-page__section">
          <h2>9. Disclaimer of Warranties</h2>
          <p>
            BaeQuest is provided "as is" without warranties of any kind. We do not guarantee that
            the service will be uninterrupted, secure, or error-free.
          </p>
        </section>

        <section className="legal-page__section">
          <h2>10. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, BaeQuest shall not be liable for any indirect,
            incidental, special, consequential, or punitive damages arising from your use of the service.
          </p>
        </section>

        <section className="legal-page__section">
          <h2>11. Changes to Terms</h2>
          <p>
            We may modify these terms at any time. Continued use of the service after changes
            constitutes acceptance of the new terms.
          </p>
        </section>

        <section className="legal-page__section">
          <h2>12. Contact</h2>
          <p>
            For questions about these Terms of Service, contact us at{" "}
            <a href="mailto:legal@baequests.com" className="legal-page__link">legal@baequests.com</a>
          </p>
        </section>
      </div>
    </div>
  );
}
