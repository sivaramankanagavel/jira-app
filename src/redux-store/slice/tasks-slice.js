import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const api = `http://localhost:8080/api/tasks/assigned?`;

const tasksInitialState = {
  tasks: [],
  isError: false,
  isPending: false,
};

const getTasksBasedOnProject = createSlice({
  name: "get-task-based-on-projects",
  initialState: tasksInitialState,
  extraReducers: (builder) => {
    builder
      .addCase(getTasks.pending, (state, action) => {
        state.isPending = true;
      })
      .addCase(getTasks.fulfilled, (state, action) => {
        state.tasks = action.payload;
        state.isPending = false;
      })
      .addCase(getTasks.rejected, (state, action) => {
        state.isError = true;
      });
  },
});

export default getTasksBasedOnProject;

export const getTasks = createAsyncThunk(
  "get the task based on userId and ProjectId",
  async ({projectId, userId}) => {
    console.log(projectId, userId);
    return axios
      .get(`${api + `userId=${userId}` + `&projectId=${projectId}`}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      })
      .then((result) => result?.data)
      .catch((error) => error);
  }
);
