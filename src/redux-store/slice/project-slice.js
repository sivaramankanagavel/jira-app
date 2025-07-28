import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  projects: [],
  isPending: false,
  isError: false,
};

// Async Thunk for fetching projects
export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects", // Unique action type
  async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}${process.env.REACT_APP_PROJECTS_ENDPOINT}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      );
      return response?.data;
    } catch (error) {
      return Promise.reject(error.message || "Failed to fetch projects");
    }
  }
);

// Async Thunk for adding a project
export const addProject = createAsyncThunk(
  "projects/addProject",
  async ({ projectData }, { dispatch }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}${process.env.REACT_APP_PROJECTS_ENDPOINT}`,
        projectData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      );
      dispatch(fetchProjects());
      return response.data;
    } catch (error) {
      return Promise.reject(error.message || "Failed to add project");
    }
  }
);

const projectSlice = createSlice({
  name: "projects",
  initialState: initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.isPending = true;
        state.isError = false;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.isPending = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state) => {
        state.isPending = false;
        state.isError = true;
      })
      .addCase(addProject.pending, (state) => {
        state.isPending = true;
        state.isError = false;
      })
      .addCase(addProject.fulfilled, (state) => {
        state.isPending = false;
      })
      .addCase(addProject.rejected, (state) => {
        state.isPending = false;
        state.isError = true;
      });
  },
});

export default projectSlice;