const baseUrl = process.env.NODE_ENV === "production" 
  ? "https://api.baequests.com"
  : "http://localhost:3001";

function checkResponse(res) {
  return res.ok ? res.json() : Promise.reject(`Error: ${res.status}`);
}

function createUser(user) {
  return fetch(`${baseUrl}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
     //credentials: "include",
    body: JSON.stringify(user),
  }).then(checkResponse);
}

function login(user) {
  return fetch(`${baseUrl}/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(user),
  }).then(checkResponse);
}

function createProfile(profile) {
  return fetch(`${baseUrl}/users/profile`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(profile),
  }).then(checkResponse);
}

function getProfile() {
  return fetch(`${baseUrl}/users/profile`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  }).then(checkResponse);
}

function logout() {
  return fetch(`${baseUrl}/logout`, {
    method: "POST",
    credentials: "include",
  }).then(checkResponse);
}

function updateProfile(profile) {
  return fetch(`${baseUrl}/users/profile`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(profile),
  }).then(checkResponse);
}

async function getEvents() {
  try {
    await fetch(`${baseUrl}/fetch-google-events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({}),
    }).then(checkResponse);
  } catch (error) {
    console.error("Error fetching Google events:", error);
  }

  return fetch(`${baseUrl}/events`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  }).then(checkResponse);
}

function checkin(data) {
  return fetch(`${baseUrl}/checkin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  }).then((response) =>
    response.json().then((resData) => {
      if (!response.ok) {
        // Throw a custom error with the backend message
        throw new Error(resData.error || "Check-in failed");
      }
      return resData; // success
    })
  );
}

function getUsersAtEvent(eventId) {
  return fetch(`${baseUrl}/otherUsers?eventId=${eventId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  }).then(checkResponse);
}

function checkout(payload) {
  console.log("🔵 checkout() called with payload:", payload);
  return fetch(`${baseUrl}/checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  }).then(checkResponse);
}

function fetchGoogleEvents(data) {
  return fetch(`${baseUrl}/fetch-google-events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  }).then(checkResponse);
}

export {
  createUser,
  login,
  createProfile,
  getProfile,
  logout,
  updateProfile,
  getEvents,
  checkin,
  getUsersAtEvent,
  checkout,
  fetchGoogleEvents,
};
