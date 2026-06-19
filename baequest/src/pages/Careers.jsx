import "../blocks/legal-pages.css";

export default function Careers() {
  return (
    <div className="bg-white w-full max-w-4xl mx-auto mt-28 mb-16 rounded-[2.5rem] shadow-xl p-12 md:p-10 space-y-5">
      <header className="text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight">
          Careers
        </h1>
      </header>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">
          Join Our Team
        </h2>
        <div className="h-px bg-slate-100 w-full mb-6" />
        <p className="text-slate-600 leading-relaxed">
          BaeQuest is a growing startup looking for passionate individuals who
          want to change how people connect. We're building something special,
          and we'd love for you to be part of it.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">
          Current Openings
        </h2>
        <div className="h-px bg-slate-100 w-full mb-6" />
        <p className="text-slate-600 leading-relaxed">
          We don't have any open positions at the moment, but we're always
          interested in hearing from talented people. If you think you'd be a
          great fit, send us your resume!
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">
          What We Look For
        </h2>
        <div className="h-px bg-slate-100 w-full mb-6" />

        <ul className="space-y-4">
          {[
            "Passion for building products that bring people together",
            "Creative problem-solving skills",
            "Ability to work in a fast-paced startup environment",
            "Strong communication skills",
            "A good sense of humor (we like to have fun!)",
          ].map((item, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="w-2 h-2 mt-2.5 rounded-full bg-primary shrink-0" />
              <span className="text-slate-600">{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">
          Perks
        </h2>
        <div className="h-px bg-slate-100 w-full mb-6" />

        <ul className="space-y-4">
          {[
            "Remote-friendly work environment",
            "Flexible hours",
            "Be part of shaping a product from the ground up",
            "Work with a passionate, close-knit team",
          ].map((item, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="w-2 h-2 mt-2.5 rounded-full bg-primary shrink-0" />
              <span className="text-slate-600">{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4 pb-8">
        <h2 className="text-2xl font-bold text-slate-900">
          How to Apply
        </h2>
        <div className="h-px bg-slate-100 w-full mb-6" />

        <p className="text-slate-600 leading-relaxed">
          Send your resume and a brief note about why you'd be a great fit to{" "}
          <a
            className="text-primary font-medium hover:underline"
            href="mailto:careers@baequests.com"
          >
            careers@baequests.com
          </a>
        </p>
      </section>
    </div>
  );
}