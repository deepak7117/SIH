// Use a relative path in production (same-origin on Vercel) and fall back
// to the local Express server during development.
const API_URL = import.meta.env.DEV ? 'http://localhost:5001/api' : '/api';

// ==========================================
// 1. Admin Authentication API
// ==========================================
export const loginAdminApi = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/admin-login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Admin login failed');
  }
  return data;
};

// Fetch real registered users from MongoDB for Admin Dashboard
export const fetchAdminUsersApi = async (token) => {
  const response = await fetch(`${API_URL}/auth/admin/users`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch registered users');
  }
  return data;
};

// ==========================================
// 2. User / Traveler Authentication & SMS OTP API
// ==========================================

// Send OTP to phone number via SMS
export const sendUserOtpApi = async (phone) => {
  const response = await fetch(`${API_URL}/auth/user/send-otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ phone }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to send SMS OTP');
  }
  return data;
};

// Register new User with SMS OTP
export const registerUserApi = async ({ name, email, password, phone, otp }) => {
  const response = await fetch(`${API_URL}/auth/user/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password, phone, otp }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Registration failed');
  }
  return data;
};

// Login user with Email / Phone & Password
export const loginUserApi = async (emailOrPhone, password) => {
  const response = await fetch(`${API_URL}/auth/user/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ emailOrPhone, password }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'User login failed');
  }
  return data;
};

// Login user directly via SMS OTP
export const loginUserWithOtpApi = async (phone, otp) => {
  const response = await fetch(`${API_URL}/auth/user/login-with-otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ phone, otp }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'OTP login failed');
  }
  return data;
};

// Get User Profile
export const getUserProfileApi = async (token) => {
  const response = await fetch(`${API_URL}/auth/user/profile`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch user profile');
  }
  return data;
};

// ==========================================
// 3. Places CRUD API
// ==========================================
export const fetchPlacesApi = async () => {
  const response = await fetch(`${API_URL}/places`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch places');
  }
  return data;
};

export const createPlaceApi = async (placeData, token) => {
  const response = await fetch(`${API_URL}/places`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(placeData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to create place');
  }
  return data;
};

export const updatePlaceApi = async (id, placeData, token) => {
  const response = await fetch(`${API_URL}/places/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(placeData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to update place');
  }
  return data;
};

export const deletePlaceApi = async (id, token) => {
  const response = await fetch(`${API_URL}/places/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to delete place');
  }
  return data;
};

// ==========================================
// 3b. Place QR Code API
// ==========================================

// Base64 QR preview for a place that already has a QR value (public)
export const getPlaceQrPreviewApi = async (id) => {
  const response = await fetch(`${API_URL}/places/${id}/qr/preview`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to load QR preview');
  }
  return data; // { qrDataUrl }
};

// (Re)generates a place's QR value — admin only. Used as a one-click
// backfill for older places saved before QR codes were auto-generated.
export const generatePlaceQrApi = async (id, token) => {
  const response = await fetch(`${API_URL}/places/${id}/qr`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to generate QR code');
  }
  return data; // { place, qrDataUrl }
};

// Direct download URL for a place's QR PNG — hand this straight to an
// <a href download> so the browser saves the file with one click.
export const getPlaceQrDownloadUrl = (id) => `${API_URL}/places/${id}/qr/download`;

// Resolve a value decoded from a scanned QR code to the place it belongs
// to (the place must have been given that QR value by an admin).
export const lookupPlaceByQrApi = async (qrValue) => {
  const response = await fetch(`${API_URL}/places/qr/lookup/${encodeURIComponent(qrValue)}`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'QR code not recognized');
  }
  return data; // place document
};

// Generate live destination using Google Gemini AI
export const generateLivePlaceApi = async (query) => {
  const response = await fetch(`${API_URL}/places/generate-live`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to generate place with AI');
  }
  return data;
};

// ==========================================
// 4. User Search & Travel History Database APIs
// ==========================================

export const fetchUserHistoryApi = async (userIdentifier) => {
  const response = await fetch(`${API_URL}/history/${encodeURIComponent(userIdentifier)}`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch user history');
  }
  return data;
};

export const saveUserHistoryApi = async (historyData) => {
  const response = await fetch(`${API_URL}/history`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(historyData),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to save history');
  }
  return data;
};

export const deleteUserHistoryApi = async (id) => {
  const response = await fetch(`${API_URL}/history/${id}`, {
    method: 'DELETE',
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to delete history item');
  }
  return data;
};

export const clearUserHistoryApi = async (userIdentifier) => {
  const response = await fetch(`${API_URL}/history/clear/${encodeURIComponent(userIdentifier)}`, {
    method: 'DELETE',
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to clear user history');
  }
  return data;
};

export const updateUserRewardPointsApi = async (userIdentifier, points) => {
  const response = await fetch(`${API_URL}/history/points/${encodeURIComponent(userIdentifier)}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ points }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to update reward points');
  }
  return data;
};



