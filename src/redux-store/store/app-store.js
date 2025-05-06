import { configureStore } from "@reduxjs/toolkit";
import googleLoginSlice from "../slice/login-slice";
import addProjectSlice from "../slice/add-project-slice";

const store = configureStore({
  reducer: {
    login: googleLoginSlice.reducer,
    addProject: addProjectSlice.reducer,
  },
});

export default store;