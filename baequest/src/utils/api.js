const baseUrl = process.env.NODE_ENV === "production"
  ? "https://api.baequests.com"
  : "http://localhost:3001";

let isRefreshing = false;
let refreshPromise = null;

// Refresh the JWT token
async function refreshToken() {
  if (isRefreshing) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = fetch(`${baseUrl}/refresh-token`, {
    method: "POST",
    credentials: "include",
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Token refresh failed");
      }
      return res.json();
    })
    .finally(() => {
      isRefreshing = false;
      refreshPromise = null;
    });

  return refreshPromise;
}

// Enhanced response checker with automatic token refresh on 401
async function checkResponse(res, originalRequest) {
  if (res.ok) {
    return res.json();
  }

  // Handle 401 Unauthorized
  if (res.status === 401) {
    try {
      const errorData = await res.json();

      // If token expired, try to refresh and retry the request
      if (errorData.tokenExpired) {
        await refreshToken();

        // Retry the original request
        if (originalRequest) {
          const retryResponse = await fetch(originalRequest.url, originalRequest.options);
          return checkResponse(retryResponse, null); // Don't retry again if this fails
        }
      }

      // If not a token expiration or retry failed, reject with the error
      return Promise.reject(errorData.message || "Authorization Error");
    } catch (err) {
      // Token refresh failed - user needs to login again
      // Clear any stored user data and redirect to login
      localStorage.removeItem("isLoggedIn");
      window.location.href = "/";
      return Promise.reject("Session expired. Please login again.");
    }
  }

  // Handle other error statuses
  try {
    const errorData = await res.json();
    console.log('Error response data:', errorData); // Debug log
    return Promise.reject(errorData.message || errorData.error || `Error: ${res.status}`);
  } catch (parseError) {
    console.error('Failed to parse error response:', parseError); // Debug log
    return Promise.reject(`Error: ${res.status}`);
  }
}

// Helper to make authenticated requests with retry capability
async function makeRequest(url, options = {}) {
  const requestOptions = {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  };

  const response = await fetch(url, requestOptions);

  // Pass the original request info for potential retry
  return checkResponse(response, { url, options: requestOptions });
}

function createUser(user) {
  return makeRequest(`${baseUrl}/signup`, {
    method: "POST",
    body: JSON.stringify(user),
  });
}

function login(user) {
  return makeRequest(`${baseUrl}/signin`, {
    method: "POST",
    body: JSON.stringify(user),
  });
}

function createProfile(profile) {
  return makeRequest(`${baseUrl}/users/profile`, {
    method: "POST",
    body: JSON.stringify(profile),
  });
}

function getProfile() {
  return makeRequest(`${baseUrl}/users/profile`, {
    method: "GET",
  });
}

function logout() {
  return makeRequest(`${baseUrl}/logout`, {
    method: "POST",
  });
}

function updateProfile(profile) {
  return makeRequest(`${baseUrl}/users/profile`, {
    method: "PATCH",
    body: JSON.stringify(profile),
  });
}

function getAllEvents({ lat, lng, state, city, zipcode, dateFrom, dateTo } = {}) {
  const params = new URLSearchParams();
  if (lat) params.set("lat", lat);
  if (lng) params.set("lng", lng);
  if (state) params.set("state", state);
  if (city) params.set("city", city);
  if (zipcode) params.set("zipcode", zipcode);
  if (dateFrom) params.set("dateFrom", dateFrom);
  if (dateTo) params.set("dateTo", dateTo);
  const qs = params.toString();
  return makeRequest(`${baseUrl}/events${qs ? `?${qs}` : ""}`, { method: "GET" });
}

function markAsGoing(eventId) {
  return makeRequest(`${baseUrl}/events/${eventId}/going`, { method: "POST" });
}

function checkinAtEvent(eventId, lat, lng) {
  return makeRequest(`${baseUrl}/events/${eventId}/checkin`, {
    method: "POST",
    body: JSON.stringify({ lat, lng }),
  });
}

function checkoutFromEvent(eventId) {
  return makeRequest(`${baseUrl}/events/${eventId}/checkout`, { method: "POST" });
}

function getUsersAtEvent(eventId) {
  return makeRequest(`${baseUrl}/events/${eventId}/users`, { method: "GET" });
}

function deleteUser() {
  return makeRequest(`${baseUrl}/deleteUser`, {
    method: "DELETE",
  });
}

function deleteProfile() {
  return makeRequest(`${baseUrl}/users/profile`, {
    method: "DELETE",
  });
}

function uploadProfilePicture(file) {
  const formData = new FormData();
  formData.append('profilePicture', file);

  // For file uploads, we need to use fetch directly without setting Content-Type
  return fetch(`${baseUrl}/users/profile/picture`, {
    method: "POST",
    credentials: "include",
    body: formData,
  }).then((res) => checkResponse(res, {
    url: `${baseUrl}/users/profile/picture`,
    options: {
      method: "POST",
      credentials: "include",
      body: formData,
    }
  }));
}

function googleAuth(credential) {
  return makeRequest(`${baseUrl}/auth/google`, {
    method: "POST",
    body: JSON.stringify({ credential }),
  });
}

function googleAuthWithToken(accessToken) {
  return makeRequest(`${baseUrl}/auth/google/token`, {
    method: "POST",
    body: JSON.stringify({ accessToken }),
  });
}

function requestPasswordReset(email) {
  return makeRequest(`${baseUrl}/password-reset/request`, {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

function resetPassword(token, newPassword) {
  return makeRequest(`${baseUrl}/password-reset/reset`, {
    method: "POST",
    body: JSON.stringify({ token, newPassword }),
  });
}

function sendEmailVerification(email) {
  return makeRequest(`${baseUrl}/email-verification/send`, {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

function verifyEmail(token) {
  return makeRequest(`${baseUrl}/email-verification/verify`, {
    method: "POST",
    body: JSON.stringify({ token }),
  });
}

// Curated events (public - no auth)
function createCuratedEvent(eventData, photoFile) {
  const handleResponse = (res) => {
    if (!res.ok) {
      return res.json().then((data) => {
        throw new Error(data.message || "Failed to create event");
      });
    }
    return res.json();
  };

  if (photoFile) {
    // Send multipart FormData when a photo is included
    const formData = new FormData();
    Object.entries(eventData).forEach(([key, value]) => {
      if (value !== undefined && value !== "") formData.append(key, value);
    });
    formData.append("photo", photoFile);
    return fetch(`${baseUrl}/events`, { method: "POST", body: formData }).then(handleResponse);
  }

  // No photo — send as JSON (works with both old and new backend)
  return fetch(`${baseUrl}/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(eventData),
  }).then(handleResponse);
}

function getNearbyCuratedEvents(lat, lng, radiusKm = 10) {
  return fetch(`${baseUrl}/events/nearby?lat=${lat}&lng=${lng}&radiusKm=${radiusKm}`)
    .then((res) => {
      if (!res.ok) {
        return res.json().then((data) => {
          throw new Error(data.message || "Failed to fetch events");
        });
      }
      return res.json();
    });
}

export {
  createUser,
  login,
  createProfile,
  getProfile,
  logout,
  updateProfile,
  getAllEvents,
  markAsGoing,
  checkinAtEvent,
  checkoutFromEvent,
  getUsersAtEvent,
  deleteProfile,
  deleteUser,
  uploadProfilePicture,
  googleAuth,
  googleAuthWithToken,
  requestPasswordReset,
  resetPassword,
  sendEmailVerification,
  verifyEmail,
  refreshToken,
  createCuratedEvent,
  getNearbyCuratedEvents,
};
