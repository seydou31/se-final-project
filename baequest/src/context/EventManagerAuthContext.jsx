import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { eventManagerGetMe } from "../utils/api";

const EventManagerAuthContext = createContext(null);

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

export function useEventManagerAuth() {
  const context = useContext(EventManagerAuthContext);

  if (!context) {
    throw new Error(
      "useEventManagerAuth must be used inside EventManagerAuthProvider"
    );
  }

  return context;
}