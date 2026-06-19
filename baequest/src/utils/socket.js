import { io } from "socket.io-client";

// Use localhost in development, production URL in production
const socketUrl = import.meta.env.VITE_API_BASE_URL.replace(/^http/, "ws"); // Convert http(s) to ws(s) for WebSocket connection

const socket = io(socketUrl, {
  autoConnect: false, // IMPORTANT: Don't connect until we have the token
  withCredentials: true,
});

export default socket;