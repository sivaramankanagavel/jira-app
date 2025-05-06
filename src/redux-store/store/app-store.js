import { configureStore } from "@reduxjs/toolkit";
import googleLoginSlice from "../slice/login-slice";
import addProjectSlice from "../slice/add-project-slice";
import adminSlice from "../slice/admin-slice";

const store = configureStore({
  reducer: {
    login: googleLoginSlice.reducer,
    addProject: addProjectSlice.reducer,
    admin: adminSlice.reducer,
  },
});

export default store;