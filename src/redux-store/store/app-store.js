// src/redux-store/store/app-store.js

import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../slice/auth-slice";
import sideNavSlice from "../slice/sidenav-slice";
import projectSlice from "../slice/project-slice";
import getTicketsBasedOnProject from "../slice/tasks-slice";

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    sidenav: sideNavSlice.reducer,
    projectsData: projectSlice.reducer,
    ticketsData: getTicketsBasedOnProject.reducer,
  },
});

export default store;