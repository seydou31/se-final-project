import "../blocks/legal-pages.css";

export default function Contact() {
  return (
    <div className="legal-page">
      <div className="legal-page__container">
        <h1 className="legal-page__title">Contact Us</h1>

        <section className="legal-page__section">
          <h2>Get in Touch</h2>
          <p>
            We'd love to hear from you! Whether you have questions, feedback, or just want to say hi,
            feel free to reach out.
          </p>
        </section>

        <section className="legal-page__section">
          <h2>Email</h2>
          <p>
            For general inquiries: <a href="mailto:hello@baequests.com" className="legal-page__link">hello@baequests.com</a>
          </p>
          <p>
            For support: <a href="mailto:support@baequests.com" className="legal-page__link">support@baequests.com</a>
          </p>
        </section>

        <section className="legal-page__section">
          <h2>Report an Issue</h2>
          <p>
            Encountered a bug or have a safety concern? Please email us at{" "}
            <a href="mailto:support@baequests.com" className="legal-page__link">support@baequests.com</a>{" "}
            and we'll address it as quickly as possible.
          </p>
        </section>

        <section className="legal-page__section">
          <h2>Social Media</h2>
          <p>
            Follow us for updates on new features and events:
          </p>
          <ul className="legal-page__list">
            <li>Instagram: @baequests</li>
            <li>Twitter: @baequests</li>
            <li>Facebook: BaeQuest</li>
          </ul>
        </section>

        <section className="legal-page__section">
          <h2>Response Time</h2>
          <p>
            We typically respond to all inquiries within 24-48 hours during business days.
            For urgent safety concerns, please indicate "URGENT" in your subject line.
          </p>
        </section>
      </div>
    </div>
  );
}
