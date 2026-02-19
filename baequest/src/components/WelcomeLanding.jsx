import { useParams } from "react-router-dom";
import "../blocks/welcome-landing.css";

const campaignContent = {
  bars: {
    headline: "Meet Someone Special at Singles Events Near You",
    subheadline: "RSVP to curated events and check in to see who else is going tonight.",
    emoji: "🍻",
    cta: "Get Started Free",
  },
  lounges: {
    headline: "Connect with Singles at Exclusive Events",
    subheadline: "Browse curated singles events and discover who's looking to meet someone special.",
    emoji: "🍸",
    cta: "Get Started Free",
  },
  arcade: {
    headline: "Level Up Your Dating Life at Singles Events",
    subheadline: "Find fellow singles at fun curated events near you.",
    emoji: "🎮",
    cta: "Find Your Player 2",
  },
};

const defaultContent = {
  headline: "Meet Amazing People at Events Near You",
  subheadline: "Browse curated singles events, RSVP, and check in to see who's there and ready to connect.",
  emoji: "💕",
  cta: "Get Started Free",
};

export default function WelcomeLanding({ onClick }) {
  const { campaign } = useParams();
  const content = campaignContent[campaign] || defaultContent;

  return (
    <main className="welcome">
      <section className="welcome__hero">
        <span className="welcome__emoji">{content.emoji}</span>
        <h1 className="welcome__headline">{content.headline}</h1>
        <p className="welcome__subheadline">{content.subheadline}</p>
        <button className="welcome__cta" onClick={onClick}>
          {content.cta}
        </button>
        <p className="welcome__note">Free to join. No credit card required.</p>
      </section>
    </main>
  );
}
