import axios from "axios";

// ==============================
// ENV
// ==============================
const API_BASE = import.meta.env.VITE_API_BASE;

// ==============================
// TOKEN STORAGE
// ==============================
let accessToken = localStorage.getItem("access") || null;
let refreshToken = localStorage.getItem("refresh") || null;

// ==============================
// AXIOS INSTANCE
// ==============================
const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

// ==============================
// TOKEN MANAGEMENT
// ==============================
export const setTokens = (access, refresh) => {
  accessToken = access || null;
  refreshToken = refresh || null;

  access
    ? localStorage.setItem("access", access)
    : localStorage.removeItem("access");

  refresh
    ? localStorage.setItem("refresh", refresh)
    : localStorage.removeItem("refresh");
};

export const loadTokens = () => {
  accessToken = localStorage.getItem("access");
  refreshToken = localStorage.getItem("refresh");
  return { access: accessToken, refresh: refreshToken };
};

export const logout = () => {
  accessToken = null;
  refreshToken = null;

  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("user");

  window.location.href = "/";
};

// ==============================
// USER STORAGE
// ==============================
export const setUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// ==============================
// JWT EXPIRY CHECK
// ==============================
const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expiry = payload.exp * 1000;
    return Date.now() > expiry - 60 * 1000; // refresh 1 min before expiry
  } catch {
    return true;
  }
};

// ==============================
// REFRESH CONTROL (IMPORTANT 🔥)
// ==============================
let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (cb) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (newToken) => {
  refreshSubscribers.forEach((cb) => cb(newToken));
  refreshSubscribers = [];
};

// ==============================
// REFRESH TOKEN FUNCTION
// ==============================
const refreshAccessToken = async () => {
  try {
    const res = await axios.post(`${API_BASE}/api/token/refresh/`, {
      refresh: refreshToken,
    });

    const newAccess = res.data.access;
    const newRefresh = res.data.refresh || refreshToken;

    setTokens(newAccess, newRefresh);

    return newAccess;
  } catch (err) {
    logout();
    throw err;
  }
};

// ==============================
// REQUEST INTERCEPTOR
// ==============================
api.interceptors.request.use(
  async (config) => {
    let token = accessToken || localStorage.getItem("access");

    // 🔥 Pre-emptive refresh
    if (token && isTokenExpired(token) && refreshToken) {
      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const newToken = await refreshAccessToken();
          isRefreshing = false;
          onRefreshed(newToken);
        } catch (err) {
          isRefreshing = false;
          throw err;
        }
      }

      // Queue requests while refreshing
      return new Promise((resolve) => {
        subscribeTokenRefresh((newToken) => {
          config.headers.Authorization = `Bearer ${newToken}`;
          resolve(config);
        });
      });
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ==============================
// RESPONSE INTERCEPTOR
// ==============================
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (!error.response) return Promise.reject(error);

    const status = error.response.status;
    const isRefresh = originalRequest?.url?.includes("/api/token/refresh/");

    if (status === 401 && !originalRequest._retry && !isRefresh) {
      originalRequest._retry = true;

      if (!refreshToken) {
        logout();
        return Promise.reject(error);
      }

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const newToken = await refreshAccessToken();
          isRefreshing = false;
          onRefreshed(newToken);
        } catch (err) {
          isRefreshing = false;
          return Promise.reject(err);
        }
      }

      return new Promise((resolve) => {
        subscribeTokenRefresh((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          resolve(api(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  }
);

// ==============================
// AUTH APIs
// ==============================
export const studentLogin = async (username, password) => {
  const res = await api.post("/api/accounts/student/login/", {
    username,
    password,
  });

  const { access, refresh, user } = res.data;

  setTokens(access, refresh);
  setUser(user);

  return res.data;
};

export const changePassword = async (newPassword) => {
  const res = await api.post("/api/accounts/force-password-reset/", {
    new_password: newPassword,
  });

  return res.data;
};

// ==============================
// LEARNING MODULE
// ==============================
export const getServices = async () => {
  const user = getUser();
  if (!user?.school_id) throw new Error("No school_id found");

  const res = await api.get(
    `/api/learning/services/?school_id=${user.school_id}`
  );

  return res.data;
};

export const getTheoryTopics = async (serviceId) => {
  const user = getUser();
  const gradeId = parseInt(user?.grade_name);

  const res = await api.get(
    `/api/learning/theory/?grade_id=${gradeId}&service_id=${serviceId}`
  );

  return res.data;
};

export const getTopicDetail = async (topicId) =>
  (await api.get(`/api/learning/theory/${topicId}/`)).data;

export const getTests = async (serviceId) => {
  const user = getUser();
  const gradeId = parseInt(user?.grade_name);

  const res = await api.get(
    `/api/learning/case-studies/?service_id=${serviceId}&grade_id=${gradeId}`
  );

  return res.data;
};

export const getCaseStudyDetail = async (id) =>
  (await api.get(`/api/learning/case-studies/${id}/`)).data;

export const submitCaseStudyAnswers = async (id, answers) =>
  (
    await api.post(`/api/learning/case-studies/${id}/submit/`, { answers })
  ).data;

// ==============================
// PROFILE
// ==============================
export const getStudentProfile = async () => {
  const res = await api.get("/api/accounts/student/profile/");
  return res.data;
};

export const updateStudentProfile = async (data) => {
  const res = await api.put("/api/accounts/student/profile/update/", data);
  return res.data;
};

// ==============================
export default api;