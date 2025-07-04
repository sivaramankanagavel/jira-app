import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from '../../utils/axiosConfig';

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

// Update fetchProjects thunk
export const fetchProjects = createAsyncThunk(
  "fetch projects based on their userId",
  async ({ userId }) => {
    return axios
      // Change from /user/${userId} to ?userId=${userId}
      .get(`${process.env.REACT_APP_API_PROJECTS_USER}?userId=${userId}`)
      .then((response) => {
        console.log("Projects response:", response.data);
        return response?.data?.map(project => ({
          ...project,
          id: project._id,
          ownerName: project.ownerId?.name || 'Unknown'
        }));
      })
  }
);
