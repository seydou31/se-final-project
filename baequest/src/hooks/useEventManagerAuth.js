import { useContext } from "react";
import { EventManagerAuthContext } from "../context/EventManagerAuthContext";

export function useEventManagerAuth() {
  const context = useContext(EventManagerAuthContext);

  if (!context) {
    throw new Error(
      "useEventManagerAuth must be used inside EventManagerAuthProvider"
    );
  }

  return context;
}