import { configureStore } from "@reduxjs/toolkit";
import googleLoginSlice from "../slice/login-slice";
import addProjectSlice from "../slice/add-project-slice";
import adminSlice from "../slice/admin-slice";
import sideNavSlice from "../slice/sidenav-slice";
import loginEndpointSlice from "../slice/login-endpoint-slice";
import projectSlice from "../slice/project-slice";
import getTicketsBasedOnProject from "../slice/tasks-slice";

const store = configureStore({
  reducer: {
    login: googleLoginSlice.reducer,
    addProject: addProjectSlice.reducer,
    admin: adminSlice.reducer,
    sidenav: sideNavSlice.reducer,
    loginEndpoint: loginEndpointSlice.reducer,
    projectsData: projectSlice.reducer,
    ticketsData: getTicketsBasedOnProject.reducer
  },
});

export default store;