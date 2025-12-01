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
    const { data } = await userTransactionApi.delete("/api/v1/auth/logout");

    removeToken();
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("email");

    return data;
  } catch (error) {
    return handleAuthError(error, thunkAPI);
  }
});

// REFRESH USER
export const refreshUser = createAsyncThunk(
  "auth/refresh",
  async (_, thunkAPI) => {
    const savedToken = localStorage.getItem("token");
    if (!savedToken) {
      return thunkAPI.rejectWithValue("Token not found");
    }

    setToken(savedToken);

    try {
      const { data } = await userTransactionApi.get("/api/v1/auth/refresh");
      return data;
    } catch (error) {
      return handleAuthError(error, thunkAPI);
    }
  }
);
