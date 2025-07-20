import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../utils/axiosConfig";

const initialState = {
  userData: {
    jwt: "",
    userId: null,
    name: null,
    email: null,
    role: null,
    emailVerified: null,
    oauthProviderId: null,
    createdAt: null,
    isError: null,
  },
  isError: false,
  isPending: false,
};

const loginEndpointSlice = createSlice({
  name: "loginEndpoint",
  initialState: initialState,
  extraReducers: (builder) => {
    builder
      .addCase(loginEndPointAsyncFunc.pending, (state) => {
        state.isPending = true;
      })
      .addCase(loginEndPointAsyncFunc.fulfilled, (state, action) => {
        state.userData = action.payload;
        state.isError = false;
        state.isPending = false;
      })
      .addCase(loginEndPointAsyncFunc.rejected, (state, action) => {
        state.isError = true;
        state.isPending = false;
      });
  },
});

export const { login, logout } = loginEndpointSlice.actions;
export default loginEndpointSlice;

export const loginEndPointAsyncFunc = createAsyncThunk(
  "auth/backendLogin",
  async ({ email, name, oauthProviderId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(process.env.REACT_APP_LOGIN_ENDPOINT, {
        email,
        name,
        oauthProviderId,
      });

      if (!response.data.token || !response.data.user) {
        throw new Error("Invalid response from server");
      }

      const { token, user } = response.data;
      localStorage.setItem("jwt", token); // Make sure this matches what your API expects

      return {
        jwt: token,
        userId: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
        oauthProviderId: user.oauthProviderId,
        createdAt: user.createdAt,
        isAdmin: user.role === "ADMIN",
        isTaskCreator: user.role === "TASK_CREATOR",
      };
    } catch (error) {
      // Clear any invalid token on error
      localStorage.removeItem("jwt");
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
