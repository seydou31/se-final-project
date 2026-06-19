import "../blocks/legal-pages.css";

export default function CookiePolicy() {
  return (
    <div className="bg-white w-full max-w-4xl mx-auto mt-28 mb-16 rounded-[2.5rem] shadow-xl p-12 md:p-10 space-y-5">
      <header className="text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight">
          Cookie Policy
        </h1>

        <p className="text-slate-500 mt-3 text-sm md:text-base">
          Last updated: April 2026
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">
          What Are Cookies?
        </h2>

        <div className="h-px bg-slate-100 w-full mb-6" />

        <p className="text-slate-600 leading-relaxed">
          Cookies are small text files stored on your device when you visit a
          website. They help websites remember your preferences and provide a
          better user experience.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">
          How We Use Cookies
        </h2>

        <div className="h-px bg-slate-100 w-full mb-6" />

        <p className="text-slate-600 leading-relaxed">
          BaeQuest uses cookies for the following purposes:
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">
          Essential Cookies
        </h2>

        <div className="h-px bg-slate-100 w-full mb-6" />

        <p className="text-slate-600">
          These cookies are necessary for the website to function properly.
          They include:
        </p>

        <ul className="space-y-3">
          {[
            "Authentication cookies: Keep you logged in to your account",
            "Session cookies: Maintain your session while using the app",
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
          Functional Cookies
        </h2>

        <div className="h-px bg-slate-100 w-full mb-6" />

        <p className="text-slate-600">
          These cookies remember your preferences, such as:
        </p>

        <ul className="space-y-3">
          {[
            "Your current event check-in status",
            "Display preferences",
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
          Analytics Cookies
        </h2>

        <div className="h-px bg-slate-100 w-full mb-6" />

        <p className="text-slate-600 leading-relaxed">
          We use analytics to understand how users interact with our app. This
          helps us improve our service. Analytics data is anonymized and
          aggregated.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">
          Third-Party Cookies
        </h2>

        <div className="h-px bg-slate-100 w-full mb-6" />

        <p className="text-slate-600">
          We may use third-party services that set their own cookies:
        </p>

        <ul className="space-y-3">
          {[
            "Google: For Google Sign-In functionality and analytics",
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
          Managing Cookies
        </h2>

        <div className="h-px bg-slate-100 w-full mb-6" />

        <p className="text-slate-600">
          Most web browsers allow you to control cookies through their
          settings. You can:
        </p>

        <ul className="space-y-3">
          {[
            "View what cookies are stored on your device",
            "Delete some or all cookies",
            "Block cookies from being set",
          ].map((item, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="w-2 h-2 mt-2.5 rounded-full bg-primary shrink-0" />
              <span className="text-slate-600">{item}</span>
            </li>
          ))}
        </ul>

        <p className="text-slate-600 leading-relaxed pt-2">
          Note that blocking essential cookies may prevent you from using
          BaeQuest properly, including staying logged in.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">
          Local Storage
        </h2>

        <div className="h-px bg-slate-100 w-full mb-6" />

        <p className="text-slate-600">
          In addition to cookies, we use local storage to remember:
        </p>

        <ul className="space-y-3">
          {[
            "Whether you're logged in",
            "Your current event check-in",
          ].map((item, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="w-2 h-2 mt-2.5 rounded-full bg-primary shrink-0" />
              <span className="text-slate-600">{item}</span>
            </li>
          ))}
        </ul>

        <p className="text-slate-600 leading-relaxed pt-2">
          This data stays on your device and helps the app load faster.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">
          Updates to This Policy
        </h2>

        <div className="h-px bg-slate-100 w-full mb-6" />

        <p className="text-slate-600 leading-relaxed">
          We may update this Cookie Policy from time to time. Any changes will
          be posted on this page with an updated "Last updated" date.
        </p>
      </section>

      <section className="space-y-4 pb-8">
        <h2 className="text-2xl font-bold text-slate-900">
          Contact Us
        </h2>

        <div className="h-px bg-slate-100 w-full mb-6" />

        <p className="text-slate-600 leading-relaxed">
          If you have questions about our use of cookies, please contact us at{" "}
          <a
            href="mailto:privacy@baequests.com"
            className="text-primary font-medium hover:underline"
          >
            privacy@baequests.com
          </a>
        </p>
      </section>
    </div>
  );
}