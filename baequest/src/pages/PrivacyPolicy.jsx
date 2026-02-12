import "../blocks/legal-pages.css";

export default function PrivacyPolicy() {
  return (
    <div className="legal-page">
      <div className="legal-page__container">
        <h1 className="legal-page__title">Privacy Policy</h1>
        <p className="legal-page__date">Last updated: February 2025</p>

        <section className="legal-page__section">
          <h2>Introduction</h2>
          <p>
            BaeQuest ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy
            explains how we collect, use, disclose, and safeguard your information when you use our
            application and services.
          </p>
        </section>

        <section className="legal-page__section">
          <h2>Information We Collect</h2>
          <h3>Personal Information</h3>
          <p>When you create an account, we collect:</p>
          <ul className="legal-page__list">
            <li>Email address</li>
            <li>Name</li>
            <li>Age</li>
            <li>Gender</li>
            <li>Profile picture (optional)</li>
            <li>Profession</li>
            <li>Interests</li>
            <li>Sexual orientation (for matching purposes)</li>
          </ul>

          <h3>Location Data</h3>
          <p>
            When you check in to an event, we collect your location to verify you're at the event venue.
            We do not continuously track your location.
          </p>

          <h3>Usage Data</h3>
          <p>
            We collect information about how you interact with our app, including events viewed,
            check-ins, and feature usage.
          </p>
        </section>

        <section className="legal-page__section">
          <h2>How We Use Your Information</h2>
          <ul className="legal-page__list">
            <li>To provide and maintain our service</li>
            <li>To verify your presence at events</li>
            <li>To show you other users at the same event (based on your preferences)</li>
            <li>To send you important updates about your account</li>
            <li>To improve our services</li>
            <li>To prevent fraud and ensure safety</li>
          </ul>
        </section>

        <section className="legal-page__section">
          <h2>Information Sharing</h2>
          <p>We share limited information with other users:</p>
          <ul className="legal-page__list">
            <li>Your name, age, profession, and interests are visible to other users at the same event</li>
            <li>Your profile picture (if uploaded) is visible to other users</li>
            <li>Your exact location is never shared with other users</li>
          </ul>
          <p>
            We do not sell your personal information to third parties.
          </p>
        </section>

        <section className="legal-page__section">
          <h2>Data Storage and Security</h2>
          <p>
            Your data is stored securely using industry-standard encryption. We use secure cloud
            services to store your information and implement appropriate security measures to protect
            against unauthorized access.
          </p>
        </section>

        <section className="legal-page__section">
          <h2>Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="legal-page__list">
            <li>Access your personal data</li>
            <li>Update or correct your information</li>
            <li>Delete your account and associated data</li>
            <li>Opt out of marketing communications</li>
          </ul>
        </section>

        <section className="legal-page__section">
          <h2>Cookies</h2>
          <p>
            We use essential cookies to keep you logged in and maintain your session.
            See our Cookie Policy for more details.
          </p>
        </section>

        <section className="legal-page__section">
          <h2>Children's Privacy</h2>
          <p>
            BaeQuest is not intended for users under 18 years of age. We do not knowingly collect
            information from children under 18.
          </p>
        </section>

        <section className="legal-page__section">
          <h2>Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes
            by posting the new Privacy Policy on this page and updating the "Last updated" date.
          </p>
        </section>

        <section className="legal-page__section">
          <h2>Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy, please contact us at{" "}
            <a href="mailto:privacy@baequests.com" className="legal-page__link">privacy@baequests.com</a>
          </p>
        </section>
      </div>
    </div>
  );
}
