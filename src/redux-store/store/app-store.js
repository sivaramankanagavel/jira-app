import { configureStore } from "@reduxjs/toolkit";
import googleLoginSlice from "../slice/login-slice";
import addProjectSlice from "../slice/add-project-slice";
import adminSlice from "../slice/admin-slice";
import ticketsSlice from "../slice/ticket-slice";
import sideNavSlice from "../slice/sidenav-slice";

const store = configureStore({
  reducer: {
    login: googleLoginSlice.reducer,
    addProject: addProjectSlice.reducer,
    admin: adminSlice.reducer,
    tickets: ticketsSlice.reducer,
    sidenav: sideNavSlice.reducer
  },
});

export default store;