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

function getEvents(state = "", city = "") {
  const params = new URLSearchParams();
  if (state) params.append('state', state);
  if (city) params.append('city', city);
  const queryString = params.toString();

  return fetch(`${baseUrl}/events${queryString ? `?${queryString}` : ''}`, {
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
  return fetch(`${baseUrl}/checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  }).then(checkResponse);
}


function deleteUser(){
   return fetch(`${baseUrl}/deleteUser`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  }).then(checkResponse);
}

function deleteProfile(){
   return fetch(`${baseUrl}/users/profile`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  }).then(checkResponse);
}

function markAsGoing(eventId) {
  return fetch(`${baseUrl}/going`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ eventId }),
  }).then(checkResponse);
}

function uploadProfilePicture(file) {
  const formData = new FormData();
  formData.append('profilePicture', file);

  return fetch(`${baseUrl}/users/profile/picture`, {
    method: "POST",
    credentials: "include",
    body: formData,
    // Don't set Content-Type header - browser will set it with boundary for multipart/form-data
  }).then(checkResponse);
}

function googleAuth(credential) {
  return fetch(`${baseUrl}/auth/google`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ credential }),
  }).then(checkResponse);
}

function requestPasswordReset(email) {
  return fetch(`${baseUrl}/password-reset/request`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  }).then(checkResponse);
}

function resetPassword(token, newPassword) {
  return fetch(`${baseUrl}/password-reset/reset`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token, newPassword }),
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
  deleteProfile,
  deleteUser,
  markAsGoing,
  uploadProfilePicture,
  googleAuth,
  requestPasswordReset,
  resetPassword
};
