import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// LOGIN END POINT URL:
const api = `${process.env.REACT_APP_API_BASE_URL}${process.env.REACT_APP_LOGIN_ENDPOINT}`;

const initialState = {
  userData: {
    readonly: null,
    isAdmin: null,
    userId: null,
    isError: null,
    jwt: null,
    isTaskCreator: null,
    expiration: null,
  },
  isError: false,
  isPending: false,
};

function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = decodeURIComponent(
      atob(base64Url)
        .split("")
        .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join("")
    );
    return JSON.parse(base64);
  } catch (e) {
    return null;
  }
}

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
  "loginEndpoint/login",
  async ({ idToken }) => {
    return axios
      .post(`${api}`, { idToken })
      .then((response) => {
        const { token: jwtToken, user } = response.data;
        if (!jwtToken || !user) {
          throw new Error("Invalid response from server");
        }
        localStorage.setItem("jwt", jwtToken);
        return {
          readonly: user.readonly || false, // add actual field if it exists
          isAdmin: user.role === "ADMIN",
          userId: user._id,
          isError: false,
          jwt: jwtToken,
          isTaskCreator: user.role === "TASK_CREATOR",
          expiration: parseJwt(jwtToken)?.exp || null,
        };
      })
      .catch(() => ({
        isError: true,
      }));
  }
);
