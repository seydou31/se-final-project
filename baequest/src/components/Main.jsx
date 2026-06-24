import "../blocks/main.css";
import baequestUser from "../assets/baequestUser.png";

export default function Main({ onClick }) {
  return (
    <main>
      {/* ── Hero ── */}
      <section className="px-4 sm:px-6 py-12 sm:py-16 md:py-24 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-10 md:gap-12 items-center">
          <div className="order-2 md:order-1 text-center md:text-left">
            <h1 className="font-headline text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight md:leading-none mb-4 sm:mb-6">
              Meet people locally.<span className="text-primary">pick a vibe</span> see who's there.
            </h1>
            <p className="text-on-surface-variant text-base sm:text-lg md:text-xl leading-relaxed max-w-md mx-auto md:mx-0">
              Walking into a room full of strangers is uncomfortable — Because You don't know who to approach.
            </p>
            <p className="text-on-surface-variant text-small mt-6 mb-6 sm:mb-8 md:mb-10 leading-relaxed max-w-md mx-auto md:mx-0">
              BaeQuest gives you that context. Mark a nearby bar or arcade as
              your plan for tonight. Show up. Check in. The app shows you singles in that room. 
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start">
              <button
                onClick={onClick}
                className="w-full sm:w-auto bg-primary text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-bold shadow-xl hover:bg-primary-dim hover:-translate-y-1 active:scale-95 transition-all duration-300"
              >
                Find places near me tonight
              </button>
            </div>
          </div>
          <div className="order-1 md:order-2 relative group">
            <div className="rounded-xl overflow-hidden shadow-2xl">
              <img
                alt="Friends laughing at a singles event"
                className="w-full h-[300px] sm:h-[400px] md:h-auto md:aspect-square object-cover transition-transform duration-700 group-hover:scale-105"
                src={baequestUser}
              />
            </div>
            <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 bg-white p-4 sm:p-6 rounded-lg shadow-lg hidden sm:block max-w-[180px] sm:max-w-[200px]">
              <p className="text-primary font-bold text-base sm:text-lg leading-tight">
                Next Event: Friday Night Mix
              </p>
              <p className="text-on-surface-variant text-xs sm:text-sm mt-1">
                $3 · 24 people going
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── The Real Problem ── */}
      <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 bg-surface-container-low overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-14 lg:gap-20 items-start">
            {/* Left Content */}
            <div className="text-center lg:text-left order-1">
              <span className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-[11px] sm:text-sm font-semibold tracking-wide uppercase mb-5">
                The Real Problem
              </span>

              <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-5 sm:mb-6">
                It's not that you
                <br className="hidden sm:block" />
                struggle to meet people.
                <br />
                <span className="text-primary italic">
                  It's that walking in cold is hard.
                </span>
              </h2>

              <div className="space-y-4 sm:space-y-5 text-on-surface-variant text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0">
                <p>
                  Most people aren't lonely because they don't go out. They
                  already go to bars, cafes, arcades, and familiar places.
                  <span className="font-medium text-on-surface">
                    {" "}
                    The room is already full of people.
                  </span>
                </p>

                <p>
                  The problem is context. You don’t know who's open to talking.
                  You don’t know who to approach. So you stay with who you came
                  with — or stay on your phone — and the room full of people
                  stays a room full of strangers.
                </p>

                {/* Highlight Card */}
                <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-primary/10 shadow-sm hover:shadow-md transition-all duration-300">
                  <p className="font-medium text-on-surface text-base sm:text-lg md:text-xl leading-relaxed">
                    BaeQuest doesn't change where you go.
                    <span className="text-primary">
                      {" "}
                      It changes what you know when you get there.
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Right Cards */}
            <div className="space-y-4 sm:space-y-5 order-2">
              {[
                {
                  icon: "sentiment_stressed",
                  title: "Walking in alone",
                  text: "No face to look for. No reason to approach. You order a drink and wonder if tonight was a good idea.",
                },
                {
                  icon: "volume_off",
                  title: "Not knowing who's open to talking",
                  text: "Everyone looks occupied. There's no signal that someone else is here for the same reason you are.",
                },
                {
                  icon: "phonelink_erase",
                  title: "Surrounded by people, still disconnected",
                  text: "The room is full. You're on your own. The gap between those two things is exactly what BaeQuest closes.",
                },
                {
                  icon: "check_circle",
                  title: "BaeQuest gives you context",
                  text: "You know who's open to talking and have enough context to start a conversation naturally",
                  featured: true,
                },
              ].map(({ icon, title, text, featured }) => (
                <div
                  key={title}
                  className={`group rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-7 transition-all duration-300 hover:-translate-y-1 ${
                    featured
                      ? "bg-primary text-white shadow-xl"
                      : "bg-white border border-gray-100 shadow-sm hover:shadow-md"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row gap-4 items-start">
                    {/* Icon */}
                    <div
                      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 ${
                        featured
                          ? "bg-white/10 text-white"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      <span className="material-symbols-outlined text-xl sm:text-2xl">
                        {icon}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h4
                        className={`font-bold text-base sm:text-lg md:text-xl mb-2 ${
                          featured ? "text-white" : "text-on-surface"
                        }`}
                      >
                        {title}
                      </h4>

                      <p
                        className={`text-sm sm:text-base leading-relaxed ${
                          featured ? "text-white/80" : "text-on-surface-variant"
                        }`}
                      >
                        {text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works / Mechanic ── */}
      <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 bg-surface-container-low overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Heading */}
          <div className="text-center mb-10 sm:mb-14 md:mb-16">
            <span className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-[11px] sm:text-sm font-semibold tracking-wide uppercase mb-4">
              How It Works
            </span>

            <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
              Two moments.
              <br />
              Everything changes{" "}
              <span className="text-primary italic">at the second one.</span>
            </h2>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-8">
            {/* Step 1 */}
            <div className="group bg-white rounded-[28px] p-6 sm:p-8 md:p-10 border border-gray-100 shadow-sm hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(42,52,57,0.10)] transition-all duration-300">
              {/* Badge */}
              <div className="inline-flex items-center rounded-full bg-primary/10 text-primary px-4 py-2 text-xs sm:text-sm font-semibold mb-6">
                From home
              </div>

              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <span className="material-symbols-outlined text-2xl">
                  explore
                </span>
              </div>

              {/* Title */}
              <h3 className="font-bold text-2xl sm:text-3xl leading-tight mb-4">
                Mark yourself as going
              </h3>

              {/* Why */}
              <div className="rounded-2xl bg-primary/5 border border-primary/10 p-4 sm:p-5 mb-5">
                <p className="text-primary font-semibold text-sm sm:text-base">
                  So you have a plan — and a reason to actually follow through.
                </p>
              </div>

              {/* Description */}
              <p className="text-on-surface-variant text-sm sm:text-base leading-relaxed mb-6">
                Browse nearby bars, arcades, cafes. Pick one. Tap{" "}
                <span className="font-semibold text-primary">“I'm going.”</span>{" "}
                You can see that some people are going — but not who. The names
                stay hidden until you're physically there.
              </p>

              {/* Note */}
              <div className="rounded-2xl bg-surface-container border border-primary/10 p-5">
                <div className="flex gap-3 items-start">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined">lock</span>
                  </div>

                  <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
                    You can see that{" "}
                    <span className="font-semibold text-on-surface">
                      people are going
                    </span>{" "}
                    — but not who. The reveal happens in real life, not on your
                    sofa.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="group relative overflow-hidden bg-primary rounded-[28px] p-6 sm:p-8 md:p-10 text-white shadow-2xl hover:-translate-y-2 transition-all duration-300">
              {/* Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

              {/* Badge */}
              <div className="relative z-10 inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-xs sm:text-sm font-semibold mb-6">
                When you arrive
              </div>

              {/* Icon */}
              <div className="relative z-10 w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <span className="material-symbols-outlined text-2xl">
                  groups
                </span>
              </div>

              {/* Title */}
              <h3 className="relative z-10 font-bold text-2xl sm:text-3xl leading-tight mb-4">
                Check in.
                <br />
                The room opens up.
              </h3>

              {/* Why */}
              <div className="relative z-10 rounded-2xl bg-white/10 border border-white/10 p-4 sm:p-5 mb-5 backdrop-blur-sm">
                <p className="font-semibold text-sm sm:text-base text-white">
                  So you're no longer a stranger — and neither are they.
                </p>
              </div>

              {/* Description */}
              <p className="relative z-10 text-white/80 text-sm sm:text-base leading-relaxed mb-6">
                Walk through the door. Open BaeQuest. Check in. Everyone else
                who's checked in at the same place right now appears — and you
                appear to them. 
              </p>

              {/* Note */}
              <div className="relative z-10 rounded-2xl bg-white/10 border border-white/10 p-5 backdrop-blur-sm">
                <div className="flex gap-3 items-start">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined">
                      auto_awesome
                    </span>
                  </div>

                  <p className="text-sm sm:text-base text-white/80 leading-relaxed">
                    You leave? You disappear. Your check-in is live only while
                    you're there.
                    <span className="font-semibold text-white">
                      {" "}
                      No passive profile.
                    </span>{" "}
                    No tracking when you're home.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ── How It Works ── */}
      <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 bg-surface-container-low overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Heading */}
          <div className="text-center mb-10 sm:mb-14 md:mb-20">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-semibold tracking-wide uppercase mb-4">
              The full flow
            </span>

            <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-4">
              From the sofa
              <span className="text-primary italic">to the conversation.</span>
            </h2>

            <p className="text-on-surface-variant text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              Every step is designed to close the distance between you and the
              room — until closing it is the only thing left to do.
            </p>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 sm:gap-6">
            {[
              {
                num: "01",
                icon: "explore",
                title: "Browse nearby places",
                text: "See bars, arcades, cafes, and venues near you that are active tonight. Filter by type, distance, or vibe.",
              },
              {
                num: "02",
                icon: "check_circle",
                title: "Mark yourself as going",
                text: "Commit to a place. You'll know people are heading there — but not who until you're actually there.",
              },
              {
                num: "03",
                icon: "location_on",
                title: "Arrive & check in",
                text: "Walk in. Open BaeQuest. Check in. The room unlocks — now you can see everyone who's checked in.",
                featured: true,
              },
              {
                num: "04",
                icon: "forum",
                title: "Say hello — in app or real life",
                text: "Break the ice with a message or just walk over. You're already in the same room.",
              },
            ].map(({ num, icon, title, text, featured }) => (
              <div
                key={num}
                className={`group relative rounded-2xl sm:rounded-3xl p-6 sm:p-7 md:p-8 transition-all duration-300 hover:-translate-y-2 ${
                  featured
                    ? "bg-primary text-white shadow-xl"
                    : "bg-white border border-gray-100 shadow-sm hover:shadow-md"
                }`}
              >
                {/* Large Background Number */}
                <div
                  className={`absolute top-4 right-5 text-5xl sm:text-6xl font-headline font-black opacity-10 pointer-events-none select-none ${
                    featured ? "text-white" : "text-primary"
                  }`}
                >
                  {num}
                </div>

                {/* Icon */}
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 ${
                    featured
                      ? "bg-white/10 text-white"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  <span className="material-symbols-outlined text-2xl">
                    {icon}
                  </span>
                </div>

                {/* Title */}
                <h4
                  className={`font-bold text-lg sm:text-xl mb-3 leading-snug ${
                    featured ? "text-white" : "text-on-surface"
                  }`}
                >
                  {title}
                </h4>

                {/* Description */}
                <p
                  className={`text-sm sm:text-base leading-relaxed ${
                    featured ? "text-white/80" : "text-on-surface-variant"
                  }`}
                >
                  {text}
                </p>

                {/* Featured Badge */}
                {featured && (
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-xs font-semibold mt-5">
                    ✨ This is where it happens
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* ── Problem / Why This Exists ── */}
      <section className="bg-[#111111] py-12 sm:py-16 md:py-24 px-4 sm:px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-14 lg:gap-20 items-start">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <span className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-white/10 text-primary text-[11px] sm:text-sm font-semibold tracking-wide uppercase mb-5">
                Why meeting people feels hard
              </span>

              <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight text-white mb-5 sm:mb-6">
                Dating apps kept you
                <br />
                <span className="italic text-primary">on the app.</span>
              </h2>

              <p className="text-white/60 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0 mb-8">
                BaeQuest isn't trying to fix dating apps. It's asking a
                different question:
                <span className="text-white font-medium">
                  {" "}
                  what if meeting people started with being in the same room,
                  not the same algorithm?
                </span>
              </p>

              {/* Quote Card */}
              <div className="bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-6 backdrop-blur-sm">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-2xl">
                      format_quote
                    </span>
                  </div>

                  <blockquote className="text-white text-base sm:text-lg italic leading-relaxed">
                    “The spark happens in the room.
                    <span className="text-primary">
                      {" "}
                      BaeQuest just makes sure you're in the right one.
                    </span>
                    ”
                  </blockquote>
                </div>
              </div>
            </div>

            {/* Right Cards */}
            <div className="space-y-4 sm:space-y-5">
              {[
                {
                  icon: "smartphone",
                  title: "Swiping never told you if you'd click",
                  text: "Three photos and a bio. You build a version of someone in your head that may have nothing to do with the person.",
                },
                {
                  icon: "visibility_off",
                  title: "Ghosting before it even starts",
                  text: "Great conversation, then silence. Without a real moment between you, there's nothing holding the connection together.",
                },
                {
                  icon: "sentiment_stressed",
                  title: "No context for the cold approach",
                  text: "Walking up to a stranger with no signal they're open to it — no shared reason, no common ground — is genuinely hard for most people.",
                },
                {
                  icon: "check_circle",
                  title: "BaeQuest gives you that common ground",
                  text: "You both chose the same place on the same night. That's the signal. That's enough to start with.",
                  featured: true,
                },
              ].map(({ icon, title, text, featured }) => (
                <div
                  key={title}
                  className={`group rounded-2xl sm:rounded-3xl p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 ${
                    featured
                      ? "bg-primary text-white shadow-2xl"
                      : "bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/[0.07]"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row gap-4 items-start">
                    {/* Icon */}
                    <div
                      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 ${
                        featured
                          ? "bg-white/10 text-white"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      <span className="material-symbols-outlined text-xl sm:text-2xl">
                        {icon}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h4
                        className={`font-bold text-base sm:text-lg md:text-xl mb-2 ${
                          featured ? "text-white" : "text-white"
                        }`}
                      >
                        {title}
                      </h4>

                      <p
                        className={`text-sm sm:text-base leading-relaxed ${
                          featured ? "text-white/80" : "text-white/60"
                        }`}
                      >
                        {text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Features / Why It Works ── */}
      <section
        id="features"
        className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 bg-background overflow-hidden"
      >
        <div className="max-w-7xl mx-auto">
          {/* Heading */}
          <div className="text-center mb-10 sm:mb-14 md:mb-16">
            <span className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-[11px] sm:text-sm font-semibold tracking-wide uppercase mb-4">
              Why It Works
            </span>

            <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-4">
              Every feature exists
              <br />
              <span className="text-primary italic">to close the gap.</span>
            </h2>

            <p className="text-on-surface-variant text-sm sm:text-base md:text-lg leading-relaxed max-w-3xl mx-auto">
              Between you and the room. Between the plan and the follow-through.
              Between the stranger and the person you end up talking to for two
              hours.
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {/* Hero Card */}
            <div className="md:col-span-2 relative overflow-hidden rounded-[28px] bg-primary text-white p-6 sm:p-8 md:p-12 shadow-2xl hover:-translate-y-1 transition-all duration-300">
              {/* Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

              <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-center">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs sm:text-sm font-semibold mb-5">
                    ✨ Core Experience
                  </span>

                  <h3 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
                    The reveal happens
                    <br />
                    <span className="italic text-white/90">in real life.</span>
                  </h3>
                </div>

                <p className="text-white/80 text-sm sm:text-base md:text-lg leading-relaxed">
                  You don't see who's going until you physically check in. This
                  is intentional. It rewards showing up. It creates anticipation
                  —
                  <span className="font-semibold text-white">
                    {" "}
                    “I wonder who's there.”
                  </span>{" "}
                  And every connection starts with a real-world moment — not a
                  profile picture you've stared at for a week.
                </p>
              </div>
            </div>

            {[
              {
                icon: "visibility_off",
                title: "You leave? You disappear.",
                text: "Your profile is visible only while you're checked in. No passive browsing. No tracking after you go home. You're present when you're present.",
              },
              {
                icon: "my_location",
                title: "You both chose to be there",
                text: "Everyone you see picked the same spot tonight. That's already something in common — before either of you says a word.",
              },
              {
                icon: "shield",
                title: "We don't label what you're looking for",
                text: "BaeQuest is for meeting people. What that becomes — conversation, friendship, or more — is yours to figure out.",
              },
              {
                icon: "groups",
                title: "Already out with friends? Still works.",
                text: "Check in as normal and see who else is around. BaeQuest doesn’t require a solo night — just curiosity.",
              },
            ].map(({ icon, title, text }) => (
              <div
                key={title}
                className="group bg-white border border-gray-100 rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-7 shadow-sm hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(42,52,57,0.10)] transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  {/* Icon */}
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110">
                    <span className="material-symbols-outlined text-xl sm:text-2xl">
                      {icon}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-base sm:text-lg md:text-xl mb-2 text-on-surface group-hover:text-primary transition-colors duration-300">
                      {title}
                    </h3>

                    <p className="text-on-surface-variant text-sm sm:text-base leading-relaxed">
                      {text}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="px-4 sm:px-6 py-12 sm:py-16 md:py-24 max-w-7xl mx-auto">
        <div className="max-w-5xl mx-auto rounded-[28px] bg-primary p-6 sm:p-8 md:p-12 text-center text-white shadow-2xl relative overflow-hidden">
          {/* Decorative blobs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

          {/* Content */}
          <div className="relative z-10">
            <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 sm:mb-5 leading-tight">
              Show up. See who's there.
            </h2>

            <p className="text-base sm:text-lg md:text-xl opacity-90 max-w-2xl mx-auto mb-8 leading-relaxed">
              Mark yourself as going. Walk in. Check in. The rest isn't up to an
              algorithm —
              <span className="font-semibold text-white"> it's up to you.</span>
            </p>

            {/* Pricing Value */}
            <div className="max-w-3xl mx-auto bg-white/10 border border-white/10 backdrop-blur-sm rounded-3xl p-5 sm:p-6 md:p-7 mb-8 sm:mb-10">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 mb-4">
                <span className="text-4xl sm:text-5xl font-black tracking-tight">
                  $3
                </span>

                <div className="text-center sm:text-left">
                  <p className="font-bold text-lg sm:text-xl">
                    when you arrive.
                  </p>
                  <p className="text-white/70 text-sm sm:text-base">
                    Less than a drink.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm sm:text-base text-white/80">
                <div className="flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-base">
                    payments
                  </span>
                  No subscription
                </div>

                <div className="flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-base">
                    sync_disabled
                  </span>
                  No recurring fee
                </div>
              </div>
            </div>
            <p className="text-base sm:text-lg md:text-xl opacity-90 max-w-2xl mx-auto mb-8 leading-relaxed">
              Just one check-in when you decide to participate.
            </p>

            {/* CTA Button */}
            <button
              onClick={onClick}
              className="w-full sm:w-auto bg-white text-primary px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-xl text-base sm:text-lg md:text-xl font-bold hover:bg-gray-50 hover:-translate-y-1 active:scale-95 transition-all duration-300 shadow-lg"
            >
              Find places near me tonight
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
