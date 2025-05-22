import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  auth,
  signInWithPopup,
  provider,
  signOutFunc,
} from "../../firebase/firebase.config";

const googleLoginInitialState = {
  isLoggedIn: false,
  user: {
    uid: null,
    displayName: null,
    email: null,
    photoURL: null,
    providerId: null,
  },
  error: null,
};

const googleLoginSlice = createSlice({
  name: "login",
  initialState: googleLoginInitialState,
  extraReducers: (builder) => {
    builder
      .addCase(loginWithGoogle.pending, (state) => {
        state.isLoggedIn = false;
        state.user = null;
        state.error = null;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.isLoggedIn = false;
        state.user = null;
        state.error = action.payload;
      })
      .addCase(logoutWithGoogle.pending, (state) => {
        state.isLoggedIn = true;
        state.user = null;
        state.error = null;
      })
      .addCase(logoutWithGoogle.fulfilled, (state) => {
        state.isLoggedIn = false;
        state.user = null;
        state.error = null;
      })
      .addCase(logoutWithGoogle.rejected, (state, action) => {
        state.isLoggedIn = true;
        state.user = null;
        state.error = action.payload;
      });
  },
});

export const { login, logout } = googleLoginSlice.actions;
export default googleLoginSlice;

export const loginWithGoogle = createAsyncThunk("login/loginWithGoogle", () =>
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result?.user;
      return {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        providerId: user.providerId,
      };
    })
    .catch((error) => {
      return error?.message;
    })
);

export const logoutWithGoogle = createAsyncThunk("login/logoutWithGoogle", () =>
  signOutFunc()
    .then(() => {})
    .catch((error) => Promise.reject(error.message))
);
