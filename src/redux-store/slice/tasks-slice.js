import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const api = process.env.REACT_APP_API_TASKS_ASSIGNED;
const apiUpdate = process.env.REACT_APP_API_TASKS_UPDATE;
const apiAddTask = process.env.REACT_APP_API_TASKS_ADD;

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
  async ({ projectId, userId }) => {
    return axios
      .get(`${api + `userId=${userId}` + `&projectId=${projectId}`}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        withCredentials: true, // Added here
      })
      .then((result) => {
        return result?.data;
      })
      .catch((error) => error);
  }
);

export const updateTaskStatus = createAsyncThunk(
  "Update Task Status",
  async ({ userId, projectId, taskId, status }) => {
    return axios
      .put(
        `${apiUpdate}`,
        { userId, projectId, taskId, status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
          withCredentials: true,
        }
      )
      .then((result) => {
        return result?.data;
      })
      .catch((error) => error);
  }
);

export const addTask = createAsyncThunk("Create Task", async ({ taskData }) => {
  const { description, dueDate, assigneeId, projectId, ownerId } = taskData;
  return axios
    .post(
      `${apiAddTask}`,
      { description, dueDate, assigneeId, projectId, ownerId },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        withCredentials: true,
      }
    )
    .then((result) => {
      return result?.data;
    })
    .catch((error) => error);
});
