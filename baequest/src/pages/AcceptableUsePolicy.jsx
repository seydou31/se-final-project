import "../blocks/legal-pages.css";

export default function AcceptableUsePolicy() {
  return (
    <div className="bg-white w-full max-w-4xl mx-auto mt-28 mb-16 rounded-[2.5rem] shadow-xl p-12 md:p-10 space-y-5">
      <header className="text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight">
          Acceptable Use Policy
        </h1>
        <p className="text-slate-500 mt-3 text-sm md:text-base">
          Last updated: July 2026
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Overview</h2>
        <div className="h-px bg-slate-100 w-full mb-6" />
        <p className="text-slate-600 leading-relaxed">
          BaeQuest ("we," "our," or "us") operates a social events platform that
          helps singles meet in real life by checking in at curated local events.
          This Acceptable Use Policy ("AUP") describes what is and is not
          permitted when using BaeQuest's services, including our website,
          mobile application, and any associated payment features powered by
          Stripe.
        </p>
        <p className="text-slate-600 leading-relaxed">
          By using BaeQuest, you agree to comply with this AUP. Violations may
          result in suspension or permanent termination of your account.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Permitted Uses</h2>
        <div className="h-px bg-slate-100 w-full mb-6" />
        <p className="text-slate-600 leading-relaxed">You may use BaeQuest to:</p>
        <ul className="space-y-3">
          {[
            "Create a personal profile to meet other singles at local events.",
            "Browse, RSVP to, and check in at BaeQuest-curated events.",
            "Create and promote social events as an approved Event Manager.",
            "Collect check-in fees from attendees through our Stripe-powered payment system.",
            "Communicate with other users through our in-app features.",
          ].map((item) => (
            <li key={item} className="flex items-start gap-3 text-slate-600">
              <span className="mt-1 w-2 h-2 rounded-full bg-primary shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Prohibited Conduct</h2>
        <div className="h-px bg-slate-100 w-full mb-6" />
        <p className="text-slate-600 leading-relaxed">
          The following activities are strictly prohibited on BaeQuest:
        </p>

        <h3 className="text-lg font-semibold text-slate-800">Illegal Activity</h3>
        <ul className="space-y-3">
          {[
            "Using BaeQuest for any unlawful purpose or in violation of any applicable laws or regulations.",
            "Processing payments for illegal goods or services.",
            "Engaging in money laundering, fraud, or any other financial crime.",
            "Violating any export control laws or sanctions regulations.",
          ].map((item) => (
            <li key={item} className="flex items-start gap-3 text-slate-600">
              <span className="mt-1 w-2 h-2 rounded-full bg-red-400 shrink-0" />
              {item}
            </li>
          ))}
        </ul>

        <h3 className="text-lg font-semibold text-slate-800 mt-4">Fraudulent or Deceptive Behavior</h3>
        <ul className="space-y-3">
          {[
            "Creating fake profiles or impersonating any person or entity.",
            "Submitting false or misleading event information to collect payments.",
            "Initiating chargebacks or payment disputes in bad faith.",
            "Using stolen, unauthorized, or fraudulently obtained payment methods.",
            "Misrepresenting your identity to gain access to another user's account or data.",
          ].map((item) => (
            <li key={item} className="flex items-start gap-3 text-slate-600">
              <span className="mt-1 w-2 h-2 rounded-full bg-red-400 shrink-0" />
              {item}
            </li>
          ))}
        </ul>

        <h3 className="text-lg font-semibold text-slate-800 mt-4">Harassment and Harmful Content</h3>
        <ul className="space-y-3">
          {[
            "Harassing, threatening, intimidating, or abusing other users.",
            "Uploading or sharing sexually explicit, violent, or otherwise harmful content.",
            "Discriminating against users based on race, gender, sexual orientation, religion, national origin, disability, or any other protected characteristic.",
            "Sharing or soliciting personal information of other users without their consent.",
          ].map((item) => (
            <li key={item} className="flex items-start gap-3 text-slate-600">
              <span className="mt-1 w-2 h-2 rounded-full bg-red-400 shrink-0" />
              {item}
            </li>
          ))}
        </ul>

        <h3 className="text-lg font-semibold text-slate-800 mt-4">Platform Abuse</h3>
        <ul className="space-y-3">
          {[
            "Attempting to gain unauthorized access to BaeQuest systems, accounts, or data.",
            "Reverse engineering, decompiling, or otherwise attempting to extract source code from our platform.",
            "Using automated bots or scripts to interact with the platform in a way not explicitly permitted.",
            "Interfering with the proper functioning of the platform or its infrastructure.",
            "Reselling or sublicensing access to BaeQuest without written permission.",
          ].map((item) => (
            <li key={item} className="flex items-start gap-3 text-slate-600">
              <span className="mt-1 w-2 h-2 rounded-full bg-red-400 shrink-0" />
              {item}
            </li>
          ))}
        </ul>

        <h3 className="text-lg font-semibold text-slate-800 mt-4">Human Trafficking and Sexual Exploitation</h3>
        <p className="text-slate-600 leading-relaxed">
          BaeQuest has a zero-tolerance policy for human trafficking and sexual
          exploitation. The following are strictly prohibited:
        </p>
        <ul className="space-y-3">
          {[
            "Using BaeQuest to recruit, harbor, transport, or facilitate the trafficking of any person.",
            "Posting or sharing content that solicits, promotes, or facilitates sex trafficking or commercial sexual exploitation.",
            "Using the platform to advertise, arrange, or facilitate prostitution or escort services.",
            "Coercing, threatening, or deceiving any person into sexual activity or labor.",
          ].map((item) => (
            <li key={item} className="flex items-start gap-3 text-slate-600">
              <span className="mt-1 w-2 h-2 rounded-full bg-red-400 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <p className="text-slate-600 leading-relaxed mt-3">
          We actively monitor for indicators of trafficking activity on our platform.
          Any accounts suspected of trafficking-related conduct will be immediately
          suspended and reported to the National Human Trafficking Hotline
          (1-888-373-7888) and applicable law enforcement. To report suspected
          trafficking activity, contact us at{" "}
          <a href="mailto:support@baequests.com" className="text-primary underline underline-offset-2">
            support@baequests.com
          </a>{" "}
          or call 1-888-373-7888.
        </p>

        <h3 className="text-lg font-semibold text-slate-800 mt-4">Child Sexual Abuse Material (CSAM)</h3>
        <p className="text-slate-600 leading-relaxed">
          BaeQuest strictly prohibits any content that sexually exploits or endangers
          minors. The following are prohibited:
        </p>
        <ul className="space-y-3">
          {[
            "Uploading, sharing, or distributing child sexual abuse material (CSAM) of any kind.",
            "Using the platform to groom, solicit, or exploit minors.",
            "Creating accounts on behalf of minors or misrepresenting your age to access the platform.",
            "Sharing or linking to CSAM hosted on external platforms.",
          ].map((item) => (
            <li key={item} className="flex items-start gap-3 text-slate-600">
              <span className="mt-1 w-2 h-2 rounded-full bg-red-400 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <p className="text-slate-600 leading-relaxed mt-3">
          Any CSAM discovered on our platform is immediately removed, and the account
          responsible is permanently banned. We report all confirmed CSAM to the
          National Center for Missing &amp; Exploited Children (NCMEC) via the
          CyberTipline at{" "}
          <a
            href="https://www.missingkids.org/gethelpnow/cybertipline"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-2"
          >
            missingkids.org/cybertipline
          </a>{" "}
          and to applicable law enforcement authorities as required by law.
        </p>

        <h3 className="text-lg font-semibold text-slate-800 mt-4">Age Restrictions</h3>
        <p className="text-slate-600 leading-relaxed">
          BaeQuest is intended for users who are 18 years of age or older. Creating
          an account on behalf of a minor, or allowing a minor to use your account,
          is strictly prohibited. We require all users to confirm they are at least
          18 years of age during registration.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Payment Rules</h2>
        <div className="h-px bg-slate-100 w-full mb-6" />
        <p className="text-slate-600 leading-relaxed">
          BaeQuest uses Stripe to process payments. Event Managers who collect
          check-in fees through our platform must comply with{" "}
          <a
            href="https://stripe.com/legal/ssa"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-2"
          >
            Stripe's Services Agreement
          </a>{" "}
          and{" "}
          <a
            href="https://stripe.com/legal/connect-account"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-2"
          >
            Stripe's Connected Account Agreement
          </a>
          . Check-in fees must accurately reflect the event being offered. Collecting
          payment for events that do not take place, or that materially differ from
          what was advertised, is prohibited.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Enforcement</h2>
        <div className="h-px bg-slate-100 w-full mb-6" />
        <p className="text-slate-600 leading-relaxed">
          BaeQuest reserves the right to investigate any suspected violation of this
          AUP. If we determine that a violation has occurred, we may take any of the
          following actions at our sole discretion:
        </p>
        <ul className="space-y-3">
          {[
            "Issue a warning to the account holder.",
            "Temporarily suspend the account.",
            "Permanently terminate the account and ban the user from the platform.",
            "Remove any content or events that violate this policy.",
            "Withhold or reverse payments where fraud or abuse is suspected.",
            "Report illegal activity to applicable law enforcement authorities.",
          ].map((item) => (
            <li key={item} className="flex items-start gap-3 text-slate-600">
              <span className="mt-1 w-2 h-2 rounded-full bg-primary shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Reporting Violations</h2>
        <div className="h-px bg-slate-100 w-full mb-6" />
        <p className="text-slate-600 leading-relaxed">
          If you witness or experience a violation of this policy, please report it
          to us at{" "}
          <a href="mailto:support@baequests.com" className="text-primary underline underline-offset-2">
            support@baequests.com
          </a>
          . We take all reports seriously and will investigate promptly.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Changes to This Policy</h2>
        <div className="h-px bg-slate-100 w-full mb-6" />
        <p className="text-slate-600 leading-relaxed">
          We may update this Acceptable Use Policy from time to time. We will notify
          users of material changes by updating the "Last updated" date at the top of
          this page. Continued use of BaeQuest after any changes constitutes your
          acceptance of the updated policy.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Contact Us</h2>
        <div className="h-px bg-slate-100 w-full mb-6" />
        <p className="text-slate-600 leading-relaxed">
          For questions about this policy, contact us at{" "}
          <a href="mailto:support@baequests.com" className="text-primary underline underline-offset-2">
            support@baequests.com
          </a>
          .
        </p>
      </section>
    </div>
  );
}
