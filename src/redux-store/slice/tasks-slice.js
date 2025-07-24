import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const api = `http://localhost:8080/api/tasks/assigned?`;
const apiUpdate = `http://localhost:8080/api/tasks/update-status`;
const apiAddTask = `http://localhost:8080/api/tasks`;

const ticketInitialState = {
  tickets: [],
  isError: false,
  isPending: false,
  projectId: null,
};

const getTicketsBasedOnProject = createSlice({
  name: "get-task-based-on-projects",
  initialState: ticketInitialState,
  extraReducers: (builder) => {
    builder
      .addCase(getTickets.pending, (state, action) => {
        state.isPending = true;
      })
      .addCase(getTickets.fulfilled, (state, action) => {
        state.tickets = action.payload;
        state.projectId = action.meta.arg.projectId;
        state.isPending = false;
      })
      .addCase(getTickets.rejected, (state, action) => {
        state.isError = true;
      });
  },
});

export default getTicketsBasedOnProject;

export const getTickets = createAsyncThunk(
  "get the task based on userId and ProjectId",
  async ({ projectId }) => {
    return axios
      .get(
        `${process.env.REACT_APP_API_BASE_URL}${process.env.REACT_APP_API_TASKS_AND_PROJECTS}/${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      )
      .then((result) => {
        return result?.data;
      })
      .catch((error) => error);
  }
);

export const updateTaskStatus = createAsyncThunk(
  "Update Task Status",
  async ({ taskId, updatedData }) => {
    return axios
      .put(
        `${process.env.REACT_APP_API_BASE_URL}${process.env.REACT_APP_API_TASKS}/${taskId}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      )
      .then((result) => {
        return result?.data;
      })
      .catch((error) => error);
  }
);

export const addTask = createAsyncThunk("Create Task", async ({ taskData }) => {
  return axios
    .post(
      `${process.env.REACT_APP_API_BASE_URL}${process.env.REACT_APP_API_TASKS}`,
      taskData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      }
    )
    .then((result) => {
      return result?.data;
    })
    .catch((error) => error);
});
