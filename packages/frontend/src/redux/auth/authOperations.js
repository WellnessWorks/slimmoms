import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  userTransactionApi,
  setToken,
  removeToken,
} from "../../api/userTransactionApi.js";

const handleAuthError = (error, thunkAPI) => {
  let userMessage = "An error occurred, please try again."; // Varsayılan hata mesajı

  if (error.response) {
    const status = error.response.status;
    const backendMessage = error.response.data?.message;

    // Hata mesajları yönetimi
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
  } else {
    userMessage = "Could not send request. Please try again.";
  }

  return thunkAPI.rejectWithValue(userMessage);
};

export const logIn = createAsyncThunk(
  "auth/login",
  async (credentials, thunkAPI) => {
    try {
      const response = await userTransactionApi.post(
        "/api/v1/auth/login",
        credentials
      );
      setToken(response.data.token);
      return response.data;
    } catch (error) {
      return handleAuthError(error, thunkAPI);
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (credentials, thunkAPI) => {
    try {
      const response = await userTransactionApi.post(
        "api/v1/auth/register",
        credentials
      );
      setToken(response.data.token);
      return response.data;
    } catch (error) {
      return handleAuthError(error, thunkAPI);
    }
  }
);

export const logOut = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    const { data } = await userTransactionApi.delete("/api/v1/auth/logout");
    removeToken();
    return data;
  } catch (error) {
    return handleAuthError(error, thunkAPI);
  }
});

export const refreshUser = createAsyncThunk(
  "auth/refresh",
  async (_, thunkAPI) => {
    const savedToken = thunkAPI.getState().auth.token;
    if (savedToken) {
      setToken(savedToken);
    } else {
      return thunkAPI.rejectWithValue("Token not found");
    }

    try {
      const { data } = await userTransactionApi.get("/api/v1/auth/refresh");
      return data;
    } catch (error) {
      return handleAuthError(error, thunkAPI);
    }
  }
);
