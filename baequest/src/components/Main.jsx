import "../blocks/main.css";
import heartlogo from "../assets/heart-logo.svg";
import redcloselogo from "../assets/red-close-logo.png";
import { Users, MessageCircle, Shield, Heart } from "lucide-react";


export default function Main({onClick}) {
  return (
    <main className="main">
      <h1 className="main__title">
        Meet people at places you already go
      </h1>
      <p className="main__text">
        Real dating starts in real places. Check in at lounges, bars, clubs, and venues near you to see who's there and ready to connect.
      </p>
      <button className="main__button" onClick={onClick}>Create Account</button>
      <section className="section1">
        <h3 className="section__title">We're Not a Swipe App</h3>
        <p className="section1__text">
          Say goodbye to endless swiping and hello to real<span className="main__span">
          connections at places you're already at</span>
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
                See real people at real places near you
              </li>
              <li className="section1__card-item">
                Check in at lounges, bars, clubs & more
              </li>
              <li className="section1__card-item">
                Meet face-to-face, skip the texting phase
              </li>
              <li className="section1__card-item">
                Know who's actually there and open to meeting
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
          Whether you're at a lounge, bar, club, arcade, or any venue -<br/>
          see who's checked in and ready to meet. Real connections<br/>
          happen in real places, not through a screen.
        </p>
      </section>
      <section className="section2">
        <h3 className="section__title">How it works</h3>
        <p className="section2__text">
          Discover how our unique approach to dating brings people together
           <span className="section2__span"> through real-world places</span>
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
            <p className="section2__list-header">Find Places Near You</p>
            <p className="section2__list-par">
              Discover lounges, bars, clubs, arcades, and other venues closest
              to your current location.
            </p>
          </li>
          <li className="section2__item">
            {" "}
            <p className="section2__list-header">Check In & See Who's There</p>
            <p className="section2__list-par">
              When you arrive at a venue, check in to see other BaeQuest users
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
          at real places
        </p>
        <div className="section3__benefit">
          <ul className="section3__cards">
            <li className="section3__card">
              <Users className="section3__card-image" />
              <p className="section3__card-title">Real People, Real Places</p>
              <p className="section3__card-par">
                See who's actually at venues near you right now - no fake
                profiles or bots
              </p>
            </li>
            <li className="section3__card">
              <Shield className="section3__card-image" />
              <p className="section3__card-title">Safe & Public</p>
              <p className="section3__card-par">
                Meet at established venues like bars, lounges, and clubs -
                always in public spaces
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
                both ready
              </p>
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}
