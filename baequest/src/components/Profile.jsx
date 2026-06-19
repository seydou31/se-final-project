import { useContext } from "react";
import AppContext from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const baseUrl = import.meta.env.PROD ? import.meta.env.VITE_API_BASE_URL : "http://localhost:3001";

function getImageUrl(pictureUrl) {
  if (!pictureUrl) return null;
  if (pictureUrl.startsWith("http://") || pictureUrl.startsWith("https://")) return pictureUrl;
  return `${baseUrl}${pictureUrl}`;
}

// Map interest value → Material Symbol icon
const interestIcons = {
  coffee: "coffee", gaming: "sports_esports", travel: "flight", photography: "camera",
  cooking: "skillet", fitness: "fitness_center", music: "music_note", reading: "auto_stories",
  art: "palette", movies: "movie", dancing: "nightlife", hiking: "hiking",
  wine: "wine_bar", yoga: "self_improvement", running: "directions_run", swimming: "pool",
  cycling: "directions_bike", camping: "camping", meditation: "spa", fashion: "checkroom",
};

export default function Profile() {
  const { currentProfile } = useContext(AppContext);
  const navigate = useNavigate();
  const {
    name, age, gender, profession, bio,
    interests = [], convoStarter, profilePicture,
  } = currentProfile;

  return (
    <main className="pt-20 sm:pt-24 pb-8 sm:pb-10 max-w-5xl mx-auto px-4 sm:px-6">

      {/* Header Section */}
      <section className="flex flex-col md:flex-row gap-6 sm:gap-8 items-center md:items-start mb-8 sm:mb-10 md:mb-12">

        {/* Profile Image */}
        <div className="relative group shrink-0">
          <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-lg overflow-hidden bg-surface-container-low">
            {profilePicture ? (
              <img key={profilePicture} src={getImageUrl(profilePicture)} alt={`${name}'s profile`}
                className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-4xl font-bold font-headline">
                {name ? name.charAt(0).toUpperCase() : "?"}
              </div>
            )}
          </div>
        </div>

        {/* Name + Bio */}
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-2 font-headline">{name}</h1>
              {(bio) && (
                <p className="text-sm sm:text-base md:text-lg text-on-surface-variant max-w-lg leading-relaxed">{bio}</p>
              )}
            </div>
            <div className="flex justify-center md:justify-end">
              <button
                onClick={() => navigate("/edit-profile")}
                className="px-5 sm:px-6 py-2 sm:py-2.5 rounded-lg bg-surface-container-highest text-on-surface font-semibold text-xs sm:text-sm hover:bg-surface-variant transition-all active:scale-95">
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10 md:mb-12">

        {/* Personal Details */}
        <div className="md:col-span-1 bg-surface-container-low rounded-lg p-5 sm:p-6 md:p-8 flex flex-col gap-4">
          <h3 className="text-[10px] sm:text-xs uppercase tracking-widest text-on-surface-variant mb-2">Personal Details</h3>
          <div className="space-y-4 sm:space-y-6">
            {gender && (
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary-container flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined">{gender === "female" ? "female" : "male"}</span>
                </div>
                <div>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold capitalize">{gender}</p>
                  <p className="text-xs sm:text-sm text-on-surface-variant">Gender</p>
                </div>
              </div>
            )}
            {age && (
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-secondary-container flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined">cake</span>
                </div>
                <div>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold">{age}</p>
                  <p className="text-xs sm:text-sm text-on-surface-variant">Years Young</p>
                </div>
              </div>
            )}
            {profession && (
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-tertiary-container flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined">work</span>
                </div>
                <div>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold">{profession}</p>
                  <p className="text-xs sm:text-sm text-on-surface-variant">Occupation</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Vibe / Interests */}
        <div className="md:col-span-2 bg-white rounded-lg p-5 sm:p-6 md:p-8 shadow-sm">
          <h3 className="text-[10px] sm:text-xs uppercase tracking-widest text-on-surface-variant mb-4 sm:mb-6">My Vibe</h3>

          {interests.length > 0 ? (
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {interests.map((interest) => (
                <span key={interest}
                  className="px-4 sm:px-5 py-2 sm:py-2.5 bg-secondary-container rounded-full text-xs sm:text-sm flex items-center gap-2 capitalize">
                  {interestIcons[interest] && (
                    <span className="material-symbols-outlined text-base">{interestIcons[interest]}</span>
                  )}
                  {interest}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-on-surface-variant">No interests added yet.</p>
          )}

          {convoStarter && (
            <div className="mt-6 sm:mt-8 md:mt-12 p-4 sm:p-5 md:p-6 bg-surface-container-low rounded-md">
              <p className="text-sm sm:text-base md:text-lg text-on-surface italic text-center">
                &ldquo;{convoStarter}&rdquo;
              </p>
            </div>
          )}
        </div>
      </div>

    </main>
  );
}
