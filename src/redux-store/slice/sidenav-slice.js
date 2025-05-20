import { createSlice } from "@reduxjs/toolkit";

const sidenavInitialState = {
    isOpen: false,
};

const sidNavSlice = createSlice({
    name: 'sidenav',
    initialState: sidenavInitialState,
    reducers: {
        toggleSidenav: (state) => {
            state.isOpen = !state.isOpen;
        }
    }
});

export const { toggleSidenav } = sidNavSlice.actions;
export default sidNavSlice;