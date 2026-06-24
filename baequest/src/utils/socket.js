import { io } from "socket.io-client";

const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const socketUrl = apiBaseUrl.replace(/^http/, "ws");

const socket = io(socketUrl, {
  autoConnect: false, // IMPORTANT: Don't connect until we have the token
  withCredentials: true,
});

export default socket;