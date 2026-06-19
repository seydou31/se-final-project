export const baseUrl =
  process.env.NODE_ENV === "production"
    ? import.meta.env.VITE_API_BASE_URL
    : "http://localhost:3001";

let isRefreshing = false;
let refreshPromise = null;

// ─────────────────────────────────────────────
// Refresh Token
// ─────────────────────────────────────────────
async function refreshToken() {
  if (isRefreshing) {
    return refreshPromise;
  }

  isRefreshing = true;

  refreshPromise = fetch(`${baseUrl}/refresh-token`, {
    method: "POST",
    credentials: "include",
  })
    .then(async (res) => {
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

// ─────────────────────────────────────────────
// Handle API Response
// ─────────────────────────────────────────────
async function checkResponse(res, originalRequest) {
  if (res.ok) {
    return res.json();
  }

  // Handle Unauthorized
  if (res.status === 401) {
    try {
      const errorData = await res.json();

      // Try refresh if token expired
      if (errorData.tokenExpired) {
        await refreshToken();

        // Retry original request
        if (originalRequest) {
          const retryResponse = await fetch(
            originalRequest.url,
            originalRequest.options
          );

          return checkResponse(retryResponse, null);
        }
      }

      return Promise.reject(
        errorData.message || "Authorization Error"
      );
    } catch (err) {
      localStorage.removeItem("tokenExists");

      window.location.href = "/";

      return Promise.reject(
        "Session expired. Please login again."
      );
    }
  }

  // Other Errors
  try {
    const errorData = await res.json();

    return Promise.reject(
      errorData.message ||
        errorData.error ||
        `Error: ${res.status}`
    );
  } catch (err) {
    return Promise.reject(`Error: ${res.status}`);
  }
}

// ─────────────────────────────────────────────
// Shared Request Helper
// ─────────────────────────────────────────────
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

  return checkResponse(response, {
    url,
    options: requestOptions,
  });
}

// ─────────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────────

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

function logout() {
  return makeRequest(`${baseUrl}/logout`, {
    method: "POST",
  });
}

// ─────────────────────────────────────────────
// PROFILE
// ─────────────────────────────────────────────

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

function updateProfile(profile) {
  return makeRequest(`${baseUrl}/users/profile`, {
    method: "PATCH",
    body: JSON.stringify(profile),
  });
}

function deleteProfile() {
  return makeRequest(`${baseUrl}/users/profile`, {
    method: "DELETE",
  });
}

function deleteUser() {
  return makeRequest(`${baseUrl}/deleteUser`, {
    method: "DELETE",
  });
}

// ─────────────────────────────────────────────
// PROFILE PICTURE
// ─────────────────────────────────────────────

function uploadProfilePicture(file) {
  const formData = new FormData();

  formData.append("profilePicture", file);

  return fetch(`${baseUrl}/users/profile/picture`, {
    method: "POST",
    credentials: "include",
    body: formData,
  }).then((res) =>
    checkResponse(res, {
      url: `${baseUrl}/users/profile/picture`,
      options: {
        method: "POST",
        credentials: "include",
        body: formData,
      },
    })
  );
}

// ─────────────────────────────────────────────
// EVENTS
// ─────────────────────────────────────────────

function getAllEvents({
  lat,
  lng,
  state,
  city,
  zipcode,
  dateFrom,
  dateTo,
} = {}) {
  const params = new URLSearchParams();

  if (lat) params.set("lat", lat);
  if (lng) params.set("lng", lng);
  if (state) params.set("state", state);
  if (city) params.set("city", city);
  if (zipcode) params.set("zipcode", zipcode);
  if (dateFrom) params.set("dateFrom", dateFrom);
  if (dateTo) params.set("dateTo", dateTo);

  const qs = params.toString();

  return makeRequest(
    `${baseUrl}/events${qs ? `?${qs}` : ""}`,
    {
      method: "GET",
    }
  );
}

function markAsGoing(eventId) {
  return makeRequest(`${baseUrl}/events/${eventId}/going`, {
    method: "POST",
  });
}

function checkinAtEvent(eventId, lat, lng) {
  return makeRequest(`${baseUrl}/events/${eventId}/checkin`, {
    method: "POST",
    body: JSON.stringify({ lat, lng }),
  });
}

function heartbeat(eventId) {
  return makeRequest(`${baseUrl}/events/${eventId}/heartbeat`, {
    method: "POST",
  });
}

function checkoutFromEvent(eventId) {
  return makeRequest(`${baseUrl}/events/${eventId}/checkout`, {
    method: "POST",
  });
}

function getUsersAtEvent(eventId) {
  return makeRequest(`${baseUrl}/events/${eventId}/users`, {
    method: "GET",
  });
}

async function getCheckinStatus(eventId) {
  return await makeRequest(`${baseUrl}/events/${eventId}/checkin-status`, {
    method: "GET",
  });
}

// ─────────────────────────────────────────────
// GOOGLE AUTH
// ─────────────────────────────────────────────

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

// ─────────────────────────────────────────────
// PASSWORD RESET
// ─────────────────────────────────────────────

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

// ─────────────────────────────────────────────
// EMAIL VERIFICATION
// ─────────────────────────────────────────────

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

// ─────────────────────────────────────────────
// EVENT MANAGER AUTH
// ─────────────────────────────────────────────

function eventManagerRegister({
  email,
  password,
  name,
  inviteCode,
}) {
  return makeRequest(`${baseUrl}/event-managers/signup`, {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
      name,
      inviteCode,
    }),
  });
}

function eventManagerLogin({ email, password }) {
  return makeRequest(`${baseUrl}/event-managers/signin`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

function eventManagerLogout() {
  return makeRequest(`${baseUrl}/event-managers/logout`, {
    method: "POST",
  });
}

function eventManagerGetMe() {
  return makeRequest(`${baseUrl}/event-managers/me`, {
    method: "GET",
  });
}

function eventManagerGetDashboard() {
  return makeRequest(`${baseUrl}/event-managers/dashboard`, {
    method: "GET",
  });
}

function eventManagerGetDashboardStats() {
  return makeRequest(
    `${baseUrl}/event-managers/dashboard/stats`,
    {
      method: "GET",
    }
  );
}

function eventManagerGetOnboardingLink() {
  return makeRequest(
    `${baseUrl}/event-managers/stripe/onboard`,
    {
      method: "POST",
    }
  );
}

function eventManagerVerifyOnboarding() {
  return makeRequest(
    `${baseUrl}/event-managers/stripe/verify`,
    {
      method: "POST",
    }
  );
}

function eventManagerGetEvents({
  page = 1,
  limit = 10,
  search = "",
} = {}) {
  const params = new URLSearchParams({
    page,
    limit,
  });

  if (search) {
    params.set("search", search);
  }

  return makeRequest(
    `${baseUrl}/event-managers/events?${params}`,
    {
      method: "GET",
    }
  );
}

// ─────────────────────────────────────────────
// CURATED EVENTS
// ─────────────────────────────────────────────

async function createCuratedEvent(eventData, photoFile) {
  if (photoFile) {
    const formData = new FormData();

    Object.entries(eventData).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        formData.append(key, value);
      }
    });

    formData.append("photo", photoFile);

    const res = await fetch(`${baseUrl}/events`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    return await checkResponse(res, {
      url: `${baseUrl}/events`,
      options: {
        method: "POST",
        credentials: "include",
        body: formData,
      },
    });
  }

  return makeRequest(`${baseUrl}/events`, {
    method: "POST",
    body: JSON.stringify(eventData),
  });
}

function getNearbyCuratedEvents(
  lat,
  lng,
  radiusKm = 10
) {
  return makeRequest(
    `${baseUrl}/events/nearby?lat=${lat}&lng=${lng}&radiusKm=${radiusKm}`,
    {
      method: "GET",
    }
  );
}

// ─────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────

export {
  createUser,
  login,
  logout,

  createProfile,
  getProfile,
  updateProfile,
  deleteProfile,
  deleteUser,
  uploadProfilePicture,

  getAllEvents,
  markAsGoing,
  checkinAtEvent,
  heartbeat,
  checkoutFromEvent,
  getUsersAtEvent,
  getCheckinStatus,

  googleAuth,
  googleAuthWithToken,

  requestPasswordReset,
  resetPassword,

  sendEmailVerification,
  verifyEmail,

  refreshToken,

  createCuratedEvent,
  getNearbyCuratedEvents,

  eventManagerRegister,
  eventManagerLogin,
  eventManagerLogout,
  eventManagerGetMe,
  eventManagerGetDashboard,
  eventManagerGetDashboardStats,
  eventManagerGetOnboardingLink,
  eventManagerVerifyOnboarding,
  eventManagerGetEvents,
};