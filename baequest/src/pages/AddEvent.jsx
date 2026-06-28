import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCuratedEvent, eventManagerGetOnboardingLink } from "../utils/api.js";
import EMSidebar from "../components/EMSidebar.jsx";
import EMTopBar from "../components/EMTopBar.jsx";
import { useEventManagerAuth } from "../hooks/useEventManagerAuth";

const inputClass =
  "w-full bg-surface-container rounded-lg px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-base placeholder:text-on-surface-variant/40 transition-shadow duration-200 hover:shadow-sm";
const labelClass =
  "text-[10px] sm:text-xs font-bold uppercase tracking-wider text-on-surface-variant ml-1";

export default function AddEvent() {
  const navigate = useNavigate();
  const { me, loading } = useEventManagerAuth();
  const [formData, setFormData] = useState({
    name: "", address: "", city: "", state: "", zipcode: "",
    startTime: "", endTime: "", description: "", link: "",
  });
  const [photoFile, setPhotoFile]       = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [error, setError]               = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPaid, setIsPaid]             = useState(false);
  const [priceInput, setPriceInput]     = useState("");
  const [stripeErr, setStripeErr]       = useState("");

  const canChargeForTickets = !!me?.stripeOnboardingComplete;

  const handleChange = e =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  async function handleConnectStripe() {
    setStripeErr("");
    try {
      const res = await eventManagerGetOnboardingLink();
      window.location.href = res.url;
    } catch {
      setStripeErr("Could not start Stripe onboarding. Please try again.");
    }
  }

  const handlePhotoChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");

    let ticketPrice = 0;
    if (isPaid) {
      const dollars = parseFloat(priceInput);
      if (!priceInput || Number.isNaN(dollars) || dollars <= 0) {
        setError("Enter a ticket price greater than $0, or switch this to a free event.");
        return;
      }
      ticketPrice = Math.round(dollars * 100);
    }

    setIsSubmitting(true);
    try {
      const eventData = {
        ...formData,
        startTime: new Date(formData.startTime).toISOString(),
        endTime:   new Date(formData.endTime).toISOString(),
        ticketPrice,
      };
      await createCuratedEvent(eventData, photoFile);
      navigate("/event-manager/my-events");
    } catch (err) {
      const message =
        typeof err === "string"
          ? err
          : err?.message || "Something went wrong";

      setError(message || "Failed to create event. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-background text-on-surface min-h-screen flex overflow-hidden font-body">
          <EMSidebar me={me} />
    
          <main className="flex-1 flex flex-col h-screen overflow-y-auto">
            <EMTopBar title="Add Event" me={me} />
    
            <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6">
               { (loading) ? (
                 
                  <div className="min-h-screen bg-background flex items-center justify-center">
                    <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                
              ) : null }
              {/* Page heading */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  {/* <h1 className="text-xl sm:text-2xl font-black tracking-tight text-on-surface font-headline">My Events</h1> */}
                  <p className="text-sm text-on-surface-variant mt-0.5">Set the stage for an unforgettable curated experience.</p>
                </div>
              </div>

          {/* Form card */}
          <div className="bg-white rounded-lg shadow-[0_20px_50px_rgba(42,52,57,0.06)] p-5 sm:p-6 md:p-8 lg:p-12">
              
          {error && (
            <p className="mb-6 text-error text-sm bg-red-50 border border-red-100 px-4 py-3 rounded-lg">{error}</p>
          )}
            <form onSubmit={handleSubmit} className="space-y-8 sm:space-y-10">

              {/* Row 1: Name + Link | Photo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-start">
                <div className="space-y-5 sm:space-y-6">

                  <div className="space-y-2">
                    <label className={labelClass}>Event Name</label>
                    <input
                      type="text" name="name" value={formData.name} onChange={handleChange}
                      placeholder="Midnight Jazz & Cocktails" required
                      className={inputClass}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className={labelClass}>Event Link (Optional)</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/60 text-sm">link</span>
                      <input
                        type="url" name="link" value={formData.link} onChange={handleChange}
                        placeholder="https://your-event.com"
                        className={`${inputClass} pl-10 sm:pl-11`}
                      />
                    </div>
                  </div>

                </div>

                {/* Photo upload */}
                <div className="space-y-2">
                  <label className={labelClass}>Event Photo</label>
                  <label className="relative group block h-36 sm:h-40 md:h-[164px] cursor-pointer">
                    <input type="file" accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={handlePhotoChange} className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer" />
                    <div className={`h-full w-full border-2 border-dashed rounded-md flex flex-col items-center justify-center transition-colors ${
                      photoPreview ? "border-primary/30 bg-surface-container-low" : "border-surface-variant bg-surface-container-low group-hover:bg-surface-variant/30"
                    }`}>
                      {photoPreview ? (
                        <img src={photoPreview} alt="Preview" className="w-full h-full object-cover rounded-md" />
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-primary text-2xl sm:text-3xl mb-2">add_a_photo</span>
                          <span className="text-xs sm:text-sm font-medium text-on-surface-variant text-center">Click to upload banner</span>
                          <span className="text-[10px] text-on-surface-variant/60 mt-1 text-center px-2">Recommended: 16:9 Aspect Ratio</span>
                        </>
                      )}
                    </div>
                  </label>
                </div>
              </div>

              {/* Venue Details */}
              <div className="pt-2 sm:pt-4">
                <div className="flex items-center gap-2 mb-4 sm:mb-6">
                  <span className="h-px flex-grow bg-surface-variant" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-outline">Venue Details</span>
                  <span className="h-px flex-grow bg-surface-variant" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-5 sm:gap-6">
                  <div className="md:col-span-4 space-y-2">
                    <label className={labelClass}>Street Address</label>
                    <input type="text" name="address" value={formData.address} onChange={handleChange}
                      placeholder="123 Curated Lane, Studio B" required className={inputClass} />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className={labelClass}>City</label>
                    <input type="text" name="city" value={formData.city} onChange={handleChange}
                      placeholder="New York" className={inputClass} />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>State</label>
                    <input type="text" name="state" value={formData.state} onChange={handleChange}
                      placeholder="NY" maxLength={3} className={inputClass} />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>Zipcode</label>
                    <input type="text" name="zipcode" value={formData.zipcode} onChange={handleChange}
                      placeholder="10001" className={inputClass} />
                  </div>
                </div>
              </div>

              {/* Schedule */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 pt-2 sm:pt-4">
                <div className="space-y-2">
                  <label className={labelClass}>Start Time</label>
                  <input type="datetime-local" name="startTime" value={formData.startTime} onChange={handleChange}
                    required className={inputClass} />
                </div>
                <div className="space-y-2">
                  <label className={labelClass}>End Time</label>
                  <input type="datetime-local" name="endTime" value={formData.endTime} onChange={handleChange}
                    required className={inputClass} />
                </div>
              </div>

              {/* Pricing */}
              <div className="pt-2 sm:pt-4">
                <div className="flex items-center gap-2 mb-4 sm:mb-6">
                  <span className="h-px flex-grow bg-surface-variant" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-outline">Pricing</span>
                  <span className="h-px flex-grow bg-surface-variant" />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsPaid(false)}
                    className={`flex-1 py-3 rounded-lg text-sm font-bold border transition-colors ${
                      !isPaid ? "bg-primary text-white border-primary" : "bg-surface-container border-transparent text-on-surface-variant"
                    }`}
                  >
                    Free Event
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPaid(true)}
                    className={`flex-1 py-3 rounded-lg text-sm font-bold border transition-colors ${
                      isPaid ? "bg-primary text-white border-primary" : "bg-surface-container border-transparent text-on-surface-variant"
                    }`}
                  >
                    Paid Event
                  </button>
                </div>

                {isPaid && (
                  <div className="mt-5 space-y-3">
                    {!canChargeForTickets ? (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <span className="material-symbols-outlined text-amber-600 mt-0.5 shrink-0">account_balance</span>
                          <p className="text-sm text-amber-800 font-medium">Connect your bank account to charge for tickets and receive payouts.</p>
                        </div>
                        <button
                          type="button"
                          onClick={handleConnectStripe}
                          className="shrink-0 bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-md hover:bg-primary-dim hover:-translate-y-0.5 active:scale-95 transition-all whitespace-nowrap"
                        >
                          Connect Bank Account
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2 max-w-xs">
                        <label className={labelClass}>Ticket Price (USD)</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/60 text-sm">$</span>
                          <input
                            type="number" min="0.01" step="0.01" name="priceInput"
                            value={priceInput} onChange={e => setPriceInput(e.target.value)}
                            placeholder="10.00" required={isPaid}
                            className={`${inputClass} pl-7`}
                          />
                        </div>
                      </div>
                    )}
                    {stripeErr && <p className="text-error text-sm bg-red-50 px-4 py-3 rounded-lg border border-red-100">{stripeErr}</p>}
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2 pt-2 sm:pt-4">
                <label className={labelClass}>Description (Optional)</label>
                <textarea
                  name="description" value={formData.description} onChange={handleChange}
                  placeholder="Tell your guests what makes this encounter special…"
                  rows={5} maxLength={1000}
                  className={`${inputClass} resize-none rounded-md`}
                />
              </div>

              {/* Actions */}
              <div className="pt-6 sm:pt-8 md:pt-10 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
                <button
                  type="button"
                  onClick={() => navigate("/event-manager/dashboard")}
                  className="text-sm sm:text-base text-on-surface-variant font-semibold px-6 py-3 hover:text-on-surface hover:bg-surface-container rounded-lg transition-all duration-200"
                >
                  Discard Draft
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || (isPaid && !canChargeForTickets)}
                  className="w-full md:w-auto bg-primary text-white font-bold text-sm sm:text-base md:text-lg px-8 sm:px-10 md:px-12 py-3 sm:py-4 md:py-5 rounded-lg shadow-xl shadow-primary/20 hover:bg-primary-dim hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? "Creating…" : "Create Event"}
                </button>
              </div>

            </form>
          </div>
        <footer className="mt-auto px-4 sm:px-6 md:px-8 py-4 sm:py-6 border-t text-center">
          <p className="text-xs text-on-surface-variant">© {new Date().getFullYear()} BaeQuest</p>
        </footer>
        </div>
      </main>
    </div>
  );
}
