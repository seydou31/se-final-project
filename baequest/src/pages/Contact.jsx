import "../blocks/legal-pages.css";

export default function Contact() {
  return (
    <div className="bg-white w-full max-w-4xl mx-auto mt-28 mb-16 rounded-[2.5rem] shadow-xl p-12 md:p-10 space-y-5">
      <header className="text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight">
          Contact Us
        </h1>

        <p className="text-slate-500 mt-3 text-sm md:text-base">
          We'd love to hear from you
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">
          Get in Touch
        </h2>

        <div className="h-px bg-slate-100 w-full mb-6" />

        <p className="text-slate-600 leading-relaxed">
          We'd love to hear from you! Whether you have questions, feedback, or
          just want to say hi, feel free to reach out.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">
          Email
        </h2>

        <div className="h-px bg-slate-100 w-full mb-6" />

        <div className="space-y-4">
          <p className="text-slate-600 leading-relaxed">
            For general inquiries:{" "}
            <a
              href="mailto:hello@baequests.com"
              className="text-primary font-medium hover:underline"
            >
              hello@baequests.com
            </a>
          </p>

          <p className="text-slate-600 leading-relaxed">
            For support:{" "}
            <a
              href="mailto:support@baequests.com"
              className="text-primary font-medium hover:underline"
            >
              support@baequests.com
            </a>
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">
          Report an Issue
        </h2>

        <div className="h-px bg-slate-100 w-full mb-6" />

        <p className="text-slate-600 leading-relaxed">
          Encountered a bug or have a safety concern? Please email us at{" "}
          <a
            href="mailto:support@baequests.com"
            className="text-primary font-medium hover:underline"
          >
            support@baequests.com
          </a>{" "}
          and we’ll address it as quickly as possible.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">
          Social Media
        </h2>

        <div className="h-px bg-slate-100 w-full mb-6" />

        <p className="text-slate-600 leading-relaxed">
          Follow us for updates on new features and events:
        </p>

        <ul className="space-y-4">
          {[
            {
              name: "Instagram",
              handle: "@baequests",
              url: "https://instagram.com/baequests",
            },
            {
              name: "Twitter",
              handle: "@baequests",
              url: "https://twitter.com/baequests",
            },
            {
              name: "Facebook",
              handle: "BaeQuest",
              url: "https://facebook.com/baequest",
            },
          ].map((social, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="w-2 h-2 mt-2.5 rounded-full bg-primary shrink-0" />

              <a
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                {social.name}: {social.handle}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4 pb-8">
        <h2 className="text-2xl font-bold text-slate-900">
          Response Time
        </h2>

        <div className="h-px bg-slate-100 w-full mb-6" />

        <p className="text-slate-600 leading-relaxed">
          We typically respond to all inquiries within{" "}
          <span className="font-medium">24–48 hours</span> during business
          days. For urgent safety concerns, please indicate{" "}
          <span className="font-medium">“URGENT”</span> in your subject line.
        </p>
      </section>
    </div>
  );
}