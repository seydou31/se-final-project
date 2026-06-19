import {
  useEffect,
  useRef,
  useState,
} from "react";

import toast from "react-hot-toast";
import socket from "../utils/socket";
import SocketContext from "./SocketContext";
import useEventStore from "../store/useEventStore";

export const SocketProvider = ({
  children,
  isLoggedIn,
}) => {
  const {
    currentEvent,
    isCheckedIn,
    addUser,
    removeUser,
    clearEventState,
  } = useEventStore();

  const joinedEventRef = useRef(null);

  // ============================================
  // CONNECT / DISCONNECT
  // ============================================
  useEffect(() => {
    if (isLoggedIn) {
      if (!socket.connected) {
        socket.connect();
      }
    } else {
      socket.disconnect();
      joinedEventRef.current = null;
    }

    const handleConnect = () => {
      console.log(
        "Socket connected:",
        socket.id
      );
    };

    const handleConnectError = (err) => {
      console.error(
        "Socket connect error:",
        err
      );

      if (
        err?.message?.includes(
          "Authentication"
        ) ||
        err?.message?.includes(
          "Unauthorized"
        )
      ) {
        toast.error(
          "Session expired. Please login again."
        );
      } else {
        toast.error(
          "Unable to connect to live server."
        );
      }
    };

    const handleDisconnect = (reason) => {
      console.warn(
        "Socket disconnected:",
        reason
      );
    };

    const handleReconnect = () => {
      console.log("Socket reconnected");

      if (
        currentEvent?._id &&
        isCheckedIn
      ) {
        socket.emit("join-event", {
          eventId: currentEvent._id,
        });

        joinedEventRef.current =
          currentEvent._id;
      }
    };

    socket.on("connect", handleConnect);

    socket.on(
      "connect_error",
      handleConnectError
    );

    socket.on(
      "disconnect",
      handleDisconnect
    );

    socket.io.on(
      "reconnect",
      handleReconnect
    );

    return () => {
      socket.off(
        "connect",
        handleConnect
      );

      socket.off(
        "connect_error",
        handleConnectError
      );

      socket.off(
        "disconnect",
        handleDisconnect
      );

      socket.io.off(
        "reconnect",
        handleReconnect
      );
    };
  }, [
    isLoggedIn,
    currentEvent?._id,
    isCheckedIn,
  ]);

  // ============================================
  // JOIN EVENT ROOM
  // ============================================
  useEffect(() => {
    if (
      !currentEvent?._id ||
      !isCheckedIn ||
      !socket.connected
    ) {
      return;
    }

    const eventId = currentEvent._id;

    // prevent duplicate joins
    if (
      joinedEventRef.current !== eventId
    ) {
      socket.emit("join-event", {
        eventId,
      });

      joinedEventRef.current = eventId;

      console.log(
        "Joined event room:",
        eventId
      );
    }

    // ============================================
    // USER CHECKED IN
    // ============================================
    const handleCheckIn = ({
      user,
      eventId: incomingEventId,
    }) => {
      if (
        String(incomingEventId) !==
        String(eventId)
      ) {
        return;
      }

      console.log(
        "User checked in:",
        user
      );

      addUser(user);
    };

    // ============================================
    // USER CHECKED OUT
    // ============================================
    const handleCheckOut = ({
      userId,
      eventId: outgoingEventId,
    }) => {
      if (
        String(outgoingEventId) !==
        String(eventId)
      ) {
        return;
      }

      console.log(
        "User checked out:",
        userId
      );

      console.log(
        "Before remove:",
        useEventStore.getState().otherProfiles
      );

      removeUser(userId);

      console.log(
        "After remove:",
        useEventStore.getState().otherProfiles
      );
    };

    // ============================================
    // EVENT ENDED
    // ============================================
    const handleEventEnded = ({
      eventId: endedEventId,
    }) => {
      if (
        String(endedEventId) !==
        String(eventId)
      ) {
        return;
      }

      clearEventState();

      joinedEventRef.current = null;

      toast(
        "The event has ended.",
        {
          icon: "🎉",
        }
      );
    };

    // ============================================
    // SERVER ERROR
    // ============================================
    const handleServerError = (err) => {
      console.error(
        "Socket server error:",
        err
      );

      const errorMap = {
        EVENT_FULL:
          "Event is full",

        UNAUTHORIZED:
          "Session expired. Please login again.",

        ALREADY_CHECKED_IN:
          "You are already checked in",
      };

      toast.error(
        errorMap[err?.code] ||
          err?.message ||
          "Something went wrong"
      );
    };

    // remove old listeners first
    socket.off(
      "user-checked-in",
      handleCheckIn
    );

    socket.off(
      "user-checked-out",
      handleCheckOut
    );

    socket.off(
      "event-ended",
      handleEventEnded
    );

    socket.off(
      "error",
      handleServerError
    );

    // register listeners
    socket.on(
      "user-checked-in",
      handleCheckIn
    );

    socket.on(
      "user-checked-out",
      handleCheckOut
    );

    socket.on(
      "event-ended",
      handleEventEnded
    );

    socket.on(
      "error",
      handleServerError
    );

    return () => {

      joinedEventRef.current = null;

      socket.off(
        "user-checked-in",
        handleCheckIn
      );

      socket.off(
        "user-checked-out",
        handleCheckOut
      );

      socket.off(
        "event-ended",
        handleEventEnded
      );

      socket.off(
        "error",
        handleServerError
      );
    };
  }, [
    currentEvent?._id,
    isCheckedIn,
    addUser,
    removeUser,
    clearEventState,
  ]);

  // ============================================
  // LEAVE EVENT
  // ============================================
  useEffect(() => {
    if (
      currentEvent?._id &&
      isCheckedIn
    ) {
      joinedEventRef.current =
        currentEvent._id;

      return;
    }

    // user checked out
    if (
      joinedEventRef.current &&
      socket.connected
    ) {
      socket.emit("leave-event", {
        eventId:
          joinedEventRef.current,
      });

      console.log(
        "Left event room:",
        joinedEventRef.current
      );

      joinedEventRef.current = null;
    }
  }, [
    currentEvent?._id,
    isCheckedIn,
  ]);

  const [eventVersion, setEventVersion] = useState(0);

  useEffect(() => {
    const handleEventCreated = (
      data
    ) => {
      console.log(
        "Received event-created",
        data
      );

      setEventVersion(
        (v) => v + 1
      );
    };

    socket.on(
      "event-created",
      handleEventCreated
    );

    return () => {
      socket.off(
        "event-created",
        handleEventCreated
      );
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{socket, eventVersion}}
    >
      {children}
    </SocketContext.Provider>
  );
};