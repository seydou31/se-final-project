import { create } from "zustand";
import { persist } from "zustand/middleware";

const useEventStore = create(
  persist(
    (set) => ({
      currentEvent: null,
      isCheckedIn: false,
      otherProfiles: [],

      // =============================
      // SINGLE CHECK-IN ACTION
      // =============================
      checkInSuccess: (event, users = []) =>
        set({
          currentEvent: event,
          isCheckedIn: true,
          otherProfiles: Array.isArray(users)
            ? users
            : [],
        }),

      // =============================
      // INDIVIDUAL SETTERS
      // =============================
      setCurrentEvent: (event) =>
        set({
          currentEvent: event,
        }),

      setCheckedIn: (value) =>
        set({
          isCheckedIn: value,
        }),

      setOtherProfiles: (profiles) =>
        set({
          otherProfiles: Array.isArray(profiles)
            ? profiles
            : [],
        }),

      // =============================
      // SOCKET REALTIME ADD USER
      // =============================
      addUser: (user) =>
        set((state) => {
          if (!user?._id) return state;

          const incomingOwner =
            user.owner || user._id;

          const exists =
            state.otherProfiles.some(
              (u) =>
                String(u.owner || u._id) ===
                String(incomingOwner)
            );

          if (exists) return state;

          return {
            otherProfiles: [
              ...state.otherProfiles,
              user,
            ],
          };
        }),

      // =============================
      // SOCKET REALTIME REMOVE USER
      // =============================
      removeUser: (userId) =>
        set((state) => {
          console.log(
            "Removing:",
            userId
          );

          console.log(
            "Current users:",
            state.otherProfiles
          );

          return {
            otherProfiles:
              state.otherProfiles.filter(
                (u) => {
                  console.log(
                    "Compare",
                    u.owner || u._id,
                    userId
                  );

                  return (
                    String(u.owner || u._id) !==
                    String(userId)
                  );
                }
              ),
          };
        }),

      // =============================
      // CHECKOUT / EVENT END
      // =============================
      clearEventState: () =>
        set({
          currentEvent: null,
          isCheckedIn: false,
          otherProfiles: [],
        }),
    }),
    {
      name: "event-storage",

      // persist only required state
      partialize: (state) => ({
        currentEvent: state.currentEvent,
        isCheckedIn: state.isCheckedIn,
      }),
    }
  )
);

export default useEventStore;