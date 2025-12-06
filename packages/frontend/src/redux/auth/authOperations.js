import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  userTransactionApi,
  setToken,
  removeToken,
} from "../../api/userTransactionApi.js";

const handleAuthError = (error, thunkAPI) => {
  let userMessage = "An error occurred, please try again.";

  if (error.response) {
    const status = error.response.status;
    const backendMessage = error.response.data?.message;

    if (
      status === 400 &&
      backendMessage?.toLowerCase().includes("email in use")
    ) {
      userMessage = "This email address is already registered.";
    } else if (status === 400) {
      userMessage = "Invalid request. Please check your information.";
    } else if (status === 401) {
      userMessage = "Incorrect email or password, or your session has expired.";
    } else if (status === 403) {
      userMessage = "Password is incorrect";
    } else if (status === 404) {
      userMessage = "User with this email address not found.";
    } else if (status === 409) {
      userMessage = "This email address is already in use.";
    } else if (backendMessage) {
      userMessage = backendMessage;
    } else if (status === 500) {
      userMessage = "Server error. Please try again later.";
    }
  } else if (error.request) {
    userMessage =
      "Cannot reach the server. Please check your internet connection.";
  }

  return thunkAPI.rejectWithValue(userMessage);
};

// LOGIN
export const logIn = createAsyncThunk(
  "auth/login",
  async (credentials, thunkAPI) => {
    try {
      const response = await userTransactionApi.post(
        "/api/v1/auth/login",
        credentials
      );

      const { accessToken, refreshToken, user } = response.data;

      // 🔐 TOKEN’I TARAYICIYA KAYDET
      localStorage.setItem("token", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("email", user.email);

      // 🔐 AXIOS’A TOKEN EKLE → HER request Authorization header ile gider
      setToken(accessToken);

      return response.data;
    } catch (error) {
      return handleAuthError(error, thunkAPI);
    }
  }
);

// REGISTER
export const register = createAsyncThunk(
  "auth/register",
  async (credentials, thunkAPI) => {
    try {
      const response = await userTransactionApi.post(
        "/api/v1/auth/register",
        credentials
      );

      const { accessToken, refreshToken, user } = response.data;

      localStorage.setItem("token", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("email", user.email);

      setToken(accessToken);

      return response.data;
    } catch (error) {
      return handleAuthError(error, thunkAPI);
    }
  }
);

// LOGOUT
export const logOut = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");

    // Eğer token yoksa, direkt temizle ve reject et
    if (!refreshToken) {
      // cleanup yine yapılıyor
      removeToken();
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("email");
      return thunkAPI.rejectWithValue("No refresh token found");
    }

    // backend'in /api/v1 prefıx'i userTransactionApi içinde tanımlıysa sadece '/auth/logout' yaz
    await userTransactionApi.post(
      "/api/v1/auth/logout",
      { refreshToken },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    // logout başarılı (server 204 No Content ya da 200 dönmüş olabilir)
    // temizleme:
    removeToken();
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("email");

    return; // başarılı dönüş
  } catch (error) {
    // cleanup yine yap (aynı davranışı sürdürmek istiyorsan)
    removeToken();
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("email");

    return handleAuthError(error, thunkAPI);
  }
});

// REFRESH USER
export const refreshUser = createAsyncThunk(
  "auth/refresh",
  async (_, thunkAPI) => {
    const savedRefreshToken = localStorage.getItem("refreshToken");
    if (!savedRefreshToken) {
      return thunkAPI.rejectWithValue("Refresh token not found");
    }

    try {
      // 1) Refresh token ile yeni access+refresh iste
      const refreshRes = await userTransactionApi.post("/api/v1/auth/refresh", {
        refreshToken: savedRefreshToken,
      });

      const { accessToken, refreshToken } = refreshRes.data;

      // LocalStorage güncelle
      localStorage.setItem("token", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      // Axios'a yeni access token'ı yaz
      setToken(accessToken);

      // 2) Yeni access token ile profil çek (/users/me)
      const meRes = await userTransactionApi.get("/api/v1/users/me");
      const user = meRes.data.user || meRes.data;

      if (user?.email) {
        localStorage.setItem("email", user.email);
      }

      // Slice'a hem user hem token'ları gönder
      return { user, accessToken, refreshToken };
    } catch (error) {
      // Refresh patlarsa tamamen logout say
      removeToken();
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("email");

      return handleAuthError(error, thunkAPI);
    }
  }
);
