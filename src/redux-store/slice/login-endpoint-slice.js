import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// LOGIN END POINT URL:
const loginApi = process.env.REACT_APP_LOGIN_ENDPOINT;

const initialState = {
  userData: {
    readonly: null,
    isAdmin: null,
    userId: null,
    isError: null,
    jwt: "",
    isTaskCreator: null,
    expiration: null,
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
  "loginEndpoint/login",
  async ({ userEmail }) => {
    return axios
      .post(`${loginApi + userEmail}`, {}, { withCredentials: true })
      .then((response) => {
        localStorage.setItem("jwt", response.data.jwt);
        return {
          readonly: response?.data?.readonly,
          isAdmin: response?.data?.isAdmin,
          userId: response?.data?.userId,
          isError: response?.data?.isError,
          jwt: response?.data?.jwt,
          isTaskCreator: response?.data?.isTaskCreator,
          expiration: response?.data?.expiration,
        };
      })
      .catch(() => ({
        isError: true,
      }));
  }
);
