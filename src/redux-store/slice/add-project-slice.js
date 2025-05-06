import { createSlice } from "@reduxjs/toolkit";

const addProjectIntialState = {
    projectName: "",
    projectDescription: "",
    ownerId: "",
    startDate: "",
    endDate: "",
    createdAt: "",
};

const addProjectSlice = createSlice({
    name: "addProject",
    initialState: addProjectIntialState,
    reducers: {
        addProject: (state, action) => {
            state.projectName = action.payload.projectName;
            state.projectDescription = action.payload.projectDescription;
            state.ownerId = action.payload.ownerId;
            state.startDate = action.payload.startDate;
            state.endDate = action.payload.endDate;
            state.createdAt = action.payload.createdAt;
        },
        resetProjectData: (state) => {
            state.projectName = "";
            state.projectDescription = "";
            state.ownerId = "";
            state.startDate = "";
            state.endDate = "";
            state.createdAt = "";
        },
    },
});

export const { addProject, resetProjectData } = addProjectSlice.actions;
export default addProjectSlice;