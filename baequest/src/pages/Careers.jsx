import "../blocks/legal-pages.css";

export default function Careers() {
  return (
    <div className="legal-page">
      <div className="legal-page__container">
        <h1 className="legal-page__title">Careers</h1>

        <section className="legal-page__section">
          <h2>Join Our Team</h2>
          <p>
            BaeQuest is a growing startup looking for passionate individuals who want to change
            how people connect. We're building something special, and we'd love for you to be part of it.
          </p>
        </section>

        <section className="legal-page__section">
          <h2>Current Openings</h2>
          <p>
            We don't have any open positions at the moment, but we're always interested in
            hearing from talented people. If you think you'd be a great fit, send us your resume!
          </p>
        </section>

        <section className="legal-page__section">
          <h2>What We Look For</h2>
          <ul className="legal-page__list">
            <li>Passion for building products that bring people together</li>
            <li>Creative problem-solving skills</li>
            <li>Ability to work in a fast-paced startup environment</li>
            <li>Strong communication skills</li>
            <li>A good sense of humor (we like to have fun!)</li>
          </ul>
        </section>

        <section className="legal-page__section">
          <h2>Perks</h2>
          <ul className="legal-page__list">
            <li>Remote-friendly work environment</li>
            <li>Flexible hours</li>
            <li>Be part of shaping a product from the ground up</li>
            <li>Work with a passionate, close-knit team</li>
          </ul>
        </section>

        <section className="legal-page__section">
          <h2>How to Apply</h2>
          <p>
            Send your resume and a brief note about why you'd be a great fit to{" "}
            <a href="mailto:careers@baequests.com" className="legal-page__link">careers@baequests.com</a>
          </p>
        </section>
      </div>
    </div>
  );
}
