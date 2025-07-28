import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  auth,
  signInWithPopup,
  provider,
  signOutFunc,
} from "../../firebase/firebase.config";
import axios from "axios";

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

const authInitialState = {
  isLoggedIn: false,
  user: {
    uid: null,
    displayName: null,
    email: null,
    photoURL: null,
    providerId: null,
    idToken: null,
  },
  loginError: null,
  userData: {
    readonly: null,
    isAdmin: null,
    userId: null,
    isTaskCreator: null,
    expiration: null,
    jwt: null,
  },
  endpointIsError: false,
  endpointIsPending: false,
};

export const loginEndPointAsyncFunc = createAsyncThunk(
  "auth/loginEndPoint",
  async ({ idToken }) => {
    const api = `${process.env.REACT_APP_API_BASE_URL}${process.env.REACT_APP_LOGIN_ENDPOINT}`;
    try {
      const response = await axios.post(api, { idToken });
      const { token: jwtToken, user } = response.data;

      if (!jwtToken || !user) {
        throw new Error("Invalid response from server");
      }

      localStorage.setItem("jwt", jwtToken);
      const decodedToken = parseJwt(jwtToken);

      return {
        readonly: user.readonly || false,
        isAdmin: user.role === "ADMIN",
        userId: user._id,
        isTaskCreator: user.isTaskCreator || false,
        expiration: decodedToken ? decodedToken.exp * 1000 : null,
        jwt: jwtToken,
      };
    } catch (error) {
      return Promise.reject(error.message || "Backend login failed");
    }
  }
);

export const loginWithGoogle = createAsyncThunk(
  "auth/loginWithGoogle",
  async (_, { dispatch }) => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result?.user;
      const idToken = user.accessToken;

      await dispatch(loginEndPointAsyncFunc({ idToken }));

      return {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        providerId: user.providerId,
        idToken: idToken,
      };
    } catch (error) {
      return Promise.reject(error.message || "Google login failed");
    }
  }
);

export const logoutWithGoogle = createAsyncThunk(
  "auth/logoutWithGoogle",
  async () => {
    try {
      await signOutFunc();
      localStorage.removeItem("jwt");
      return true;
    } catch (error) {
      return Promise.reject(error.message || "Google logout failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: authInitialState,
  reducers: {
    setInitialAuthData: (state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn;
      state.user = action.payload.user;
      state.userData = action.payload.userData;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginWithGoogle.pending, (state) => {
        state.isLoggedIn = false;
        state.loginError = null;
        state.endpointIsPending = true;
        state.endpointIsError = false;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.user = action.payload;
        state.loginError = null;
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.isLoggedIn = false;
        state.user = authInitialState.user;
        state.loginError = action.payload;
        state.endpointIsPending = false;
        state.endpointIsError = true;
      })

      .addCase(logoutWithGoogle.pending, (state) => {
        state.isLoggedIn = true;
      })
      .addCase(logoutWithGoogle.fulfilled, (state) => {
        return authInitialState;
      })
      .addCase(logoutWithGoogle.rejected, (state, action) => {
        state.loginError = action.payload;
      })

      .addCase(loginEndPointAsyncFunc.pending, (state) => {
        state.endpointIsPending = true;
        state.endpointIsError = false;
      })
      .addCase(loginEndPointAsyncFunc.fulfilled, (state, action) => {
        state.userData = action.payload;
        state.endpointIsError = false;
        state.endpointIsPending = false;
        state.isLoggedIn = true;
        state.loginError = null;
      })
      .addCase(loginEndPointAsyncFunc.rejected, (state, action) => {
        state.endpointIsError = true;
        state.endpointIsPending = false;
        state.loginError = action.payload;
        state.isLoggedIn = false;
        state.user = authInitialState.user;
        state.userData = authInitialState.userData;
        localStorage.removeItem("jwt");
      });
  },
});

export const { setInitialAuthData } = authSlice.actions;
export default authSlice;