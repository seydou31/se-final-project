import { useState, useEffect, useContext, useRef } from "react";
import toast from "react-hot-toast";
import { useForm } from "../hooks/useForm";
import AppContext from "../context/AppContext";
import { uploadProfilePicture } from "../utils/api";

const INTEREST_OPTIONS = [
  "gaming","travel","photography","cooking","fitness","music",
  "reading","art","movies","dancing","hiking","coffee",
  "wine","yoga","running","swimming","cycling","camping",
  "meditation","fashion",
];

const inputClass =
  "w-full bg-surface-container rounded-lg px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/40 border border-transparent focus:border-primary/40 focus:outline-none transition";

const labelClass =
  "block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1.5";

export default function ProfileModal({
  isOpen,
  mode,
  onClose,
  onOverlayClick,
  onSubmit,
  onPictureUpload,
}) {
  const { currentProfile } = useContext(AppContext);
  const [isLoading, setIsLoading]   = useState(false);
  const [smsConsent, setSmsConsent] = useState(false);
  const [preview, setPreview]       = useState(null);
  const fileInputRef = useRef(null);

   const { values, handleChange, handleReset, setValues } = useForm({
    name: "",
    age: "",
    gender: "",
    sexualOrientation: "",
    profession: "",
    bio: "",
    interests: [],
    convoStarter: "",
    phoneNumber: "",
    profilePicture: null,
  });

  useEffect(() => {
    if (mode === "edit" && isOpen && currentProfile) {
      setValues({
        name: currentProfile.name || "",
        age: currentProfile.age || "",
        gender: currentProfile.gender || "",
        sexualOrientation: currentProfile.sexualOrientation || "",
        profession: currentProfile.profession || "",
        bio: currentProfile.bio || "",
        interests: currentProfile.interests || [],
        convoStarter: currentProfile.convoStarter || "",
        phoneNumber: currentProfile.phoneNumber || "",
      });
      setPreview(currentProfile.avatar || currentProfile.profilePicture || null);
    } else if (mode === "create" && !isOpen) {
      handleReset();
      setPreview(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, isOpen, currentProfile, setValues]);

  const handleClose = () => { if (mode === "create") return; onClose(); };
  const handleOverlay = (e) => {
    if (mode === "create") return;
    if (e.target === e.currentTarget) onOverlayClick?.(e);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const validTypes = ["image/jpeg","image/jpg","image/png","image/gif","image/webp"];
    if (!validTypes.includes(file.type)) { toast.error("Please upload a JPEG, PNG, GIF, or WebP image."); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("File size must be less than 5MB."); return; }
    setValues({ ...values, profilePicture: file });
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleInterest = (value) => {
    const current = values.interests;
    const next = current.includes(value)
      ? current.filter(i => i !== value)
      : current.length >= 3
        ? (toast.error("Pick up to 3 interests only."), current)
        : [...current, value];
    setValues({ ...values, interests: next });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const profileData = {
        name: values.name, age: values.age, gender: values.gender,
        sexualOrientation: values.sexualOrientation, profession: values.profession,
        bio: values.bio, interests: values.interests,
        convoStarter: values.convoStarter, phoneNumber: values.phoneNumber,
      };
      await onSubmit(profileData);
      if (values.profilePicture) {
        await uploadProfilePicture(values.profilePicture);
        if (onPictureUpload) {
          await new Promise(r => setTimeout(r, 100));
          await onPictureUpload();
        }
      }
      if (mode === "create") handleReset();
      onClose();
    } catch { /* handled by caller */ }
    finally { setIsLoading(false); }
  };

  if (!isOpen) return null;

  const title      = mode === "create" ? "Create Profile" : "Edit Profile";
  const submitText = mode === "create" ? "Create Profile" : "Save Changes";

  return (
    /* ── Backdrop ── */
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm px-4 py-8 sm:py-12 overflow-y-auto"
      onClick={handleOverlay}
    >
      {/* ── Sheet ── */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden my-auto">

        {/* ── Sticky header ── */}
        <div className="sticky top-0 z-10 bg-white border-b border-outline-variant/10 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black tracking-tight text-on-surface font-headline">{title}</h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              {mode === "create" ? "Tell us about yourself to get started" : "Update your public profile info"}
            </p>
          </div>
          {mode !== "create" && (
            <button
              type="button"
              onClick={handleClose}
              className="w-8 h-8 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">

          {/* ── Profile picture ── */}
          <div className="flex items-center gap-4">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative w-20 h-20 rounded-full bg-surface-container border-2 border-dashed border-outline-variant/40 flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors group shrink-0 overflow-hidden"
            >
              {preview ? (
                <>
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-lg">edit</span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-1">
                  <span className="material-symbols-outlined text-2xl text-on-surface-variant group-hover:text-primary transition-colors">add_a_photo</span>
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-on-surface">Profile Photo</p>
              <p className="text-xs text-on-surface-variant mt-0.5">JPEG, PNG, WebP or GIF · max 5 MB</p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-2 text-xs font-bold text-primary hover:text-primary-dim transition-colors"
              >
                {preview ? "Change photo" : "Upload photo"}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          {/* ── Divider ── */}
          <Divider label="Basic Info" />

          {/* ── Name ── */}
          <Field label="Name">
            <input
              type="text"
              className={inputClass}
              placeholder="First name — last name optional"
              name="name"
              value={values.name}
              onChange={handleChange}
              required
            />
          </Field>

          {/* ── Age / Gender row ── */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Age">
              <input
                type="number"
                className={inputClass}
                placeholder="18+"
                name="age"
                value={values.age}
                onChange={handleChange}
                required
                min="18"
                max="99"
              />
            </Field>
            <Field label="Gender">
              <select
                className={inputClass}
                name="gender"
                value={values.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select…</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </Field>
          </div>

          {/* ── Sexual orientation ── */}
          <Field label="Sexual Orientation">
            <select
              className={inputClass}
              name="sexualOrientation"
              value={values.sexualOrientation}
              onChange={handleChange}
              required
            >
              <option value="">Select…</option>
              <option value="straight">Straight</option>
              <option value="gay">Gay</option>
              <option value="bisexual">Bisexual</option>
            </select>
          </Field>

          {/* ── Profession ── */}
          <Field label="Profession">
            <input
              type="text"
              className={inputClass}
              placeholder="e.g. Software Engineer, Artist"
              name="profession"
              value={values.profession}
              onChange={handleChange}
              required
              minLength="2"
              maxLength="50"
            />
          </Field>

          <Divider label="About You" />

          {/* ── Bio ── */}
          <Field label="Bio">
            <textarea
              className={`${inputClass} resize-none`}
              placeholder="Tell people what makes you interesting…"
              name="bio"
              value={values.bio}
              onChange={handleChange}
              required
              minLength="6"
              maxLength="280"
              rows={3}
            />
            <p className="text-right text-[10px] text-on-surface-variant mt-1">
              {values.bio.length}/280
            </p>
          </Field>

          {/* ── Conversation starter ── */}
          <Field label="Conversation Starter">
            <input
              type="text"
              className={inputClass}
              placeholder="An ice-breaker question or fun fact…"
              name="convoStarter"
              value={values.convoStarter}
              onChange={handleChange}
              required
              minLength="10"
              maxLength="160"
            />
            <p className="text-right text-[10px] text-on-surface-variant mt-1">
              {values.convoStarter.length}/160
            </p>
          </Field>

          {/* ── Interests ── */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className={labelClass.replace("mb-1.5", "")}>Interests</label>
              <span className="text-[10px] text-on-surface-variant">
                {values.interests.length}/3 selected
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {INTEREST_OPTIONS.map(interest => {
                const val = interest.toLowerCase();
                const selected = values.interests.includes(val);
                return (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handleInterest(val)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 ${
                      selected
                        ? "bg-primary text-white border-primary shadow-sm"
                        : "bg-surface-container text-on-surface-variant border-transparent hover:border-primary/30 hover:text-on-surface"
                    }`}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>

          <Divider label="Contact & Notifications" />

          {/* ── Phone ── */}
          <Field
            label="Phone Number"
            hint="We text you when someone compatible checks in at your event."
          >
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-base pointer-events-none">phone</span>
              <input
                type="tel"
                className={`${inputClass} pl-10`}
                placeholder="+1 202 555 1234"
                name="phoneNumber"
                value={
                  values.phoneNumber || ""
                }
                onChange={(e) =>
                  setValues({
                    ...values,
                    phoneNumber:
                      e.target.value.replace(
                        /[^0-9+() -]/g,
                        ""
                      ),
                  })
                }
                minLength={7}
                maxLength={20}
                required
              />
            </div>

            {mode === "create" ? (
              <label className="flex items-start gap-2.5 mt-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={smsConsent}
                  onChange={e => setSmsConsent(e.target.checked)}
                  required
                  className="mt-0.5 accent-primary shrink-0"
                />
                <span className="text-xs text-on-surface-variant leading-relaxed group-hover:text-on-surface transition-colors">
                  I agree to receive SMS notifications when someone checks in at the same event as me. Message &amp; data rates may apply.
                </span>
              </label>
            ) : (
              <p className="flex items-start gap-2 mt-2 text-xs text-on-surface-variant leading-relaxed">
                <span className="material-symbols-outlined text-sm text-primary shrink-0 mt-0.5">check_circle</span>
                You agreed to receive SMS notifications. Message &amp; data rates may apply.
              </p>
            )}
          </Field>

          {/* ── Submit ── */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-white font-bold text-sm py-3.5 rounded-lg shadow-lg shadow-primary/20 hover:bg-primary-dim hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {mode === "create" ? "Creating profile…" : "Saving changes…"}
                </>
              ) : submitText}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

// ── Helpers ─────────────────────────────────────────────────────

function Field({ label, hint, children }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5">
        <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
          {label}
        </label>
        {hint && (
          <span
            title={hint}
            className="w-4 h-4 rounded-full bg-surface-container text-on-surface-variant text-[10px] font-bold flex items-center justify-center cursor-help hover:bg-primary hover:text-white transition-colors"
          >
            ?
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

function Divider({ label }) {
  return (
    <div className="flex items-center gap-3 pt-1">
      <span className="h-px flex-1 bg-outline-variant/30" />
      <span className="text-[10px] font-black uppercase tracking-[0.15em] text-outline shrink-0">{label}</span>
      <span className="h-px flex-1 bg-outline-variant/30" />
    </div>
  );
}
