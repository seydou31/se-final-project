import { io } from "socket.io-client";

// Replace with your backend URL or localhost
const socket = io("https://api.baequests.com", {
  withCredentials: true,
});

export default socket;