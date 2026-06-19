import "../blocks/legal-pages.css";

export default function TermsOfService() {
  return (
    <div className="bg-white w-full max-w-4xl mx-auto mt-28 mb-16 rounded-[2.5rem] shadow-xl p-12 md:p-10 space-y-5">
      <header className="text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight">
          Terms of Service
        </h1>

        <p className="text-slate-500 mt-3 text-sm md:text-base">
          Last updated: April 2026
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">
          1. Acceptance of Terms
        </h2>
        <div className="h-px bg-slate-100 w-full mb-6" />

        <p className="text-slate-600 leading-relaxed">
          By accessing or using BaeQuest, you agree to be bound by these Terms
          of Service. If you do not agree to these terms, please do not use our
          service.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">
          2. Eligibility
        </h2>
        <div className="h-px bg-slate-100 w-full mb-6" />

        <p className="text-slate-600 leading-relaxed">
          You must be at least 18 years old to use BaeQuest. By using our
          service, you represent and warrant that you are at least 18 years of
          age.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">
          3. Account Registration
        </h2>
        <div className="h-px bg-slate-100 w-full mb-6" />

        <p className="text-slate-600 leading-relaxed">
          You agree to provide accurate, current, and complete information
          during registration and to update such information to keep it
          accurate. You are responsible for maintaining the confidentiality of
          your account credentials.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">
          4. User Conduct
        </h2>
        <div className="h-px bg-slate-100 w-full mb-6" />

        <p className="text-slate-600">
          You agree NOT to:
        </p>

        <ul className="space-y-3">
          {[
            "Use the service for any illegal purpose",
            "Harass, threaten, or intimidate other users",
            "Impersonate any person or entity",
            "Post false, misleading, or deceptive content",
            "Upload inappropriate or offensive content",
            "Attempt to access other users' accounts",
            "Use the service to spam or solicit other users",
            "Check in to events you are not actually attending",
            "Create multiple accounts",
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
          5. Safety
        </h2>
        <div className="h-px bg-slate-100 w-full mb-6" />

        <p className="text-slate-600 leading-relaxed">
          While BaeQuest facilitates connections at public events, we cannot
          guarantee the behavior of other users. You are responsible for your
          own safety when meeting people. We recommend:
        </p>

        <ul className="space-y-3 pt-2">
          {[
            "Meeting only in public places (which our app facilitates)",
            "Telling a friend where you'll be",
            "Trusting your instincts",
            "Reporting any suspicious or inappropriate behavior",
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
          6. Content
        </h2>
        <div className="h-px bg-slate-100 w-full mb-6" />

        <p className="text-slate-600 leading-relaxed">
          You retain ownership of content you post, but grant us a license to
          use, display, and distribute your content within the service. You are
          responsible for ensuring you have the right to post any content you
          upload.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">
          7. Location Services
        </h2>
        <div className="h-px bg-slate-100 w-full mb-6" />

        <p className="text-slate-600 leading-relaxed">
          BaeQuest uses location services to verify event check-ins. By using
          the check-in feature, you consent to the collection of your location
          data for this purpose.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">
          8. Termination
        </h2>
        <div className="h-px bg-slate-100 w-full mb-6" />

        <p className="text-slate-600 leading-relaxed">
          We reserve the right to suspend or terminate your account at any time
          for violations of these terms or for any other reason at our
          discretion. You may delete your account at any time through the app
          settings.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">
          9. Disclaimer of Warranties
        </h2>
        <div className="h-px bg-slate-100 w-full mb-6" />

        <p className="text-slate-600 leading-relaxed">
          BaeQuest is provided "as is" without warranties of any kind. We do
          not guarantee that the service will be uninterrupted, secure, or
          error-free.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">
          10. Limitation of Liability
        </h2>
        <div className="h-px bg-slate-100 w-full mb-6" />

        <p className="text-slate-600 leading-relaxed">
          To the maximum extent permitted by law, BaeQuest shall not be liable
          for any indirect, incidental, special, consequential, or punitive
          damages arising from your use of the service.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">
          11. Changes to Terms
        </h2>
        <div className="h-px bg-slate-100 w-full mb-6" />

        <p className="text-slate-600 leading-relaxed">
          We may modify these terms at any time. Continued use of the service
          after changes constitutes acceptance of the new terms.
        </p>
      </section>

      <section className="space-y-4 pb-8">
        <h2 className="text-2xl font-bold text-slate-900">
          12. Contact
        </h2>
        <div className="h-px bg-slate-100 w-full mb-6" />

        <p className="text-slate-600 leading-relaxed">
          For questions about these Terms of Service, contact us at{" "}
          <a
            href="mailto:legal@baequests.com"
            className="text-primary font-medium hover:underline"
          >
            legal@baequests.com
          </a>
        </p>
      </section>
    </div>
  );
}