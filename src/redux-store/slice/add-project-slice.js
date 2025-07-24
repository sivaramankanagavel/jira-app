import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { fetchProjects } from "./project-slice";

export const addProject = createAsyncThunk(
  "Create Project",
  async ({ projectData }) => {
    return axios
      .post(
        `${process.env.REACT_APP_API_BASE_URL}${process.env.REACT_APP_PROJECTS_ENDPOINT}`,
        projectData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      )
      .then(() => {
        fetchProjects();
      })
      .catch((error) => error);
  }
);
