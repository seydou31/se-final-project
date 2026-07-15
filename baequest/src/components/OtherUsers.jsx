// src/pages/OtherUsers.jsx

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import useEventStore from "../store/useEventStore";

import "../blocks/otherusers.css";

import getImageUrl from "../utils/getImageUrl";

const REPORT_REASONS = [
  "Fake profile",
  "Inappropriate content",
  "Harassment",
  "Spam",
  "Other",
];

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

export default function OtherUsers({ handleCheckoutModal }) {
  const navigate = useNavigate();
  const [reportingUserId, setReportingUserId] = useState(null);
  const [submittingReport, setSubmittingReport] = useState(false);

  const { currentEvent, otherProfiles } = useEventStore();

  const handleReport = async (userId, reason) => {
    setSubmittingReport(true);
    try {
      const res = await fetch(`${API_BASE}/users/report/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ reason }),
      });
      if (!res.ok) throw new Error();
      toast.success("Report submitted. Thank you.");
    } catch {
      toast.error("Failed to submit report. Please try again.");
    } finally {
      setSubmittingReport(false);
      setReportingUserId(null);
    }
  };

  // remove duplicates + invalid users
  const users = useMemo(() => {
    const map = new Map();

    (otherProfiles || []).forEach((user) => {
      if (!user?._id) return;

      if (!map.has(user._id)) {
        map.set(user._id, user);
      }
    });

    return Array.from(map.values());
  }, [otherProfiles]);

  useEffect(() => {
    if (!currentEvent?._id) {
      navigate("/events");
    }
  }, [currentEvent, navigate]);

  return (
    <main className="pt-24 pb-28 px-4 md:px-8 max-w-7xl mx-auto">
      {/* ===================================== */}
      {/* EVENT INFO */}
      {/* ===================================== */}

      <div className="mb-6 sm:mb-8 md:mb-10 text-center px-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-headline font-extrabold text-on-surface tracking-tight mb-2">
          People Checked In
        </h1>
        <div className="flex flex-col items-center gap-1">
          <span className="text-primary font-semibold font-headline text-sm sm:text-base md:text-lg">
            {currentEvent?.name || "Event"}
          </span>
          <div className="flex items-center gap-1.5 text-on-surface-variant">
            <span className="material-symbols-outlined text-base sm:text-[18px]">
              location_on
            </span>
            <span className="text-xs sm:text-sm font-medium">
              {currentEvent?.address && currentEvent.address}
            </span>
          </div>
        </div>
      </div>

      {/* ===================================== */}
      {/* USERS */}
      {/* ===================================== */}

      {users.length === 0 ? (
        <div className="relative group px-4">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative bg-surface-container-lowest border-2 border-dashed border-outline-variant/30 rounded-lg p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col items-center justify-center text-center shadow-sm">
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-surface-container-low rounded-full flex items-center justify-center mb-4 sm:mb-5 md:mb-6">
              <span className="material-symbols-outlined text-3xl sm:text-4xl md:text-5xl text-on-surface-variant/40">
                person_search
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-headline font-bold text-on-surface mb-2 sm:mb-3">
              Waiting for company?
            </h3>
            <p className="text-xs sm:text-sm md:text-base text-on-surface-variant leading-relaxed max-w-xs sm:max-w-sm">
              No one else has checked in yet. You'll be notified when other
              users arrive.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {users.map((user) => (
            <div
              key={user.owner || user._id}
              className="group bg-white rounded-[24px] sm:rounded-[30px] overflow-hidden border border-pink-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
            >
              {/* IMAGE */}
              <div className="relative w-full h-[220px] sm:h-[240px] md:h-[260px] lg:h-[280px] overflow-hidden bg-gray-100">
                {user.profilePicture ? (
                  <img
                    src={getImageUrl(user.profilePicture)}
                    alt={user.name || "User"}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary-50 text-5xl sm:text-6xl font-bold text-gray-600">
                    {user.name?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                )}

                {/* Online Dot */}
                <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-green-500 border-[3px] border-white shadow-md" />
              </div>

              {/* CONTENT */}
              <div className="p-4 sm:p-5 lg:p-6">
                {/* Name + Age */}
                <div>
                  <h2 className="text-[20px] sm:text-[22px] lg:text-[24px] font-bold text-priamry leading-tight break-words">
                    {user.name || "Anonymous"}

                    {user.age && (
                      <span className="font-medium text-gray-500">
                        , {user.age}
                      </span>
                    )}
                  </h2>

                  {user.profession && (
                    <p className="text-gray-500 text-sm sm:text-[15px] mt-1">
                      {user.profession}
                    </p>
                  )}
                </div>

                {/* Bio */}
                {user.bio && (
                  <p className="text-gray-600 text-sm sm:text-base leading-6 sm:leading-7 mt-4 line-clamp-3">
                    {user.bio}
                  </p>
                )}

                {/* Interests */}
                {(user.interests || []).length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4 sm:mt-5">
                    {user.interests.map((interest, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-full bg-primary-50 text-primary text-xs sm:text-sm font-medium border border-pink-100"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                )}

                {/* Conversation Starter */}
                {user.convoStarter && (
                  <div className="flex items-start gap-3 mt-4 sm:mt-5 p-3 sm:p-4 rounded-2xl bg-gray-50 border border-gray-100">
                    <div className="shrink-0 mt-1 text-gray-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 10h8M8 14h5m-9 7 1.405-4.215A9 9 0 1 1 21 12a9 9 0 0 1-9 9H4z"
                        />
                      </svg>
                    </div>

                    <p className="text-gray-700 text-sm sm:text-[15px] leading-6 sm:leading-7 break-words">
                      {user.convoStarter}
                    </p>
                  </div>
                )}

                {/* Report */}
                {reportingUserId === (user.owner || user._id) ? (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500 mb-2">Select a reason:</p>
                    <div className="flex flex-wrap gap-2">
                      {REPORT_REASONS.map((reason) => (
                        <button
                          key={reason}
                          onClick={() => handleReport(user.owner || user._id, reason)}
                          disabled={submittingReport}
                          className="text-xs px-3 py-1.5 rounded-full border border-red-200 text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                        >
                          {reason}
                        </button>
                      ))}
                      <button
                        onClick={() => setReportingUserId(null)}
                        className="text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-400 hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setReportingUserId(user.owner || user._id)}
                    className="mt-4 text-xs text-gray-400 hover:text-red-400 transition-colors underline underline-offset-2"
                  >
                    Report
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ===================================== */}
      {/* CHECKOUT */}
      {/* ===================================== */}
      <div className="pt-10 sm:pt-14 md:pt-20 w-full px-4 sm:px-6 flex justify-center pointer-events-none">
        <div className="w-full max-w-md sm:max-w-lg xl:max-w-xl pointer-events-auto">
          <button
            className="w-full py-3 sm:py-4 md:py-5 rounded-lg bg-primary text-white font-headline font-bold text-sm sm:text-base md:text-lg shadow-[0_20px_50px_rgba(189,12,59,0.2)] active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 sm:gap-3"
            onClick={handleCheckoutModal}
          >
            <span className="material-symbols-outlined text-base sm:text-lg">
              logout
            </span>
            Check Out
          </button>
        </div>
      </div>
    </main>
  );
}
