import "../blocks/legal-pages.css";

export default function Privacy() {
  return (
    <div className="bg-white w-full max-w-4xl mx-auto mt-28 mb-16 rounded-[2.5rem] shadow-xl p-12 md:p-10 space-y-5">
      <header className="text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-slate-500 mt-3 text-sm md:text-base">
          Last updated: April 2026
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">
          Introduction
        </h2>
        <div className="h-px bg-slate-100 w-full mb-6" />

        <p className="text-slate-600 leading-relaxed">
          BaeQuest ("we," "our," or "us") is committed to protecting your
          privacy. This Privacy Policy explains how we collect, use, disclose,
          and safeguard your information when you use our application and
          services.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">
          Information We Collect
        </h2>
        <div className="h-px bg-slate-100 w-full mb-6" />

        <h3 className="text-lg font-semibold text-slate-800">
          Personal Information
        </h3>

        <p className="text-slate-600">
          When you create an account, we collect:
        </p>

        <ul className="space-y-3">
          {[
            "Email address",
            "Name",
            "Age",
            "Gender",
            "Profile picture (optional)",
            "Profession",
            "Interests",
            "Sexual orientation (for matching purposes)",
          ].map((item, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="w-2 h-2 mt-2.5 rounded-full bg-primary shrink-0" />
              <span className="text-slate-600">{item}</span>
            </li>
          ))}
        </ul>

        <h3 className="text-lg font-semibold text-slate-800 pt-4">
          Location Data
        </h3>

        <p className="text-slate-600 leading-relaxed">
          When you check in to an event, we collect your location to verify
          you're at the event venue. We do not continuously track your location.
        </p>

        <h3 className="text-lg font-semibold text-slate-800 pt-4">
          Usage Data
        </h3>

        <p className="text-slate-600 leading-relaxed">
          We collect information about how you interact with our app, including
          events viewed, check-ins, and feature usage.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">
          How We Use Your Information
        </h2>
        <div className="h-px bg-slate-100 w-full mb-6" />

        <ul className="space-y-3">
          {[
            "To provide and maintain our service",
            "To verify your presence at events",
            "To show you other users at the same event (based on your preferences)",
            "To send you important updates about your account",
            "To improve our services",
            "To prevent fraud and ensure safety",
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
          Information Sharing
        </h2>
        <div className="h-px bg-slate-100 w-full mb-6" />

        <p className="text-slate-600">
          We share limited information with other users:
        </p>

        <ul className="space-y-3">
          {[
            "Your name, age, profession, and interests are visible to other users at the same event",
            "Your profile picture (if uploaded) is visible to other users",
            "Your exact location is never shared with other users",
          ].map((item, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="w-2 h-2 mt-2.5 rounded-full bg-primary shrink-0" />
              <span className="text-slate-600">{item}</span>
            </li>
          ))}
        </ul>

        <p className="text-slate-600 leading-relaxed pt-2">
          We do not sell your personal information to third parties.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">
          Data Storage and Security
        </h2>
        <div className="h-px bg-slate-100 w-full mb-6" />

        <p className="text-slate-600 leading-relaxed">
          Your data is stored securely using industry-standard encryption. We
          use secure cloud services to store your information and implement
          appropriate security measures to protect against unauthorized access.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">
          Your Rights
        </h2>
        <div className="h-px bg-slate-100 w-full mb-6" />

        <p className="text-slate-600">
          You have the right to:
        </p>

        <ul className="space-y-3">
          {[
            "Access your personal data",
            "Update or correct your information",
            "Delete your account and associated data",
            "Opt out of marketing communications",
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
          Cookies
        </h2>
        <div className="h-px bg-slate-100 w-full mb-6" />

        <p className="text-slate-600 leading-relaxed">
          We use essential cookies to keep you logged in and maintain your
          session. See our Cookie Policy for more details.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">
          Children's Privacy
        </h2>
        <div className="h-px bg-slate-100 w-full mb-6" />

        <p className="text-slate-600 leading-relaxed">
          BaeQuest is not intended for users under 18 years of age. We do not
          knowingly collect information from children under 18.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">
          Changes to This Policy
        </h2>
        <div className="h-px bg-slate-100 w-full mb-6" />

        <p className="text-slate-600 leading-relaxed">
          We may update this Privacy Policy from time to time. We will notify
          you of any changes by posting the new Privacy Policy on this page and
          updating the "Last updated" date.
        </p>
      </section>

      <section className="space-y-4 pb-8">
        <h2 className="text-2xl font-bold text-slate-900">
          Contact Us
        </h2>
        <div className="h-px bg-slate-100 w-full mb-6" />

        <p className="text-slate-600 leading-relaxed">
          If you have questions about this Privacy Policy, please contact us at{" "}
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