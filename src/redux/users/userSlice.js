import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: "user",
    initialState: {
        loggedIn: false,
        username: "",
    },
    reducers: {
        userLogIn: (state, actions) => {
            state.loggedIn = true;
            state.username = actions.payload;
        },
        userLogOut: (state, actions) => {
            state.loggedIn = false;
        },
    },
});

export const { userLogIn, userLogOut } = userSlice.actions;
export default userSlice.reducer;
