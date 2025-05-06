import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { auth, signInWithPopup, provider, signOutFunc } from "../../firebase/firebase.config";

const googleLoginInitialState = {
    isLoggedIn: false,
    user: null,
    error: null,
};

const googleLoginSlice = createSlice({
    name: "login",
    initialState: googleLoginInitialState,
    extraReducers: (builder) => {
        builder
            .addCase(loginWithGoogle.pending, (state) => {
                state.isLoggedIn = false;
                state.user = null;
                state.error = null;
            })
            .addCase(loginWithGoogle.fulfilled, (state, action) => {
                state.isLoggedIn = true;
                state.user = action.payload;
                state.error = null;
            })
            .addCase(loginWithGoogle.rejected, (state, action) => {
                state.isLoggedIn = false;
                state.user = null;
                state.error = action.payload;
            })
            .addCase(logoutWithGoogle.pending, (state) => {
                state.isLoggedIn = true;
                state.user = null;
                state.error = null;
            })
            .addCase(logoutWithGoogle.fulfilled, (state) => {
                state.isLoggedIn = false;
                state.user = null;
                state.error = null;
            })
            .addCase(logoutWithGoogle.rejected, (state, action) => {
                state.isLoggedIn = true;
                state.user = null;
                state.error = action.payload;
            });
    },
})

export const { login, logout } = googleLoginSlice.actions;
export default googleLoginSlice;

export const loginWithGoogle = createAsyncThunk(
    "login/loginWithGoogle",
    async (dispatch) => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            return {
                uid: user?.uid,
                displayName: user?.displayName,
                email: user?.email,
                photoURL: user?.photoURL,
              };
        } catch (error) {
            return dispatch(error?.message);
        }
    }
);

export const logoutWithGoogle = createAsyncThunk(
    "login/logoutWithGoogle",
    async (dispatch) => {
        try {
            await signOutFunc();
        } catch (error) {
            return dispatch(error.message);
        }
    }
);


