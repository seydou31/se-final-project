import { io } from "socket.io-client";

// Replace with your backend URL or localhost
const socket = io("http://localhost:3001", {
  withCredentials: true,
});

export default socket;