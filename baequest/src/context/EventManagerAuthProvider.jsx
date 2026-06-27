import { useCallback, useEffect, useRef, useState } from "react";

import { eventManagerGetMe } from "../utils/api";
import { EventManagerAuthContext } from "./EventManagerAuthContext";

export function EventManagerAuthProvider({ children }) {
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);

  const hasFetchedRef = useRef(false);

  const fetchMe = useCallback(async () => {
    try {
      const user = await eventManagerGetMe();
      setMe(user);
    } catch (err) {
      setMe(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (hasFetchedRef.current) return;

    hasFetchedRef.current = true;
    fetchMe();
  }, [fetchMe]);

  const refreshMe = async () => {
    setLoading(true);
    await fetchMe();
  };

  const logoutLocal = () => {
    setMe(null);
    setLoading(false);
  };

  return (
    <EventManagerAuthContext.Provider
      value={{
        me,
        loading,
        isAuthenticated: !!me,
        refreshMe,
        logoutLocal,
      }}
    >
      {children}
    </EventManagerAuthContext.Provider>
  );
}