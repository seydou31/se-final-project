import "../blocks/main.css";
import heartlogo from "../assets/heart-logo.svg";
import redcloselogo from "../assets/red-close-logo.png";
import { Users, MessageCircle, Shield, Heart } from "lucide-react";


export default function Main({onClick}) {
  return (
    <main className="main">
      <h1 className="main__title">
        Meet people at events made for singles
      </h1>
      <p className="main__text">
        Real dating starts in real life. Browse curated singles events near you, RSVP to let others know you're going, and check in when you arrive to see who's there.
      </p>
      <button className="main__button" onClick={onClick}>Create Account</button>
      <section className="section1">
        <h3 className="section__title">We're Not a Swipe App</h3>
        <p className="section1__text">
          Say goodbye to endless swiping and hello to real<span className="main__span">
          connections at events you actually want to attend</span>
        </p>
        <div className="section1__cards">
          <div className="section1__card">
            <img
              src={redcloselogo}
              alt="red-close-logo"
              className="section1__card-image"
            />
            <p className="section1__card-text section1__card-text_color_brown">
              Dating Apps
            </p>
            <ul className="section1__card-list">
              <li className="section1__card-item">
                Endless swiping through curated photos
              </li>
              <li className="section1__card-item">
                Matches that never respond or ghost
              </li>
              <li className="section1__card-item">
                Weeks of texting before meeting
              </li>
              <li className="section1__card-item">
                Profiles that don't match reality
              </li>
              <li className="section1__card-item">
                Expensive subscriptions for basic features
              </li>
            </ul>
          </div>
          <div className="section1__card">
            <img
              src={heartlogo}
              alt="heart-logo"
              className="section1__card-image"
            />
            <p className="section1__card-text section1__card-text_color_pink">
              BaeQuest
            </p>
            <ul className="section1__card-list">
              <li className="section1__card-item">
                Browse curated singles events near you
              </li>
              <li className="section1__card-item">
                RSVP so others know you're going
              </li>
              <li className="section1__card-item">
                Check in when you arrive to see who's there
              </li>
              <li className="section1__card-item">
                Meet face-to-face, skip the texting phase
              </li>
              <li className="section1__card-item">
                Conversation starters to break the ice
              </li>
              <li className="section1__card-item">
                Free to use - connect without limits
              </li>
            </ul>
          </div>
        </div>
        <p className="section1__highlight">
          <span className="section1__summary">Experience the difference: </span>
          Find events designed for singles, RSVP to show you're going,<br/>
          and check in when you arrive. See who else is there and<br/>
          make a real connection — no screen required.
        </p>
      </section>
      <section className="section2">
        <h3 className="section__title">How it works</h3>
        <p className="section2__text">
          Discover how our unique approach to dating brings people together
           <span className="section2__span"> through real-world events</span>
        </p>
        <ol className="section2__list">
          <li className="section2__item">
            <p className="section2__list-header">Create Your Profile</p>
            <p className="section2__list-par">
              Sign up with email or Google. Add a photo, share your interests,
              and write a conversation starter.
            </p>
          </li>
          <li className="section2__item">
            {" "}
            <p className="section2__list-header">Browse Events Near You</p>
            <p className="section2__list-par">
              Discover curated singles events sorted by distance. RSVP to events
              you're interested in so others know you're going.
            </p>
          </li>
          <li className="section2__item">
            {" "}
            <p className="section2__list-header">Check In & See Who's There</p>
            <p className="section2__list-par">
              When you arrive at the event, check in to see other BaeQuest users
              who are there and open to meeting.
            </p>
          </li>
          <li className="section2__item">
            {" "}
            <p className="section2__list-header">Make Your Move</p>
            <p className="section2__list-par">
              Use their conversation starter to break the ice. No awkward
              openers - you already know what to talk about.
            </p>
          </li>
        </ol>
        <button onClick={onClick} className="main__button">Create Account</button>
      </section>
      <section className="section3">
        <h3 className="section__title">Why Choose BaeQuest?</h3>
        <p className="section3__text">
          Experience a better way to meet people through authentic connections
          at real events
        </p>
        <div className="section3__benefit">
          <ul className="section3__cards">
            <li className="section3__card">
              <Users className="section3__card-image" />
              <p className="section3__card-title">Real People, Real Events</p>
              <p className="section3__card-par">
                See who's actually at the event right now — no fake
                profiles or bots
              </p>
            </li>
            <li className="section3__card">
              <Shield className="section3__card-image" />
              <p className="section3__card-title">Safe & Social</p>
              <p className="section3__card-par">
                Meet at curated public events — always in safe,
                social environments with other singles
              </p>
            </li>
            <li className="section3__card">
              <MessageCircle className="section3__card-image" />
              <p className="section3__card-title">Built-in Ice Breakers</p>
              <p className="section3__card-par">
                Every profile has a conversation starter - you'll always know
                how to approach someone
              </p>
            </li>
            <li className="section3__card">
              <Heart className="section3__card-image" />
              <p className="section3__card-title">Instant Connections</p>
              <p className="section3__card-par">
                Skip weeks of texting - meet face-to-face the moment you're
                both at the same event
              </p>
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}
