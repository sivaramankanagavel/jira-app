import { configureStore } from "@reduxjs/toolkit";
import googleLoginSlice from "../slice/login-slice";
import addProjectSlice from "../slice/add-project-slice";
import adminSlice from "../slice/admin-slice";
import sideNavSlice from "../slice/sidenav-slice";
import loginEndpointSlice from "../slice/login-endpoint-slice";
import projectSlice from "../slice/project-slice";
import getTicketsBasedOnProject from "../slice/tasks-slice";
import ticketsSlice from "../slice/ticket-slice";

const rootReducer = {
  // Authentication Group
  auth: {
    googleAuth: googleLoginSlice,
    backendAuth: loginEndpointSlice,
    admin: adminSlice,
  },
  
  // Project Management Group
  projects: {
    addProject: addProjectSlice,
    projectList: projectSlice,
  },
  
  // Task Management Group
  tasks: {
    apiTasks: getTicketsBasedOnProject,
    localTickets: ticketsSlice,
  },
  
  // UI State
  ui: {
    sidenav: sideNavSlice,
  }
};

const store = configureStore({
  reducer: combineNestedReducers(rootReducer),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

// Helper function to handle nested reducers
function combineNestedReducers(reducers) {
  return (state = {}, action) => {
    return Object.keys(reducers).reduce((nextState, key) => {
      if (typeof reducers[key] === 'object' && !reducers[key].reducer) {
        // Handle nested reducer objects
        nextState[key] = combineNestedReducers(reducers[key])(state[key], action);
      } else {
        // Handle regular reducers
        const reducer = reducers[key].reducer ? reducers[key].reducer : reducers[key];
        nextState[key] = reducer(state[key], action);
      }
      return nextState;
    }, {});
  };
}

export default store;