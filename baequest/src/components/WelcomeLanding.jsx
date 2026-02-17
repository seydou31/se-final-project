import { useParams } from "react-router-dom";
import "../blocks/welcome-landing.css";
import { Users, MapPin, MessageCircle, Heart } from "lucide-react";

const campaignContent = {
  bars: {
    headline: "Meet Someone Special at Your Favorite Bar",
    subheadline: "See who's checked in at bars near you and make a real connection tonight.",
    heroEmoji: "🍻",
    benefits: [
      { icon: Users, title: "See Who's There", text: "Know who's at the bar before you even walk in" },
      { icon: MapPin, title: "Local Bars", text: "Find singles at popular bars in your area" },
      { icon: MessageCircle, title: "Easy Ice Breakers", text: "Every profile has a conversation starter" },
      { icon: Heart, title: "Real Connections", text: "Meet face-to-face, skip the endless texting" },
    ],
    cta: "Start Meeting People Tonight",
  },
  lounges: {
    headline: "Connect with Singles at Upscale Lounges",
    subheadline: "Discover who's looking to meet someone special at lounges near you.",
    heroEmoji: "🍸",
    benefits: [
      { icon: Users, title: "Quality Crowd", text: "Meet people who appreciate the finer things" },
      { icon: MapPin, title: "Premium Venues", text: "Find singles at the best lounges nearby" },
      { icon: MessageCircle, title: "Smooth Introductions", text: "Conversation starters make approaching easy" },
      { icon: Heart, title: "Meaningful Connections", text: "Connect with people ready for something real" },
    ],
    cta: "Find Your Match Tonight",
  },
  arcade: {
    headline: "Level Up Your Dating Life at Arcades",
    subheadline: "Find fellow gamers and fun-seekers at arcade bars and gaming spots near you.",
    heroEmoji: "🎮",
    benefits: [
      { icon: Users, title: "Gamer Crowd", text: "Meet people who share your love for games" },
      { icon: MapPin, title: "Gaming Spots", text: "Find singles at barcades and arcades nearby" },
      { icon: MessageCircle, title: "Common Ground", text: "Bond over your favorite games instantly" },
      { icon: Heart, title: "Player 2 Found", text: "Find someone who gets your competitive side" },
    ],
    cta: "Find Your Player 2",
  },
};

const defaultContent = {
  headline: "Meet Amazing People Near You",
  subheadline: "Check in at venues to see who's there and ready to connect.",
  heroEmoji: "💕",
  benefits: [
    { icon: Users, title: "Real People", text: "See who's actually at venues near you" },
    { icon: MapPin, title: "Local Venues", text: "Bars, lounges, clubs, and more" },
    { icon: MessageCircle, title: "Ice Breakers", text: "Every profile has a conversation starter" },
    { icon: Heart, title: "Real Connections", text: "Meet face-to-face tonight" },
  ],
  cta: "Get Started Free",
};

export default function WelcomeLanding({ onClick }) {
  const { campaign } = useParams();
  const content = campaignContent[campaign] || defaultContent;

  return (
    <main className="welcome">
      <section className="welcome__hero">
        <span className="welcome__emoji">{content.heroEmoji}</span>
        <h1 className="welcome__headline">{content.headline}</h1>
        <p className="welcome__subheadline">{content.subheadline}</p>
        <button className="welcome__cta" onClick={onClick}>
          {content.cta}
        </button>
      </section>

      <section className="welcome__benefits">
        <h2 className="welcome__section-title">Why BaeQuest?</h2>
        <div className="welcome__benefits-grid">
          {content.benefits.map((benefit, index) => (
            <div key={index} className="welcome__benefit-card">
              <benefit.icon className="welcome__benefit-icon" />
              <h3 className="welcome__benefit-title">{benefit.title}</h3>
              <p className="welcome__benefit-text">{benefit.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="welcome__how-it-works">
        <h2 className="welcome__section-title">How It Works</h2>
        <ol className="welcome__steps">
          <li className="welcome__step">
            <span className="welcome__step-number">1</span>
            <div>
              <h3 className="welcome__step-title">Create Your Profile</h3>
              <p className="welcome__step-text">Sign up free with email or Google</p>
            </div>
          </li>
          <li className="welcome__step">
            <span className="welcome__step-number">2</span>
            <div>
              <h3 className="welcome__step-title">Find a Venue</h3>
              <p className="welcome__step-text">Browse places near your location</p>
            </div>
          </li>
          <li className="welcome__step">
            <span className="welcome__step-number">3</span>
            <div>
              <h3 className="welcome__step-title">Check In & Connect</h3>
              <p className="welcome__step-text">See who's there and make your move</p>
            </div>
          </li>
        </ol>
      </section>

      <section className="welcome__final-cta">
        <h2 className="welcome__final-headline">Ready to Meet Someone?</h2>
        <p className="welcome__final-text">Join thousands of singles making real connections.</p>
        <button className="welcome__cta" onClick={onClick}>
          {content.cta}
        </button>
      </section>
    </main>
  );
}
