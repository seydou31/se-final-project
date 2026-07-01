import { Link } from "react-router-dom";
import "../blocks/legal-pages.css";
import image1 from "../assets/about-us-1.png";
import image2 from "../assets/about-us-2.png";
import image3 from "../assets/about-us-3.png";

export default function AboutUs() {
  return (
    <>
      {/* Hero */}
      <section className="relative px-4 sm:px-6 md:px-8 py-16 sm:py-20 md:py-28 overflow-hidden">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 md:gap-12 items-center">
          <div className="z-10 max-w-xl">
            <span className="inline-block px-3 sm:px-4 py-1.5 mb-4 sm:mb-5 bg-primary/40 text-primary text-[10px] sm:text-xs font-bold tracking-widest uppercase rounded-full">
              Our Story
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-black tracking-tight text-on-surface leading-tight mb-5 sm:mb-6">
              About BaeQuest
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-on-surface mb-4">
              Helping singles meet naturally in real life.
            </p>
            <p className="text-base sm:text-lg md:text-xl text-on-surface-variant leading-relaxed">
              We believe the best connections don't start with endless swiping.
              They start when two people choose the same place, on the same
              night, and have a reason to start a conversation.
            </p>
          </div>
          <div className="relative">
            <div className="aspect-[4/5] rounded-lg overflow-hidden bg-surface-container-low shadow-2xl">
              <img
                alt="A diverse group of friends laughing together at a chic outdoor evening event"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                src={image1}
              />
            </div>
            <div className="absolute -bottom-6 -left-6 sm:-bottom-8 sm:-left-8 w-40 sm:w-48 h-40 sm:h-48 bg-primary rounded-full blur-[80px] opacity-20" />
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="px-4 sm:px-6 md:px-8 py-16 sm:py-20 bg-surface-container-low">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
            <div className="md:col-span-7 bg-surface-container-lowest p-6 sm:p-8 md:p-10 lg:p-12 rounded-lg flex flex-col justify-center border border-outline-variant/10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3 sm:mb-4">
                Our Mission
              </h2>
              <p className="text-lg sm:text-xl font-semibold text-on-surface mb-4 sm:mb-6">
                Bringing real life back to meeting people.
              </p>
              <p className="text-base sm:text-lg text-on-surface-variant leading-relaxed mb-4">
                Dating apps made meeting people feel like a game of profiles and
                messages. We think there's a better way.
              </p>
              <p className="text-base sm:text-lg text-on-surface-variant leading-relaxed">
                BaeQuest helps singles discover who's already around them at
                bars, lounges, arcades, and other social venues. By showing you
                who's there only after you arrive, every connection begins where
                it matters most—in person.
              </p>
            </div>
            <div className="md:col-span-5 aspect-[4/3] sm:aspect-[4/3] md:aspect-auto rounded-lg overflow-hidden shadow-sm">
              <img
                alt="Close-up of two people clinking glasses"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                src={image2}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="px-4 sm:px-6 md:px-8 py-16 sm:py-20 md:py-24 bg-surface">
        <div className="max-w-4xl mx-auto">
          <div className="bg-primary text-on-primary p-6 sm:p-8 md:p-10 lg:p-12 rounded-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 sm:p-6 md:p-8 opacity-10">
              <span className="material-symbols-outlined text-6xl sm:text-7xl md:text-8xl lg:text-9xl">
                history
              </span>
            </div>
            <div className="relative z-10">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-5 sm:mb-6 md:mb-8">
                Our Story
              </h3>
              <div className="space-y-4 sm:space-y-5 text-base sm:text-lg opacity-90 leading-relaxed">
                <p>
                  Every weekend, thousands of singles go out hoping to meet
                  someone.
                </p>
                <p className="font-semibold">
                  The problem isn't that people aren't leaving the house.
                </p>
                <p className="font-semibold">The problem is uncertainty.</p>
                <ul className="space-y-2 pl-4 border-l-2 border-on-primary/30">
                  <li>You don't know who's single.</li>
                  <li>You don't know who's open to meeting someone.</li>
                </ul>
                <p>
                  So most people stay with the friends they came with, scroll on
                  their phones, or leave without ever starting the conversation.
                </p>
                <p>We built BaeQuest to remove that uncertainty.</p>
                <p>
                  Instead of replacing real life, BaeQuest enhances it by
                  helping you discover other singles who chose the same place at
                  the same time.
                </p>
                <p className="font-bold text-lg sm:text-xl">
                  BaeQuest doesn't change where you go. It changes what you
                  know when you get there.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 sm:px-6 md:px-8 py-16 sm:py-20 md:py-28 bg-surface">
        <div className="max-w-4xl mx-auto text-center mb-12 sm:mb-16 md:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight md:tracking-tighter mb-3 sm:mb-4">
            How It Works
          </h2>
        </div>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-12 md:gap-16 relative">
            <div className="hidden md:block absolute top-1/4 left-0 w-full h-[1px] bg-outline-variant opacity-20 -z-10" />
            {/* Step 1 */}
            <div className="text-center group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-surface-container-low rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 transition-all group-hover:bg-primary group-hover:text-white">
                <span className="text-lg sm:text-2xl font-black">01</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-on-surface">
                Pick a place
              </h3>
              <p className="text-sm sm:text-base text-on-surface-variant">
                Choose a nearby venue where other singles are planning to go.
              </p>
            </div>
            {/* Step 2 */}
            <div className="text-center group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-surface-container-low rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 transition-all group-hover:bg-primary group-hover:text-white">
                <span className="text-lg sm:text-2xl font-black">02</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-on-surface">
                Check in
              </h3>
              <p className="text-sm sm:text-base text-on-surface-variant">
                When you arrive, check in to unlock the room and see other
                singles who are there.
              </p>
            </div>
            {/* Step 3 */}
            <div className="text-center group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-surface-container-low rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 transition-all group-hover:bg-primary group-hover:text-white">
                <span className="text-lg sm:text-2xl font-black">03</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-on-surface">
                Start the conversation
              </h3>
              <p className="text-sm sm:text-base text-on-surface-variant">
                Learn a little about someone before you walk over. The rest
                isn't up to an algorithm—it's up to you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why BaeQuest? */}
      <section className="px-4 sm:px-6 md:px-8 py-16 sm:py-20 bg-surface-container-lowest border-y border-outline-variant/10">
        <div className="max-w-7xl mx-auto">
          <div className="bg-surface-container-highest p-6 sm:p-8 md:p-10 lg:p-12 rounded-lg">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-8 sm:mb-10 md:mb-12 text-center">
              Why BaeQuest?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              <div className="space-y-3 sm:space-y-4 bg-surface p-5 sm:p-6 rounded-lg shadow-sm transition-all duration-300 hover:-translate-y-2">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-base sm:text-lg">location_on</span>
                </div>
                <h4 className="font-bold text-base sm:text-lg">Real people</h4>
                <p className="text-xs sm:text-sm text-on-surface-variant">
                  Meet singles who are actually there—not people hundreds of
                  miles away.
                </p>
              </div>
              <div className="space-y-3 sm:space-y-4 bg-surface p-5 sm:p-6 rounded-lg shadow-sm transition-all duration-300 hover:-translate-y-2">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-base sm:text-lg">handshake</span>
                </div>
                <h4 className="font-bold text-base sm:text-lg">Shared context</h4>
                <p className="text-xs sm:text-sm text-on-surface-variant">
                  You're already in the same place at the same time, giving you
                  a natural reason to start talking.
                </p>
              </div>
              <div className="space-y-3 sm:space-y-4 bg-surface p-5 sm:p-6 rounded-lg shadow-sm transition-all duration-300 hover:-translate-y-2">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-base sm:text-lg">exit_to_app</span>
                </div>
                <h4 className="font-bold text-base sm:text-lg">Real-world first</h4>
                <p className="text-xs sm:text-sm text-on-surface-variant">
                  The goal isn't to keep you on the app. It's to get you off it.
                </p>
              </div>
              <div className="space-y-3 sm:space-y-4 bg-surface p-5 sm:p-6 rounded-lg shadow-sm transition-all duration-300 hover:-translate-y-2">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-base sm:text-lg">visibility_off</span>
                </div>
                <h4 className="font-bold text-base sm:text-lg">Privacy by design</h4>
                <p className="text-xs sm:text-sm text-on-surface-variant">
                  Your profile is only visible while you're checked in. Leave
                  the venue, and you disappear.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Join BaeQuest CTA */}
      <section className="px-4 sm:px-6 md:px-8 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#bd0c3b] rounded-lg p-6 sm:p-8 md:p-12 lg:p-20 xl:p-24 text-center text-on-primary overflow-hidden relative">
            <div className="absolute inset-0 opacity-10">
              <img
                alt="Abstract dynamic pattern"
                className="w-full h-full object-cover"
                src={image3}
              />
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight md:tracking-tighter mb-5 sm:mb-6 md:mb-8">
                Join BaeQuest
              </h2>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl opacity-90 mb-4 sm:mb-5 max-w-xl sm:max-w-2xl mx-auto leading-relaxed">
                Whether you're looking for a relationship, new connections, or
                simply a better way to meet other singles, BaeQuest helps turn
                nights out into opportunities to meet real people.
              </p>
              <p className="text-lg sm:text-xl md:text-2xl font-bold opacity-90 mb-8 sm:mb-10 md:mb-12">
                Meet singles in real life. Not on a screen.
              </p>
              <Link
                to="/signup"
                className="inline-block w-full sm:w-auto bg-white text-primary px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-xl text-base sm:text-lg md:text-xl font-bold hover:bg-gray-50 hover:-translate-y-1 active:scale-95 transition-all duration-300 shadow-lg"
              >
                Create Your Profile
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
