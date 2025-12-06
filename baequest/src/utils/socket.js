import { io } from "socket.io-client";

// Use localhost in development, production URL in production
const socketUrl = process.env.NODE_ENV === "production"
  ? "https://api.baequests.com"
  : "http://localhost:3001";

const socket = io(socketUrl, {
  withCredentials: true,
});

export default socket;
