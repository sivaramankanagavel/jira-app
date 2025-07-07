import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../utils/axiosConfig";

const api = process.env.REACT_APP_API_TASKS_ASSIGNED;

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
    return axios.get(`${api}?projectId=${projectId}&userId=${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      withCredentials: true,
    });
  }
);

export const updateTaskStatus = createAsyncThunk(
  "Update Task Status",
  async ({ taskId, status }) => {
    return axios
      .put(`${process.env.REACT_APP_API_TASKS_UPDATE}/${taskId}`, { status })
      .then((result) => {
        return result?.data;
      });
  }
);

export const addTask = createAsyncThunk("Create Task", async ({ taskData }) => {
  return axios.post(process.env.REACT_APP_API_TASKS_ADD, taskData);
});
