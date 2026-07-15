import "../blocks/legal-pages.css";

export default function LawEnforcementGuidelines() {
  return (
    <div className="bg-white w-full max-w-4xl mx-auto mt-28 mb-16 rounded-[2.5rem] shadow-xl p-12 md:p-10 space-y-5">
      <header className="text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight">
          Law Enforcement Guidelines
        </h1>
        <p className="text-slate-500 mt-3 text-sm md:text-base">
          Last updated: July 2026
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Overview</h2>
        <div className="h-px bg-slate-100 w-full mb-6" />
        <p className="text-slate-600 leading-relaxed">
          BaeQuest ("we," "our," or "us") cooperates with law enforcement agencies
          in accordance with applicable law. This page outlines how law enforcement
          authorities may submit requests for user information and what we require
          to process such requests.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">How to Submit a Request</h2>
        <div className="h-px bg-slate-100 w-full mb-6" />
        <p className="text-slate-600 leading-relaxed">
          All law enforcement requests must be submitted in writing to our legal
          team. We accept requests via email at:
        </p>
        <p className="mt-2">
          <a href="mailto:legal@baequests.com" className="text-primary font-semibold underline underline-offset-2">
            legal@baequests.com
          </a>
        </p>
        <p className="text-slate-600 leading-relaxed mt-4">
          Requests must include:
        </p>
        <ul className="space-y-3">
          {[
            "The name and badge or identification number of the requesting officer or agent.",
            "The law enforcement agency's name, address, and direct contact information.",
            "A valid subpoena, court order, or search warrant issued by a court of competent jurisdiction, or other applicable legal process.",
            "A specific description of the information being requested and the account(s) or user(s) in question.",
            "The relevant case number or investigation reference.",
          ].map((item) => (
            <li key={item} className="flex items-start gap-3 text-slate-600">
              <span className="mt-1 w-2 h-2 rounded-full bg-primary shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">What Information We May Provide</h2>
        <div className="h-px bg-slate-100 w-full mb-6" />
        <p className="text-slate-600 leading-relaxed">
          Depending on the legal process provided, BaeQuest may be able to produce
          the following categories of user data:
        </p>
        <ul className="space-y-3">
          {[
            "Account registration information (name, email address, date of account creation).",
            "Profile information (age, gender, profile photo).",
            "Device and login information (IP addresses, login timestamps).",
            "Event check-in history.",
            "Payment records (processed through our payment provider, Stripe).",
          ].map((item) => (
            <li key={item} className="flex items-start gap-3 text-slate-600">
              <span className="mt-1 w-2 h-2 rounded-full bg-primary shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <p className="text-slate-600 leading-relaxed mt-2">
          We do not retain message content between users beyond what is technically
          necessary for platform operation. We will only disclose information that is
          within our possession and that we are legally required to disclose.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Emergency Requests</h2>
        <div className="h-px bg-slate-100 w-full mb-6" />
        <p className="text-slate-600 leading-relaxed">
          If you believe there is an imminent threat to the life or safety of a
          person and require immediate assistance, please contact us at{" "}
          <a href="mailto:legal@baequests.com" className="text-primary underline underline-offset-2">
            legal@baequests.com
          </a>{" "}
          with "EMERGENCY" in the subject line. We will prioritize emergency
          requests and respond as quickly as possible.
        </p>
        <p className="text-slate-600 leading-relaxed">
          Emergency disclosures may be made without formal legal process where we
          have a good-faith belief that doing so is necessary to prevent death or
          serious bodily harm.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">User Notification</h2>
        <div className="h-px bg-slate-100 w-full mb-6" />
        <p className="text-slate-600 leading-relaxed">
          Unless prohibited by law or court order, we will make reasonable efforts
          to notify affected users of law enforcement requests before disclosing
          their information. If you require that we not notify the user (e.g., via
          a non-disclosure order), please include the relevant legal order with your
          request.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Cost Reimbursement</h2>
        <div className="h-px bg-slate-100 w-full mb-6" />
        <p className="text-slate-600 leading-relaxed">
          BaeQuest reserves the right to seek reimbursement for costs associated
          with responding to law enforcement requests, as permitted by applicable law.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Contact</h2>
        <div className="h-px bg-slate-100 w-full mb-6" />
        <p className="text-slate-600 leading-relaxed">
          For all law enforcement inquiries, contact us at{" "}
          <a href="mailto:legal@baequests.com" className="text-primary underline underline-offset-2">
            legal@baequests.com
          </a>
          . We will respond to all valid requests in a timely manner.
        </p>
      </section>
    </div>
  );
}
