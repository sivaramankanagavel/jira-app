import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  projects: [],
  isPending: false,
  isError: false,
};

const projectSlice = createSlice({
  name: "projects",
  initialState: initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.isPending = true;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.isPending = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state) => {
        state.isPending = false;
        state.isError = true;
      });
  },
});

export default projectSlice;

export const fetchProjects = createAsyncThunk(
  "fetch projects based on their userId",
  async(userId) => {
    return axios
      .get(`http://localhost:8080/api/projects/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`
        },
      })
      .then((response) => response?.data)
      .catch((error) => error?.message);
  }
);
