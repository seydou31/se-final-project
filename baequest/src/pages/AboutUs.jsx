import "../blocks/legal-pages.css";
import image1 from "../assets/about-us-1.png";
import image2 from "../assets/about-us-2.png";
import image3 from "../assets/about-us-3.png";

export default function AboutUs() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 md:px-8 py-16 sm:py-20 md:py-28 overflow-hidden">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 md:gap-12 items-center">
          {/* Left Content */}
          <div className="z-10 max-w-xl">
            <span className="inline-block px-3 sm:px-4 py-1.5 mb-4 sm:mb-5 bg-primary/40 text-primary text-[10px] sm:text-xs font-bold tracking-widest uppercase rounded-full">
              Our Story
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-black tracking-tight text-on-surface leading-tight mb-5 sm:mb-6">
              About Us
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-on-surface-variant leading-relaxed">
              BaeQuest is reimagining online dating by bringing people together
              at real-world events. We believe that meaningful connections
              happen when you meet people in person, not just through endless
              swiping on profiles.
            </p>
          </div>
          {/* Right Image */}
          <div className="relative">
            <div className="aspect-[4/5] rounded-lg overflow-hidden bg-surface-container-low shadow-2xl">
              <img
                alt="A diverse group of friends laughing together at a chic outdoor evening event"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                src={image1}
              />
            </div>
            {/* Glow */}
            <div className="absolute -bottom-6 -left-6 sm:-bottom-8 sm:-left-8 w-40 sm:w-48 h-40 sm:h-48 bg-primary rounded-full blur-[80px] opacity-20"></div>
          </div>
        </div>
      </section>
      {/* Our Mission (Bento Style adapted) */}
      <section className="px-4 sm:px-6 md:px-8 py-16 sm:py-20 bg-surface-container-low">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
            {/* Our Mission */}
            <div className="md:col-span-7 bg-surface-container-lowest p-6 sm:p-8 md:p-10 lg:p-12 rounded-lg flex flex-col justify-center border border-outline-variant/10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-4 sm:mb-6">
                Our Mission
              </h2>
              <p className="text-base sm:text-lg text-on-surface-variant leading-relaxed">
                BaeQuest is reimagining online dating by bringing people
                together at real-world events. We believe that meaningful
                connections happen when you meet people in person, not just
                through endless swiping on profiles
              </p>
            </div>
            {/* Visual Accent */}
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
            {/* Background Icon */}
            <div className="absolute top-0 right-0 p-4 sm:p-6 md:p-8 opacity-10">
              <span className="material-symbols-outlined text-6xl sm:text-7xl md:text-8xl lg:text-9xl">
                history
              </span>
            </div>
            {/* Content */}
            <div className="relative z-10">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-5 sm:mb-6 md:mb-8">
                Our Story
              </h3>
              <div className="space-y-4 sm:space-y-5 md:space-y-6 text-base sm:text-lg opacity-90 leading-relaxed">
                <p>
                  Instead of judging someone by their photos and bio, BaeQuest
                  connects you with people who are attending the same events as
                  you in the DMV (DC, Maryland, Virginia) area. Check in to an
                  event, see who else is there, and start a real conversation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* How It Works */}
      <section className="px-4 sm:px-6 md:px-8 py-16 sm:py-20 md:py-28 bg-surface">
        {/* Heading */}
        <div className="max-w-4xl mx-auto text-center mb-12 sm:mb-16 md:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight md:tracking-tighter mb-3 sm:mb-4">
            How It Works
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-on-surface-variant max-w-2xl mx-auto">
            Instead of judging someone by their photos and bio, Aura Social
            connects you with people who are attending the same events as you.
          </p>
        </div>
        {/* Steps */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-12 md:gap-16 relative">
            {/* Connector Line */}
            <div className="hidden md:block absolute top-1/4 left-0 w-full h-[1px] bg-outline-variant opacity-20 -z-10"></div>
            {/* Step 1 */}
            <div className="text-center group">
              <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-surface-container-low rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 transition-all group-hover:bg-primary group-hover:text-white">
                <span className="text-lg sm:text-xl md:text-2xl font-black">
                  01
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-on-surface">
                Discover Events
              </h3>
              <p className="text-sm sm:text-base text-on-surface-variant">
                Browse local events in your area that match your vibe.
              </p>
            </div>
            {/* Step 2 */}
            <div className="text-center group">
              <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-surface-container-low rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 transition-all group-hover:bg-primary group-hover:text-white">
                <span className="text-lg sm:text-xl md:text-2xl font-black">
                  02
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-on-surface">
                Check In
              </h3>
              <p className="text-sm sm:text-base text-on-surface-variant">
                Check in to an event, see who else is there, and start a real
                conversation.
              </p>
            </div>
            {/* Step 3 */}
            <div className="text-center group">
              <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-surface-container-low rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 transition-all group-hover:bg-primary group-hover:text-white">
                <span className="text-lg sm:text-xl md:text-2xl font-black">
                  03
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-on-surface">
                Real Connections
              </h3>
              <p className="text-sm sm:text-base text-on-surface-variant">
                Meet people face-to-face in a natural, low-pressure environment.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Why BaeQuest? */}
      <section className="px-4 sm:px-6 md:px-8 py-16 sm:py-20 bg-surface-container-lowest border-y border-outline-variant/10">
        <div className="max-w-7xl mx-auto">
          <div className="bg-surface-container-highest p-6 sm:p-8 md:p-10 lg:p-12 rounded-lg">
            {/* Heading */}
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-8 sm:mb-10 md:mb-12 text-center">
              Why BaeQuest?
            </h3>
            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {/* Card 1 */}
              <div className="space-y-3 sm:space-y-4 bg-surface p-5 sm:p-6 rounded-lg shadow-sm transition-all duration-300 hover:-translate-y-2">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-base sm:text-lg">
                    verified_user
                  </span>
                </div>
                <h4 className="font-bold text-base sm:text-lg">
                  Real connections
                </h4>
                <p className="text-xs sm:text-sm text-on-surface-variant">
                  Meet people face-to-face at events you both enjoy.
                </p>
              </div>
              {/* Card 2 */}
              <div className="space-y-3 sm:space-y-4 bg-surface p-5 sm:p-6 rounded-lg shadow-sm  transition-all duration-300 hover:-translate-y-2">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-base sm:text-lg">
                    groups
                  </span>
                </div>
                <h4 className="font-bold text-base sm:text-lg">
                  Shared interests
                </h4>
                <p className="text-xs sm:text-sm text-on-surface-variant">
                  You're already at the same event, so you have something in
                  common.
                </p>
              </div>
              {/* Card 3 */}
              <div className="space-y-3 sm:space-y-4 bg-surface p-5 sm:p-6 rounded-lg shadow-sm  transition-all duration-300 hover:-translate-y-2">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-base sm:text-lg">
                    celebration
                  </span>
                </div>
                <h4 className="font-bold text-base sm:text-lg">
                  No more awkward first dates
                </h4>
                <p className="text-xs sm:text-sm text-on-surface-variant">
                  The event IS the first date. Skip the coffee shop interview.
                </p>
              </div>
              {/* Card 4 */}
              <div className="space-y-3 sm:space-y-4 bg-surface p-5 sm:p-6 rounded-lg shadow-sm  transition-all duration-300 hover:-translate-y-2">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-base sm:text-lg">
                    health_and_safety
                  </span>
                </div>
                <h4 className="font-bold text-base sm:text-lg">Safety first</h4>
                <p className="text-xs sm:text-sm text-on-surface-variant">
                  Public venues mean safer meetings and vetted communities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Join the Quest (CTA) */}
      <section className="px-4 sm:px-6 md:px-8 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#bd0c3b] rounded-lg p-6 sm:p-8 md:p-12 lg:p-20 xl:p-24 text-center text-on-primary overflow-hidden relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <img
                alt="Abstract dynamic pattern"
                className="w-full h-full object-cover"
                src={image3}
              />
            </div>
            {/* Content */}
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight md:tracking-tighter mb-5 sm:mb-6 md:mb-8">
                Join the BaeQuest
              </h2>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl opacity-90 mb-8 sm:mb-10 md:mb-12 max-w-xl sm:max-w-2xl mx-auto leading-relaxed">
                Whether you're looking for love, friendship, or just someone to
                enjoy events with, Aura Social is here to help you find your
                people.
              </p>

              {/* CTA Button */}
              <button className="w-full sm:w-auto bg-white text-primary px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-xl text-base sm:text-lg md:text-xl font-bold hover:bg-gray-50 hover:-translate-y-1 active:scale-95 transition-all duration-300 shadow-lg">
                Create Your Profile
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
