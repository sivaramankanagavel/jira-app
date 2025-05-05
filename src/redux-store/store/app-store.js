import { configureStore } from "@reduxjs/toolkit";
import googleLoginSlice, { loginWithGoogle } from "../slice/login-slice";

const store = configureStore({
  reducer: {
    login: googleLoginSlice.reducer,
  },
});

export default store;