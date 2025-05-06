import { createSlice } from "@reduxjs/toolkit";

const adminInitialState = {
    email: "",
    userType: "",
    project: "",
};

const adminSlice = createSlice({
    name: "admin",
    initialState: adminInitialState,
    reducers: {
        setAdminData: (state, action) => {
            return { ...state, ...action.payload };
        },
        resetAdminData: () => {
            return adminInitialState;
        },
    },
});

export const { setAdminData, resetAdminData } = adminSlice.actions;
export default adminSlice;