import "../blocks/legal-pages.css";

export default function AboutUs() {
  return (
    <div className="legal-page">
      <div className="legal-page__container">
        <h1 className="legal-page__title">About Us</h1>

        <section className="legal-page__section">
          <h2>Our Mission</h2>
          <p>
            BaeQuest is reimagining online dating by bringing people together at real-world events.
            We believe that meaningful connections happen when you meet people in person, not just
            through endless swiping on profiles.
          </p>
        </section>

        <section className="legal-page__section">
          <h2>How It Works</h2>
          <p>
            Instead of judging someone by their photos and bio, BaeQuest connects you with people
            who are attending the same events as you in the DMV (DC, Maryland, Virginia) area.
            Check in to an event, see who else is there, and start a real conversation.
          </p>
        </section>

        <section className="legal-page__section">
          <h2>Why BaeQuest?</h2>
          <ul className="legal-page__list">
            <li>
              <strong>Real connections:</strong> Meet people face-to-face at events you both enjoy
            </li>
            <li>
              <strong>Shared interests:</strong> You're already at the same event, so you have something in common
            </li>
            <li>
              <strong>No more awkward first dates:</strong> The event IS the first date
            </li>
            <li>
              <strong>Safety first:</strong> Public venues mean safer meetings
            </li>
          </ul>
        </section>

        <section className="legal-page__section">
          <h2>Our Story</h2>
          <p>
            BaeQuest was born from the frustration of traditional dating apps. We wanted to create
            something that brings back the excitement of meeting someone organically, while still
            leveraging technology to help break the ice.
          </p>
          <p>
            We're a small team passionate about helping people make genuine connections. Based in the
            DMV area, we're starting local with plans to expand as our community grows.
          </p>
        </section>

        <section className="legal-page__section">
          <h2>Join the Quest</h2>
          <p>
            Whether you're looking for love, friendship, or just someone to enjoy events with,
            BaeQuest is here to help you find your people. Sign up today and start your quest!
          </p>
        </section>
      </div>
    </div>
  );
}
