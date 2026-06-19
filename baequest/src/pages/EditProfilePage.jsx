import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AppContext from "../context/AppContext";
import { uploadProfilePicture } from "../utils/api.js";
import { useForm } from "../hooks/useForm.js";

const baseUrl = import.meta.env.PROD ? import.meta.env.VITE_API_BASE_URL : "http://localhost:3001";
function getImageUrl(url) {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${baseUrl}${url}`;
}

const interestOptions = [
  "gaming","travel","photography","cooking","fitness","music","reading",
  "art","movies","dancing","hiking","coffee","wine","yoga","running",
  "swimming","cycling","camping","meditation","fashion",
];

export default function EditProfilePage({ onSubmit, onPictureUpload }) {
  const { currentProfile } = useContext(AppContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading]     = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);

  const { values, handleChange, setValues } = useForm({
    name: "", age: "", gender: "", sexualOrientation: "",
    profession: "", bio: "", interests: [], convoStarter: "",
    phoneNumber: "", profilePicture: null,
  });

  useEffect(() => {
    if (currentProfile) {
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
        profilePicture: null,
      });
      if (currentProfile.profilePicture) setPhotoPreview(getImageUrl(currentProfile.profilePicture));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProfile]);

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    const updated = checked
      ? [...values.interests, value]
      : values.interests.filter(i => i !== value);
    if (updated.length > 3) { toast.error("You can select up to 3 interests only!"); return; }
    setValues({ ...values, interests: updated });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const validTypes = ["image/jpeg","image/jpg","image/png","image/gif","image/webp"];
    if (!validTypes.includes(file.type)) { toast.error("Please upload a valid image (JPEG, PNG, GIF, WebP)"); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("File size must be less than 5 MB"); return; }
    setValues({ ...values, profilePicture: file });
    setPhotoPreview(URL.createObjectURL(file));
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
        if (onPictureUpload) await onPictureUpload();
      }
      toast.success("Profile updated!");
      navigate("/profile");
    } catch {
      // error handled in caller
    } finally {
      setIsLoading(false);
    }
  };

  /* ── shared class helpers ── */
  const inputClass  = "w-full bg-surface-container rounded-full px-4 sm:px-6 py-3 sm:py-4 text-on-surface font-medium transition-shadow duration-200 hover:shadow-sm";
  const selectClass = "w-full bg-surface-container rounded-full px-4 sm:px-6 py-3 sm:py-4 text-on-surface font-medium transition-shadow duration-200 hover:shadow-sm appearance-none cursor-pointer";
  const labelClass  = "text-[10px] sm:text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1";

  return (
    /* pt-32 matches the HTML's `pt-32` — accounts for 64 px fixed header + 64 px breathing room */
    <main className="pt-32 pb-32 px-4 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8 md:gap-12">

        {/* ── Left sidebar — avatar ── */}
        <aside className="w-full md:w-1/3 flex flex-col items-center">
          <div className="relative group">
            <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-white shadow-xl bg-surface-container-low">
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Profile preview"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-5xl font-bold font-headline">
                  {values.name ? values.name.charAt(0).toUpperCase() : "?"}
                </div>
              )}
            </div>

            {/* Camera button */}
            <label className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 bg-primary text-white p-3 sm:p-4 rounded-full shadow-lg hover:scale-110 hover:bg-primary-dim transition-all duration-200 flex items-center justify-center cursor-pointer">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                photo_camera
              </span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          <div className="mt-4 sm:mt-6 text-center">
            <h2 className="text-lg sm:text-xl font-bold text-on-surface">{values.name || "Your Name"}</h2>
            <p className="text-on-surface-variant text-xs sm:text-sm mt-1">Personalize your aura</p>
          </div>
        </aside>

        {/* ── Right form ── */}
        <section className="flex-1">
          <div className="flex justify-between items-end mb-6 sm:mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-on-surface tracking-tight font-headline">
                Edit Profile
              </h1>
              <p className="text-sm sm:text-base text-on-surface-variant mt-1 sm:mt-2">
                Manage your public information and identity.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">

            {/* ── Basic Info Card ── */}
            <div className="bg-white p-5 sm:p-6 md:p-8 rounded-lg shadow-[0_4px_20px_rgba(42,52,57,0.04)] space-y-5 sm:space-y-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <label className={labelClass}>Full Name</label>
                  <input type="text" name="name" value={values.name} onChange={handleChange}
                    placeholder="Your full name" required minLength={2} maxLength={50}
                    className={inputClass} />
                </div>
                <div className="space-y-2">
                  <label className={labelClass}>Occupation</label>
                  <input type="text" name="profession" value={values.profession} onChange={handleChange}
                    placeholder="e.g. Designer, Engineer" required minLength={2} maxLength={50}
                    className={inputClass} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <label className={labelClass}>Gender</label>
                  <select name="gender" value={values.gender} onChange={handleChange} required
                    className={selectClass}>
                    <option value="">Select gender</option>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className={labelClass}>Sexual Orientation</label>
                  <select name="sexualOrientation" value={values.sexualOrientation} onChange={handleChange} required
                    className={selectClass}>
                    <option value="">Select orientation</option>
                    <option value="straight">Straight</option>
                    <option value="gay">Gay</option>
                    <option value="bisexual">Bisexual</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <label className={labelClass}>Age</label>
                  <input type="number" name="age" value={values.age} onChange={handleChange}
                    placeholder="Your age" required min={18} max={99}
                    className={inputClass} />
                </div>
                <div className="space-y-2">
                  <label className={labelClass}>Phone Number</label>
                  <input
                    type="tel"
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
                    placeholder="+12025551234"
                    minLength={7}
                    maxLength={20}
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className={labelClass}>Bio</label>
                <textarea name="bio" value={values.bio} onChange={handleChange}
                  placeholder="Tell us something about yourself…"
                  required minLength={6} maxLength={280} rows={4}
                  className="w-full bg-surface-container rounded-lg px-4 sm:px-6 py-3 sm:py-4 text-on-surface resize-none transition-shadow duration-200 hover:shadow-sm" />
              </div>

              <div className="space-y-2">
                <label className={labelClass}>Conversation Starter</label>
                <input type="text" name="convoStarter" value={values.convoStarter} onChange={handleChange}
                  placeholder="A fun icebreaker for events…"
                  required minLength={10} maxLength={160}
                  className={inputClass} />
              </div>
            </div>

            {/* ── Interests Card ── */}
            <div className="bg-white p-5 sm:p-6 md:p-8 rounded-lg shadow-[0_4px_20px_rgba(42,52,57,0.04)] space-y-4">
              <div>
                <h3 className="font-bold text-lg text-on-surface mb-1">Interests</h3>
                <p className="text-xs text-on-surface-variant">Pick up to 3 that best describe you.</p>
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {interestOptions.map(interest => {
                  const isSelected = values.interests.includes(interest);
                  return (
                    <label key={interest}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm cursor-pointer transition-all duration-200 capitalize border select-none ${
                        isSelected
                          ? "bg-primary text-white border-primary shadow-md shadow-primary/20 scale-105"
                          : "bg-surface-container border-transparent hover:border-outline-variant hover:shadow-sm hover:-translate-y-0.5"
                      }`}
                    >
                      <input type="checkbox" value={interest} checked={isSelected}
                        onChange={handleCheckboxChange} className="hidden" />
                      {interest}
                    </label>
                  );
                })}
              </div>
            </div>

            {/* ── Actions ── */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
              <button type="submit" disabled={isLoading}
                className="flex-1 bg-primary text-white py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg shadow-lg shadow-primary/20 hover:bg-primary-dim hover:-translate-y-0.5 active:scale-95 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none">
                {isLoading ? "Saving…" : "Save Changes"}
              </button>
              <button type="button" onClick={() => navigate("/profile")}
                className="sm:px-10 py-3 sm:py-4 bg-surface-container-highest rounded-full font-bold text-base sm:text-lg hover:bg-surface-variant hover:-translate-y-0.5 active:scale-95 transition-all duration-200">
                Cancel
              </button>
            </div>

          </form>
        </section>
      </div>
    </main>
  );
}
